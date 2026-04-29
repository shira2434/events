const express = require('express');
const multer = require('multer');
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT Email FROM Users WHERE Id = $1', [req.params.userId]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Not found' });
    res.json({ Email: result.rows[0].email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        CASE WHEN SenderId = $1 THEN ReceiverId ELSE SenderId END AS "OtherUserId",
        u.Email,
        (SELECT COUNT(*) FROM ChatMessages
         WHERE ReceiverId = $1
         AND SenderId = CASE WHEN cm.SenderId = $1 THEN cm.ReceiverId ELSE cm.SenderId END
         AND IsRead = false) AS "UnreadCount"
      FROM ChatMessages cm
      JOIN Users u ON u.Id = CASE WHEN SenderId = $1 THEN ReceiverId ELSE SenderId END
      WHERE SenderId = $1 OR ReceiverId = $1
    `, [req.user.id]);
    res.json(result.rows.map(r => ({
      OtherUserId: r.OtherUserId, Email: r.Email, UnreadCount: parseInt(r.UnreadCount) || 0
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:targetId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ChatMessages
      WHERE (SenderId = $1 AND ReceiverId = $2) OR (SenderId = $2 AND ReceiverId = $1)
      ORDER BY SentAt ASC
    `, [req.user.id, req.params.targetId]);

    // סמן כנקרא רק הודעות שנשלחו אלי
    await pool.query(
      'UPDATE ChatMessages SET IsRead = true WHERE ReceiverId = $1 AND SenderId = $2 AND IsRead = false',
      [req.user.id, req.params.targetId]
    );

    res.json(result.rows.map(m => ({
      Id: m.id, SenderId: m.senderid, ReceiverId: m.receiverid,
      Content: m.content, IsRead: m.isread, SentAt: m.sentat,
      ImageData: m.imagedata || null
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ChatMessages (SenderId, ReceiverId, Content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, receiverId, content]
    );
    const m = result.rows[0];
    res.status(201).json({ Id: m.id, SenderId: m.senderid, ReceiverId: m.receiverid, Content: m.content, SentAt: m.sentat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// שליחת תמונה
router.post('/image', authMiddleware, upload.single('image'), async (req, res) => {
  const { receiverId } = req.body;
  try {
    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    // שמור את התמונה כ-content עם prefix מיוחד
    const result = await pool.query(
      'INSERT INTO ChatMessages (SenderId, ReceiverId, Content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, receiverId, `__IMAGE__${dataUrl}`]
    );
    const m = result.rows[0];
    res.status(201).json({ Id: m.id, SenderId: m.senderid, ReceiverId: m.receiverid, Content: m.content, SentAt: m.sentat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:targetId', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM ChatMessages WHERE (SenderId = $1 AND ReceiverId = $2) OR (SenderId = $2 AND ReceiverId = $1)',
      [req.user.id, req.params.targetId]
    );
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

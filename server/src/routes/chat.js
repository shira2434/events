const express = require('express');
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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
    console.error('GET /chat error:', err.message);
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

    await pool.query(
      'UPDATE ChatMessages SET IsRead = true WHERE ReceiverId = $1 AND SenderId = $2',
      [req.user.id, req.params.targetId]
    );

    res.json(result.rows.map(m => ({
      Id: m.id, SenderId: m.senderid, ReceiverId: m.receiverid,
      Content: m.content, IsRead: m.isread, SentAt: m.sentat
    })));
  } catch (err) {
    console.error('GET /chat/:targetId error:', err.message);
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
    console.error('POST /chat error:', err.message);
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

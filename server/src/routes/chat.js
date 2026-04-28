const express = require('express');
const { pool, poolConnect, sql } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get conversation with a specific user
router.get('/:targetId', authMiddleware, async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .input('me', sql.Int, req.user.id)
      .input('target', sql.Int, req.params.targetId)
      .query(`SELECT * FROM ChatMessages
              WHERE (SenderId = @me AND ReceiverId = @target) OR (SenderId = @target AND ReceiverId = @me)
              ORDER BY SentAt ASC`);

    // Mark messages as read
    await pool.request()
      .input('me', sql.Int, req.user.id)
      .input('target', sql.Int, req.params.targetId)
      .query('UPDATE ChatMessages SET IsRead = 1 WHERE ReceiverId = @me AND SenderId = @target');

    res.json(result.recordset);
  } catch (err) {
    console.error('GET /chat/:targetId error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all conversations (list of users I chatted with)
router.get('/', authMiddleware, async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .input('me', sql.Int, req.user.id)
      .query(`SELECT DISTINCT
                CASE WHEN SenderId = @me THEN ReceiverId ELSE SenderId END AS OtherUserId,
                u.Email,
                (SELECT COUNT(*) FROM ChatMessages WHERE ReceiverId = @me AND SenderId = CASE WHEN cm.SenderId = @me THEN cm.ReceiverId ELSE cm.SenderId END AND IsRead = 0) AS UnreadCount
              FROM ChatMessages cm
              JOIN Users u ON u.Id = CASE WHEN SenderId = @me THEN ReceiverId ELSE SenderId END
              WHERE SenderId = @me OR ReceiverId = @me`);
    res.json(result.recordset);
  } catch (err) {
    console.error('GET /chat error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Send a message
router.post('/', authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;
  console.log('POST /chat | senderId from token:', req.user.id, '| receiverId:', receiverId);
  try {
    await poolConnect;
    const result = await pool.request()
      .input('senderId', sql.Int, req.user.id)
      .input('receiverId', sql.Int, receiverId)
      .input('content', sql.NVarChar, content)
      .query('INSERT INTO ChatMessages (SenderId, ReceiverId, Content) OUTPUT INSERTED.* VALUES (@senderId, @receiverId, @content)');
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('POST /chat error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

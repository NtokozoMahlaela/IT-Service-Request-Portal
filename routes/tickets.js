const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create new ticket
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const ticket = new Ticket({
      title,
      description,
      category,
      priority,
      createdBy: req.userId
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tickets (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const tickets = await Ticket.find().populate('createdBy', 'username').populate('assignedTo', 'username');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's tickets
router.get('/my-tickets', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.userId }).populate('createdBy', 'username');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update ticket status (admin only)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    ticket.status = req.body.status;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

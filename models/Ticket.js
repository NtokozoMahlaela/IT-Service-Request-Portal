const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    required: true
  },
  resolutionTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate resolution time when ticket is closed
ticketSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Closed') {
    this.resolutionTime = new Date();
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);

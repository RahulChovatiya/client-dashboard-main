// src/models/emailSchema.js
const mongoose = require('mongoose');

const sentEmailSchema = new mongoose.Schema({
  emailSubject: { type: String, required: true },
  emailDescription: { type: String, required: true },
  clientEmails: [{ type: String, required: true }],
  senderEmail: { type: String, required: true }, // Ensure this field is included
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SentEmail', sentEmailSchema);

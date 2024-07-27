const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pan: {
    type: String,
    required: false // Remove or set to false if not required
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/ // Simple email validation
  }
});

module.exports = mongoose.model('Client', clientSchema);

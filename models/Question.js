const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['interests', 'lifestyle', 'values', 'hobbies', 'preferences'],
    required: true
  },
  type: {
    type: String,
    enum: ['multiple', 'text', 'scale'],
    default: 'multiple'
  },
  options: [String],
  weight: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Question', questionSchema);

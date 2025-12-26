const mongoose = require('mongoose');

const AllSkillSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('AllSkill', AllSkillSchema);


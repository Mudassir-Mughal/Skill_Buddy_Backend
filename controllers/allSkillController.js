const AllSkill = require('../models/allskill');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await AllSkill.find({}).lean();
    res.json(skills.map(skill => ({ _id: skill._id, title: skill.title })));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all skills', error: err.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const newSkill = new AllSkill({ title });
    await newSkill.save();
    res.status(201).json({ _id: newSkill._id, title: newSkill.title });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Skill already exists' });
    } else {
      res.status(500).json({ message: 'Failed to add skill', error: err.message });
    }
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AllSkill.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Skill not found' });
    res.status(200).json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete skill', error: err.message });
  }
};

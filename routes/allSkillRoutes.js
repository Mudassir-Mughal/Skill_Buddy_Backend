const express = require('express');
const router = express.Router();
const allSkillController = require('../controllers/allSkillController');

router.get('/', allSkillController.getAllSkills);
router.post('/', allSkillController.addSkill);
router.delete('/:id', allSkillController.deleteSkill);

module.exports = router;

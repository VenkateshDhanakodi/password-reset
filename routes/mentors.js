var express = require('express');
var router = express.Router();
const mentorController = require('../Controllers/mentorController');

// Endpoint to create a new mentor
router.post('/createMentor', mentorController.createMentor);
// Endpoint to assign a student to a mentor
router.post('/assignStudent', mentorController.assignStudent);
// Endpoint to get a list of all mentors
router.get('/allMentors', mentorController.allMentors);
// Endpoint to get a list of unassigned students
router.get('/unAssignedStudents', mentorController.unAssignedStudents);

// Exporting the router module
module.exports = router;

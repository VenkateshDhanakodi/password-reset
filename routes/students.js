const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');

// Endpoint to get data for all students
router.get('/getAllStudentData', studentController.getAllStudentData);
// Endpoint to create a new student
router.post('/createStudent', studentController.createStudent);
// Endpoint to assign or change a mentor for a student
router.post('/assignOrChangeMentor', studentController.assignOrChangeMentor);
// Endpoint to get a list of students assigned to a specific mentor
router.get('/getAllstudentByMentor/:id', studentController.getAllstudentByMentor);
// Endpoint to get the previous mentor of a student by their name
router.get('/previousMentor/:studentName', studentController.previousMentor);

// Exporting the router module
module.exports = router;

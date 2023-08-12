// Importing necessary modules and configurations
const { dbName, dbUrl, MongoClient } = require('../Config/dbConfig');

// Creating a new MongoClient and connecting to the database
const client = new MongoClient(dbUrl);
client.connect();

// Getting a reference to the database
let db = client.db(dbName);

// Defining the mentor controller object
const mentorController = {
    // Creating a new mentor
    createMentor: async (req, res) => {
        try {
            // Checking if required fields are provided
            if (!req.body.mentorName || !req.body.email) {
                return res.status(400).send("Please provide the Mentor Name and email to create the Mentor");
            }

            // Checking if mentor with the same email already exists
            const mentorExist = await db.collection('mentors').findOne({ email: req.body.email });
            if (!mentorExist) {
                // Inserting the new mentor
                const newMentor = await db.collection('mentors').insertOne(req.body);
                return res.status(201).send({
                    newMentor,
                    message: "Mentor being added successfully"
                });
            } else {
                return res.status(400).send("Mentor already exists with the same Email");
            }
        } catch (err) {
            console.error("Error creating mentor:", err);
            res.status(400).send({ err: "Failed to create mentor" });
        }
    },

// collecting unAssigned Students list
unAssignedStudents: async (req, res) => {
    try {
        const unAssignedStudents = await db.collection('students').find({
            $or: [
                { mentor: "" },        // Students without mentor assignment
                { mentor: { $exists: false } } // Students without mentor field
            ]
        }).toArray();
        
        const unAssignedStudentsNames = unAssignedStudents.map((e) => e.studentName);
        
        res.status(200).send({
            unAssignedStudentsList: unAssignedStudentsNames
        });
    } catch (err) {
        console.error("Error getting Unassigned Students:", err);
        res.status(400).send({ err: "Failed to get Unassigned Students" });
    }
},

    // Assigning students to a mentor
    assignStudent: async (req, res) => {
        try {
          // Checking if the mentor exists
          const mentorExist = await db.collection('mentors').findOne({ mentorName: req.body.mentorName });
      
          if (!mentorExist) {
            return res.status(400).send("Mentor is not available in the mentors list. Create mentor to assign students.");
          }
      
          // Getting the list of students to be assigned
          const students_to_be_assigned = req.body.students.map(student => student);
      
          // Checking if all given students exist
          const studentsExists = await db.collection('students').find({ studentName: { $in: students_to_be_assigned } }).toArray();
          if (students_to_be_assigned.length !== studentsExists.length) {
            return res.status(400).send("One or more given studentName is not found in the students list. Create student to assign mentor.");
          }
      
          const mentorName = mentorExist.mentorName;
      
          // Checking if mentor is already assigned to any student
          const IsMentorAssigned = studentsExists.some(student => student.mentor);
          if (!IsMentorAssigned) {
            // Fetch the existing students of the mentor
            const existingStudents = mentorExist.students || [];
      
            // Merge new assigned students with existing students
            const updatedStudents = [...existingStudents, ...students_to_be_assigned];
      
            // Updating mentor field for assigned students in both mentors and students collections
            await db.collection('mentors').updateOne({ mentorName: mentorName }, { $set: { students: updatedStudents } });
      
            await db.collection('students').updateMany({ studentName: { $in: students_to_be_assigned } }, { $set: { mentor: mentorName } });
            return res.status(201).send({
              message: `The students ${students_to_be_assigned} added to the mentor ${mentorName}`
            });
          } else {
            return res.status(400).send("Mentor is already assigned for one of the students");
          }
        } catch (err) {
          console.error("Error assigning mentor:", err);
          res.status(400).send({ err: "Failed to assign mentor" });
        }
      },      

    //View all mentors with student list
    allMentors: async (req, res) => {
        try{
            const allMentorsList = await db.collection('mentors').find().toArray();
            res.status(200).send({
                allMentorsList: allMentorsList
            })
        }
        catch(err){
            console.error("Error viewing all mentors:", err);
            res.status(400).send({ err: "Failed to assign mentor" });
        }
    }
};

// Exporting the mentor controller object
module.exports = mentorController;

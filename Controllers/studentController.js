const { dbUrl, dbName, MongoClient } = require('../Config/dbConfig');
const client = new MongoClient(dbUrl);
client.connect();
const db = client.db(dbName);

const studentController = {

    //Get All students list
    getAllStudentData : async (req, res) => {
        try{
            const AllStudentData = await db.collection('students').find().toArray();
            res.status(200).send({
                AllStudentData: AllStudentData
            });
        }
        catch(err){
            console.error("Error getting All Students data:", err);
            res.status(500).send({ err: "Failed to get All Students data" });
        }
    },

    // Create a new student
    createStudent: async (req, res) => {
        try {
            if (!req.body.studentName && !req.body.email) {
                res.status(400).send("Please provide the student Name and email to Create the Student");
            }
            
            // Check if student with the provided email already exists
            const email = await db.collection('students').findOne({ email: req.body.email });
            if (!email) {
                // Insert the new student into the database
                const newStudent = await db.collection('students').insertOne(req.body);
                res.status(201).send({
                    newStudent,
                    message: "Student Added Successfully"
                });
            } else {
                res.status(400).send("Student already exists with the same Email");
            }
        } catch (err) {
            console.error("Error creating student:", err);
            res.status(500).send({ err: "Failed to create student" });
        }
    },

    // Assign or change mentor for a student
    assignOrChangeMentor: async (req, res) => {
        try {
            const student = req.body.studentName;
            const mentor_Name = req.body.mentor;

            if (!student || !mentor_Name) {
                res.status(400).send("Enter the student Name & Mentor Name to assign the mentor for student");
            }

            // Check if the entered student and mentor exist in the database
            const studentCheck = await db.collection('students').findOne({ studentName: student });
            const mentorCheck = await db.collection('mentors').findOne({ mentorName: mentor_Name });

            if (!studentCheck || !mentorCheck) {
                console.error("The entered student or mentor is not found");
                return res.status(400).send({ err: "The entered student or mentor is not found" });
            } else {
                // Storing previous mentor
                const previousMentor = studentCheck.mentor;

                // Remove student from the previous mentor's students array
                if (previousMentor) {
                    await db.collection('mentors').updateOne(
                        { mentorName: previousMentor },
                        { $pull: { students: student } }
                    ); 
                }

                // Update the mentor for the student
                const updateMentor = await db.collection('students').updateOne(
                    { studentName: student },
                    { $set: { mentor: mentor_Name, previousMentor: previousMentor } }
                );

                // Update student collection's mentor field
                const updateStudentMentor = await db.collection('students').updateOne(
                    { studentName: student },
                    { $set: { mentor: mentor_Name } }
                );

                const copyPreviousStudents = await db.collection('mentors').findOne({ mentorName: mentor_Name });

                if (!Array.isArray(copyPreviousStudents.students)) {
                    // If students is not an array, create an array and add the student
                    const updateStudent = await db.collection('mentors').updateOne(
                        { mentorName: mentor_Name },
                        { $set: { students: [student] } }
                    );
                } else {
                    // Push the new student into the existing array
                    const updatedStudents = [...copyPreviousStudents.students, student];
                    const updateStudent = await db.collection('mentors').updateOne(
                        { mentorName: mentor_Name },
                        { $set: { students: updatedStudents } }
                    );
                }

                res.status(201).send({
                    message: "Updated mentor for the student successfully"
                });
            }
        }
        catch (err) {
            console.error("Error assigning or changing Mentor:", err);
            res.status(500).send({ err: "Failed to assign Or Change Mentor" });
        }
    },

    // Get all Students by Mentor
    getAllstudentByMentor : async(req, res) =>{
        try{
            const specificMentor = req.params.id;
            if(!specificMentor){
                res.status(400).send(
                    "Please select the mentor to show the list of students"
                )
            }else{
                const getStudents = await db.collection('students').find({mentor: specificMentor}).toArray();
                res.status(200).send({
                    StudentsListOfMentor : specificMentor,
                    getStudents
                })
            }
        }
        catch(err){
            console.error("Error getting all students:", err);
            res.status(500).send({ err: "Failed to get all students" });
        }

    },

    // Get Previous Mentor details
    previousMentor: async (req, res) => {
        const selectedStudent = req.params.studentName;
        try {
            if (!selectedStudent) {
                return res.status(400).send("Please select the particular studentName to check previous mentor");
            }
            const checkPreviousMentor = await db.collection('students').findOne({ studentName: selectedStudent });
            
            if (!checkPreviousMentor) {
                return res.status(400).send("The selected student is not found in the students list");
            }
    
            if (!checkPreviousMentor.previousMentor) {
                return res.status(200).send({
                    message: `No previous mentor found for the student ${selectedStudent}`
                });
            }
    
            const previousMentor = checkPreviousMentor.previousMentor;
            const PreviousMentorDetails = await db.collection('mentors').findOne({ mentorName: previousMentor });
            return res.status(200).send({
                message: `Previous mentor for the student ${selectedStudent} is ${previousMentor}`,
                mentorName: PreviousMentorDetails.mentorName,
                email: PreviousMentorDetails.email
            });
        } catch (err) {
            console.error("Error checking previous mentor:", err);
            res.status(500).send({ err: "Failed to check previous mentor" });
        }
    }
    
};

module.exports = studentController;
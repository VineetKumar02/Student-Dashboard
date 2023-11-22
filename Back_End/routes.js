const express = require('express');
const { Student, Subject } = require('./models');

const router = express.Router();

// POST request for Login
router.post('/login', (req, res) => {

    const { digitalid, password } = req.body;

    // Find a matching document in the Student Details collection
    Student.findOne({ digitalid: digitalid, password: password })
        .then((result) => {
            if (result) {
                // console.log('Login successful');
                res.status(200).send('Login was successful');
            } else {
                // console.error('Invalid credentials');
                res.status(401).send('Invalid credentials');
            }
        })
        .catch((error) => {
            // console.error('Error logging in:', error);
            res.status(500).send('Error logging in');
        });
});


// POST request for SignUp
router.post('/signup', (req, res) => {

    const { digitalid, password } = req.body;

    // Check if the Digital Id already exists in the Student Details collection
    Student.findOne({ digitalid: digitalid })
        .then((result) => {
            if (result) {
                // console.log('Account Already Exists');
                res.status(409).send('Account Already Exists. Proceed to Login');
            }
            else {
                // console.log('Creating New Account');
                const data = new Student({
                    digitalid: digitalid,
                    password: password,
                });

                // Save the new account to the database
                data.save()
                    .then((result) => {
                        // console.log('Signed Up successfully');
                        res.status(200).send('Signed Up successfully');
                    })
                    .catch((error) => {
                        // console.error('Error saving data:', error);
                        res.status(500).send('Error saving data');
                    });
            }
        })
        .catch((error) => {
            // console.error('Error during Sign Up:', error);
            res.status(500).send('Error Signing Up');
        });
});



// POST request for Registration
router.post('/register', (req, res) => {

    const digitalid = req.body.digitalid;

    Student.findOneAndUpdate({ digitalid: digitalid },
        {
            name: req.body.name,
            email: req.body.email,
            regNo: req.body.regNo,
            dept: req.body.dept,
            semester: req.body.semester,
            gender: req.body.gender,
        })
        .then(() => {
            // console.log('Data saved successfully');
            res.status(200).send('Registration successful');
        })
        .catch((error) => {
            // console.error('Error during registration:', error);
            res.status(500).send('Error during registration');
        });
});


// GET request to set Subjects Details
// router.get('/getSubjects', (req, res) => {

//     fs.readFile('../Database/sem_subjects.json', 'utf8', (error, data) => {
//         if (error) {
//             // console.error('Error reading subjects file:', error);
//             res.status(500).send('Error reading subjects file');
//         }

//         try {
//             const subjects = JSON.parse(data);
//             res.status(200).json(subjects);
//         } catch (error) {
//             // console.error('Error parsing subjects JSON:', error);
//             res.status(500).send('Error parsing subjects JSON');
//         }
//     });
// });

// GET request to set Subjects Details
router.get('/getSubjects', (req, res) => {

    Subject.findOne({})
        .then((result) => {
            if (result) {
                res.status(200).send(result);    // Send the Subject Details as JSON response
            } else {
                console.error('No subjects found:', err);
                res.status(404).send('No subjects found');
            }
        })
        .catch((err) => {
            console.error('Error retrieving subjects:', err);
            res.status(500).send('Error retrieving subjects');
        });
});




// POST request to retrive Account Details for given Digital ID
router.post('/getAccount', (req, res) => {

    const { digitalid } = req.body;

    Student.findOne({ digitalid: digitalid })
        .then((student) => {
            if (student) {
                res.status(200).json(student);   // Student found
            } else {
                res.status(404).send('Student not found');   // Student not found
            }
        })
        .catch((error) => {
            // console.error('Error retrieving student data:', error);
            res.status(500).send('Error retrieving student data');
        });
});


// PUT request to update the Account Details
router.put('/updateAccount', (req, res) => {

    const { digitalid } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid },
        {
            name: req.body.name,
            email: req.body.email,
            regNo: req.body.regNo,
            dept: req.body.dept,
            semester: req.body.semester,
            gender: req.body.gender,
        }, { new: true })
        .then((updatedStudent) => {
            if (updatedStudent) {
                res.status(200).send(updatedStudent);   // Account updated successfully
            } else {
                res.status(404).send('Account not found');   // Account not found
            }
        })
        .catch((error) => {
            // console.error('Error updating account details:', error);
            res.status(500).send('Error updating account details');
        });
});



// PUT request to update Academic Details
router.put('/updateAcademic', function (req, res) {

    const { digitalid } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid },
        {
            cat1: req.body.cat1,
            cat2: req.body.cat2,
            cat3: req.body.cat3,
            sem_gpa: req.body.sem_gpa
        }, { new: true })
        .then((updatedStudent) => {
            if (updatedStudent) {
                res.status(200).send(updatedStudent);  // Academic details updated successfully
            }
            else {
                res.status(404).send('Student not found');
            }
        })
        .catch(error => {
            // console.error('Error updating academic details:', error);
            res.status(500).send('Error updating academic details');
        });
});


// POST request for Password Updation
router.post('/updatePassword', (req, res) => {

    const { digitalid, oldpass, newpass, confirmnewpass } = req.body;

    Student.findOne({ digitalid: digitalid })
        .then((user) => {
            if (!user) {
                // console.error('User not found in database');
                res.status(404).send('User not found in database');
            }
            else if (user.password !== oldpass) {
                // console.error('Old password does not match');
                res.status(401).send('Old password does not match');
            }
            else if (newpass !== confirmnewpass) {
                // console.error('New password and confirm new password do not match');
                res.status(400).send('New password and confirm new password do not match');
            }
            else {

                // Update user's password in database
                user.password = newpass;
                user.save()
                    .then(() => {
                        // console.log('Password updated successfully');
                        res.status(200).send('Password updated successfully');
                    })
                    .catch((error) => {
                        // console.error('Error updating password in database:', error);
                        res.status(500).send('Error updating password in database');
                    });
            }
        })
        .catch((error) => {
            // console.error('Error finding user in database:', error);
            res.status(500).send('Error finding user in database');
        });
});



// POST request to update GPA Details
router.post('/updateGPA', (req, res) => {

    const { digitalid, sem_gpa } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid },
        {
            sem_gpa: sem_gpa
        }, { new: true })
        .then((updatedStudent) => {
            if (updatedStudent) {
                res.status(200).send('GPA updated successfully');
            }
            else {
                // console.error('Student not found');
                res.status(404).send('Student not found');
            }
        })
        .catch((error) => {
            // console.error('Error updating GPA:', error);
            res.status(500).send('Error updating GPA');
        });
});



// POST request to update CGPA Details
router.post('/updateCGPA', function (req, res) {

    const { digitalid, sem_gpa, cgpa } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid }, {
        sem_gpa: sem_gpa,
        cgpa: cgpa
    }, { new: true })
        .then((updatedStudent) => {
            if (updatedStudent) {
                res.status(200).send('CGPA updated successfully');
            } else {
                // console.error('Student not found');
                res.status(404).send('Student not found');
            }
        })
        .catch((error) => {
            // console.error('Error updating CGPA:', error);
            res.status(500).send('Error updating CGPA');
        });
});


// POST request to update Average Details
router.post('/updateAverage', (req, res) => {

    const { digitalid, avg1, avg2, avg3, avg4 } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid }, {
        avg_cat_marks: avg1,
        avg_attendance: avg2,
        overall_avg_attendance: avg3,
        cgpa: avg4
    }, { new: true })
        .then((updatedStudent) => {
            if (updatedStudent) {
                res.status(200).send('Average updated successfully');
            }
            else {
                // console.error('Student not found');
                res.status(404).send('Student not found');
            }
        })
        .catch((error) => {
            // console.error('Error updating average:', error);
            res.status(500).send('Error updating average');
        });
});


module.exports = router;
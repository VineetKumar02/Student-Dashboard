const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve the static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, '../Front_End')));
const publicPath = path.join(__dirname, '../Front_End/html');

// Serve the login.html file as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'login.html'));
});

// Serve the other HTML files
const htmlFiles = ['login', 'register', 'dashboard', 'cgpa', 'about', 'settings'];
htmlFiles.forEach(file => {
    app.get(`/${file}`, (req, res) => {
        res.sendFile(path.join(publicPath, `${file}.html`));
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
});



// Connect to MongoDB
mongoose.set('strictQuery', false);

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, connectionParams);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
})();

const { Decimal128 } = mongoose;



// Define the schema for Student Details
const studentSchema = new mongoose.Schema({

    digitalid: {
        type: Number,
        unique: true,
        default: 0,
    },
    password: { type: String, default: "" },
    regNo: {
        type: Number,
        unique: true,
        default: 0,
    },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    dept: { type: String, default: "" },
    semester: { type: String, default: "" },
    gender: { type: String, default: "" },
    cat1: {
        marks: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
        attendance: { type: [Number], default: [0, 0, 0, 0, 0, 0] }
    },
    cat2: {
        marks: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
        attendance: { type: [Number], default: [0, 0, 0, 0, 0, 0] }
    },
    cat3: {
        marks: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
        attendance: { type: [Number], default: [0, 0, 0, 0, 0, 0] }
    },
    avg_cat_marks: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
    avg_attendance: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
    sem_gpa: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0, 0] },
    overall_avg_attendance: { type: Decimal128, default: 0 },
    cgpa: { type: Decimal128, default: 0 }
}, { collection: 'student_details' });    // Set collection name to 'student_details'

const Student = mongoose.model('Student', studentSchema);    // Create the Student model




// Code for all methods

// POST request for Login
app.post('/login', (req, res) => {

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
app.post('/signup', (req, res) => {

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
app.post('/register', (req, res) => {

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
app.get('/getSubjects', (req, res) => {
    fs.readFile('../Database/sem_subjects.json', 'utf8', (error, data) => {
        if (error) {
            // console.error('Error reading subjects file:', error);
            res.status(500).send('Error reading subjects file');
            return;
        }

        try {
            const subjects = JSON.parse(data);
            res.status(200).json(subjects);
        } catch (error) {
            // console.error('Error parsing subjects JSON:', error);
            res.status(500).send('Error parsing subjects JSON');
        }
    });
});




// POST request to retrive Account Details for given Digital ID
app.post('/getAccount', (req, res) => {

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
app.put('/updateAccount', (req, res) => {
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
app.put('/updateAcademic', function (req, res) {

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
app.post('/updatePassword', (req, res) => {

    const { digitalid, oldpass, newpass, confirmnewpass } = req.body;

    Student.findOne({ digitalid: digitalid })
        .then((user) => {
            if (!user) {
                // console.error('User not found in database');
                res.status(404).send({ message: 'User not found in database' });
            }
            if (user.password !== oldpass) {
                // console.error('Old password does not match');
                res.status(401).send({ message: 'Old password does not match' });
            }
            if (newpass !== confirmnewpass) {
                // console.error('New password and confirm new password do not match');
                res.status(400).send({ message: 'New password and confirm new password do not match' });
            }

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
        })
        .catch((error) => {
            // console.error('Error finding user in database:', error);
            res.status(500).send('Error finding user in database');
        });
});



// POST request to update GPA Details
app.post('/updateGPA', (req, res) => {

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
app.post('/updateCGPA', function (req, res) {
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
app.post('/updateAverage', (req, res) => {

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

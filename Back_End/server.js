const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

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
const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}/`);
});


// Connect to MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/Web_Lab';
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB\n', err));

const { Decimal128 } = mongoose;




// Define Schemas

// Define the schema for login details
const loginDetailsSchema = new mongoose.Schema({
    digitalid: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'login_details' });   // Set collection name to 'login_details'

const LoginDetails = mongoose.model('LoginDetails', loginDetailsSchema);    // Create the LoginDetails model


// Define the schema for student details
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    regNo: {
        type: Number,
        unique: true
    },
    digitalid: {
        type: Number,
        unique: true
    },
    dept: String,
    semester: String,
    gender: String,
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


// Define the schema for subjects
const SubjectSchema = new mongoose.Schema({
    I: [Object],
    II: [Object],
    III: [Object],
    IV: [Object],
    V: [Object],
    VI: [Object],
    VII: [Object],
    VIII: [Object],
    theory_count: Array,
    sem_credits: Array
}, { collection: 'subjects' });     // Set collection name to 'subjects'

const Subject = mongoose.model('Subject', SubjectSchema);    // Create the Subject model




// Code for all methods

// POST request for Login
app.post('/login', (req, res) => {

    const { digitalid, password } = req.body;

    // Find a matching document in the LoginDetails collection
    LoginDetails.findOne({ digitalid: digitalid, password: password })
        .then((result) => {
            if (result) {
                console.log('Login successful');
                res.status(200).send('Login was successful');
            } else {
                console.log('Invalid credentials');
                res.status(401).send('Invalid credentials');
            }
        })
        .catch((err) => {
            console.log('Error logging in:', err);
            res.status(500).send('Error logging in');
        });
});


// POST request for SignUp
app.post('/signup', (req, res) => {

    const { digitalid, password } = req.body;

    // Check if the Digital Id already exists in the LoginDetails collection
    LoginDetails.findOne({ digitalid: digitalid })
        .then((result) => {
            if (result) {
                console.log('Account Already Exists');
                res.status(409).send('Account Already Exists. Proceed to Login');
            }
            else {
                console.log('Creating New Account');
                const data = new LoginDetails({
                    digitalid: digitalid,
                    password: password,
                });

                // Save the new account to the database
                data.save()
                    .then((result) => {
                        console.log('Signed Up successfully');
                        res.status(200).send('Signed Up successfully');
                    })
                    .catch((err) => {
                        console.log('Error saving data:', err);
                        res.status(500).send('Error saving data');
                    });
            }
        })
        .catch((err) => {
            console.log('Error during Sign Up:', err);
            res.status(500).send('Error Signing Up');
        });
});



// POST request for Registration
app.post('/register', (req, res) => {

    // Create a new instance of the Student model with the form data
    const newStudent = new Student({
        name: req.body.name,
        email: req.body.email,
        regNo: req.body.regNo,
        digitalid: req.body.digitalid,
        dept: req.body.dept,
        semester: req.body.semester,
        gender: req.body.gender,
    });

    // Save the new student to the database
    newStudent.save()
        .then(result => {
            console.log('Data saved successfully');
            res.status(200).send('Registration successful');
        })
        .catch(err => {
            console.log('Error saving data:', err);
            res.status(500).send('Error saving Student Data');
        });
});


// GET request to set Subjects Details
app.get('/getSubjects', (req, res) => {

    Subject.findOne({})
        .then((result) => {
            if (result) {
                res.status(200).send(result);    // Send the Subject Details as JSON response
            } else {
                res.status(404).send('No subjects found');
            }
        })
        .catch((err) => {
            console.error('Error retrieving subjects:', err);
            res.status(500).send('Error retrieving subjects');
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
        .catch((err) => {
            console.error('Error retrieving student data:', err);
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
        .catch((err) => {
            console.error('Error updating account details:', err);
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
        .catch(err => {
            console.error('Error updating academic details:', err);
            res.status(500).send('Error updating academic details');
        });
});


// POST request for Password Updation
app.post('/updatePassword', (req, res) => {

    const { digitalid, oldpass, newpass, confirmnewpass } = req.body;

    LoginDetails.findOne({ digitalid: digitalid })
        .then((user) => {
            if (!user) {
                console.log('User not found in database');
                res.status(404).send({ message: 'User not found in database' });
            }
            if (user.password !== oldpass) {
                console.log('Old password does not match');
                res.status(401).send({ message: 'Old password does not match' });
            }
            if (newpass !== confirmnewpass) {
                console.log('New password and confirm new password do not match');
                res.status(400).send({ message: 'New password and confirm new password do not match' });
            }

            // Update user's password in database
            user.password = newpass;
            user.save()
                .then(() => {
                    console.log('Password updated successfully');
                    res.status(200).send({ message: 'Password updated successfully' });
                })
                .catch((err) => {
                    console.log('Error updating password in database:', err);
                    res.status(500).send({ message: 'Error updating password in database' });
                });
        })
        .catch((err) => {
            console.log('Error finding user in database:', err);
            res.status(500).send({ message: 'Error finding user in database' });
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
                res.status(404).send('Student not found');
            }
        })
        .catch((err) => {
            console.log('Error updating GPA:', err);
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
                res.status(404).send('Student not found');
            }
        })
        .catch((err) => {
            console.log('Error updating CGPA:', err);
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
                res.status(404).send('Student not found');
            }
        })
        .catch((err) => {
            console.log('Error updating average:', err);
            res.status(500).send('Error updating average');
        });
});

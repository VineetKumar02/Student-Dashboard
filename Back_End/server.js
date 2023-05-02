const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(4000, (res) => {
    console.log('Listening on port 4000')
});



mongoose.connect('mongodb://127.0.0.1:27017/Web_Lab', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB\n', err));


const { Decimal128 } = require('mongoose');


// Define Schemas

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

const LoginDetails = mongoose.model('LoginDetails', loginDetailsSchema);



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


const Student = mongoose.model('Student', studentSchema);



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
}, { collection: 'subjects' });    // Set collection name to 'subjects'

const Subject = mongoose.model('Subject', SubjectSchema);




// Code for all methods

app.post('/login', (req, res) => {

    const { digitalid, password } = req.body;

    LoginDetails.findOne({ digitalid: digitalid, password: password })
        .then(result => {
            if (result) {
                console.log('Login successful');
                res.status(200).send('Login was successful');
            } else {
                console.log('Invalid credentials');
                res.status(401).send('Invalid credentials');
            }
        })
        .catch(err => {
            console.log('Error logging in:', err);
            res.status(500).send('Error logging in');
        });
}
);


app.post('/signup', (req, res) => {

    const { digitalid, password } = req.body;

    LoginDetails.findOne({ digitalid: digitalid })
        .then(result => {
            if (result) {
                console.log('Account Already Exists');
                res.status(500).send('Account Already Exists.. Proceed to Login');
            } else {
                const data = new LoginDetails({
                    digitalid: digitalid,
                    password: password
                });

                data.save()
                    .then(result => {
                        console.log('Signed Up successfully');
                        res.status(200).send('Signed Up successfully');
                    })
                    .catch(err => {
                        console.log('Error saving data:', err);
                        res.status(500).send('Error saving data');
                    });
            }
        })
        .catch(err => {
            console.log('Error during Sign Up:', err);
            res.status(500).send('Error Signing Up');
        });

});



app.post('/register', function (req, res) {
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
            res.status(500).send('Error saving Studen Data');
        });
});



app.get('/getSubjects', (req, res) => {
    Subject.findOne({})
        .then(result => {
            if (result) {
                // console.log(result);
                res.send(result);
            } else {
                res.send('No subjects found');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error retrieving subjects');
        });
});


app.post('/getAccount', (req, res) => {

    const { digitalid } = req.body;

    Student.findOne({ digitalid: digitalid })
        .then(student => {
            res.json(student);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error retrieving student data');
        });
});


app.put('/updateAccount', function (req, res) {

    const { digitalid } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid }, {
        name: req.body.name,
        email: req.body.email,
        regNo: req.body.regNo,
        dept: req.body.dept,
        semester: req.body.semester,
        gender: req.body.gender
    }, { new: true })
        .then((updatedStudent) => {
            // console.log(updatedStudent);
            res.status(200).send(updatedStudent);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});


app.put('/updateAcademic', function (req, res) {

    const { digitalid } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid }, {
        cat1: req.body.cat1,
        cat2: req.body.cat2,
        cat3: req.body.cat3,
        sem_gpa: req.body.sem_gpa
    }, { new: true })
        .then(updatedStudent => {
            // console.log(updatedStudent);
            res.status(200).send(updatedStudent);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});



app.post('/updatePassword', function (req, res) {

    const { digitalid, oldpass, newpass, confirmnewpass } = req.body;

    LoginDetails.findOne({ digitalid: digitalid })
        .then(function (user) {
            if (!user) {
                console.log('User not found in database');
                return res.status(404).send({ message: 'User not found in database' });
            }
            if (user.password !== oldpass) {
                console.log('Old password does not match');
                return res.status(401).send({ message: 'Old password does not match' });
            }
            if (newpass !== confirmnewpass) {
                console.log('New password and confirm new password do not match');
                return res.status(400).send({ message: 'New password and confirm new password do not match' });
            }

            // Update user's password in database
            user.password = newpass;
            user.save()
                .then(function () {
                    console.log('Password updated successfully');
                    return res.status(200).send({ message: 'Password updated successfully' });
                })
                .catch(function (err) {
                    console.log('Error updating password in database', err);
                    return res.status(500).send({ message: 'Error updating password in database' });
                });
        })
        .catch(function (err) {
            console.log('Error finding user in database', err);
            return res.status(500).send({ message: 'Error finding user in database' });
        });
});

app.post('/updateGPA', function (req, res) {
    const { digitalid, sem_gpa } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid }, {
        sem_gpa: sem_gpa
    }, { new: true })
        .then((updatedStudent) => {
            // console.log(updatedStudent);
            res.status(200).send('GPA updated successfully');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

app.post('/updateCGPA', function (req, res) {
    const { digitalid, sem_gpa, cgpa } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid }, {
        sem_gpa: sem_gpa,
        cgpa: cgpa
    }, { new: true })
        .then((updatedStudent) => {
            // console.log(updatedStudent);
            res.status(200).send('CGPA updated successfully');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

app.post('/updateAverage', function (req, res) {

    const { digitalid, avg1, avg2, avg3, avg4 } = req.body;

    Student.findOneAndUpdate({ digitalid: digitalid }, {
        avg_cat_marks: avg1,
        avg_attendance: avg2,
        overall_avg_attendance: avg3,
        cgpa: avg4

    }, { new: true })
        .then((updatedStudent) => {
            // console.log(updatedStudent);
            res.status(200).send('Average updated successfully');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

const mongoose = require('mongoose');


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


module.exports = { Student, Subject };
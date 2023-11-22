const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);


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

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
})();

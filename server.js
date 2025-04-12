const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// Body parser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const dotenv = require("dotenv");
dotenv.config({
    path: path.join(__dirname, `${process.env.APP_ENV}.env`)
})

// Ensure required folders exist
const folders = ['uploads', 'qr'];

folders.forEach(folder => {
    const dir = path.join(__dirname, folder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

const PORT = process.env.PORT;
const uploadRoute = require('./routes/upload');

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/qr', express.static(path.join(__dirname, 'qr')));

// Serve upload form
app.get('/', (req, res) => {
    res.render('upload');
});

app.use('/api/upload', uploadRoute);

app.listen(PORT, () => {
    console.log(`Server running at ${process.env.APP_HOST}`);
});

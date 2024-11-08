const express = require('express');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(__dirname, '../restaurant-website')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../restaurant-website', './index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

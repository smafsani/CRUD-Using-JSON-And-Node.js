require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// PORT NUMBER
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


const usersRoute = require('./routes/users');

app.use("/users", usersRoute);


app.get("/", (req, res) => {
    res.send("Welcome to my RestAPI.");
});

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {
        console.log("Connect to DB!");
});

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
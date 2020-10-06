const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;
const { MONGOURI } = require('./keys');

//VOxoCT70lwtkCQAE
//VOxoCT70lwtkCQAE
require('./models/user');

app.use(express.json()); //express server passes the requests to the json, all the incoming requests are passed with this line of code before it reaches to the route handler
app.use(require('./routes/auth'));

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("connected to mongodb");
});

mongoose.connection.on('error', (err) => {
    console.log("error connecting to mongoDB", err);
});

app.listen(PORT, () => {
    console.log("server is running on", PORT);
});
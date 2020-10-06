const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    //authorization === Bearer fjkehfwelfjekwfnfmldkfpejfnjdnkdjfldfl   >> ideally authorization should look like this
    if (!authorization) {
        res.status(401).send({ error: "User must be logged in" });
    }
    const token = authorization.replace("Bearer ", ""); //to trim the authorization Bearer from the header and retrieve only the token value
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            res.status(401).json({ error: "User must be logged in" });
        }

        const { _id } = payload._id;
        User.findById(_id).then(userdata => {
            req.user = userdata;
        });
        next();
    });
};
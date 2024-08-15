const jwt = require('jsonwebtoken');
const constants = require('../constants');

const JWT_SECRET = 'Anukeshisthebe$tcoder';

const fetchUserData = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(constants.AUTHORIZATION_REQUIRED).send({ "Message" : "Please provide valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.SK = data.SK;
        next();
    } catch (error) {
        res.status(constants.AUTHORIZATION_REQUIRED).send({ "Message" : "Please authenticate using valid token" });
    }
}

module.exports = fetchUserData;
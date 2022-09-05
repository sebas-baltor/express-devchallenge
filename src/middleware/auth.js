const jwt = require('jsonwebtoken');
const auth = {};
// if the user has access
auth.authenticate = (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("no token provided");
    }
    // validate tokend
    try{
        let user = jwt.decode(token,process.env.JWT_SECRET_KEY);
        req.user = user;
    }
    catch(err){
        return res.status(401).send("Unauthorized");
    }
    next();
}
module.exports = auth;

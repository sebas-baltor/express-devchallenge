const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
// model User
const User = require("../model/User");
// controller
const registerController = {};
// return a view to register form
registerController.register = (req, res) => {
    res.render('register', { error: " " });
}
// store a user in database
registerController.storeUser = (req, res) => {
    try {
        // validate if the data was filled
        const { name, email, password } = req.body;
        if (!(name && email && password)) {
            return res.render('register', {error: "Please fill all the fields"}); // to the app
            // return res.status(400).send("All input is required"); // to the api
        }
        // connection with mysql
        req.getConnection((err, conn) => {
            if (err) console.log(err);
            // validate if the user already exist
            conn.query("SELECT * FROM user WHERE name = ? or email = ?", [name, email], (err, rows) => {
                if (err) console.log(err);
                if (rows.length > 0) {
                    return res.render('register', {error: "User already exist"}); // to the app
                    // return res.status(409).send("User already exist");
                } else {
                    // encrypt the password
                    const hash = bcrypt.hashSync(password, 10);
                    // create a user
                    const user = new User(name, email, hash);
                    // insert the user in database
                    conn.query("INSERT INTO user SET ?", user, (err, rows) => {
                        if (err) console.log(err);
                        // create a token
                        const token = jwt.sign({ user_id: rows.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
                        // return the token
                        // res.status(201).json({ token }); // to the api
                        return res.set('x-access-token', token).redirect('/info'); // to the app
                    })
                }
            })

        })

    } catch (err) {
        console.log(err)
    }
}

module.exports = registerController;
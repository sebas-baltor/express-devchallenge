const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// controller
const loginController = {};
// return a view with the login form
loginController.login = (req, res) => {
    res.render('login', { error: " " });
}
// return a new tokend if the user exist
loginController.access = (req, res) => {
    const {email,password} = req.body;
    // validate if the data was filled
    if(!(email && password)){
        return res.render("login",{error: "All filds are required"}); // to the app
        // return res.status(400).send("All input is required"); // to the api
    }
    // validate if the user exist in db
    req.getConnection((err, conn) => {
        if(err) console.log(err);
        conn.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
            if(err) console.log(err);
            // comparing the same password
            if(rows.length<1){return res.status(404).send("User not found try register");}
            if(bcrypt.compareSync(password, rows[0].password)){
                const token = jwt.sign({user_id: rows[0].id,email:rows[0].email}, process.env.JWT_SECRET_KEY, {expiresIn: "2h"});
                // return res.status(200).json({token}); // to the api
                return res.set('x-access-token', token).redirect('/info'); // to the app
            }
            // return res.status(400).send("Invalid credentials"); // to the api
            return res.render("login",{error: "Invalid credentials"}); // to the app
        })
    });

}

module.exports = loginController;
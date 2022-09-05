const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const webController = {};

// GET controller
webController.index = (req, res) => {
    res.redirect('/login');
}
webController.info = (req, res) => {
    res.render('info');
}
webController.getSetInfo = (req, res) => {
    res.render('setInfo');
}
// POST controller


webController.startSession = (req, res) => {
    const { email, password } = req.body;
    if (email === "" || password === "") {
        return res.render("login", { error: "All filds are required" })
    }
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);
        conn.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
            if (err) return err;
            if (rows.length < 1) return res.render("login", { error: "User not exist try with register" })
            // comparing the same password
            if (bcrypt.compareSync(password, rows[0].password)) {
                const token = jwt.sign({
                    name: rows[0].name,
                    email: rows[0].email,
                    id: rows[0].id
                }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
                res.locals.token = token;
                res.locals.logged = true;
                res.redirect("/info");
            } else {
                return res.render("login", { error: "email or password wrong" })
            }
        })
    });
}

module.exports = webController;
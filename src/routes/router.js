const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');

const auth = require("../middleware/auth");

// GET requests
router.get('/', webController.index);
router.get("/info",auth.authenticate,webController.info); // ruta protegida con el middleware
router.get("/set-info",auth.authenticate,webController.getSetInfo); // ruta protegida con el middleware
router.get('/login',loginController.login);
router.get('/register',registerController.register);

// POST requests
router.post("/login",loginController.access);
router.post('/register',registerController.storeUser);

module.exports = router;


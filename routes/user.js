const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('express-rate-limit');


const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes : temps défini pour tester l'application
    max: 3 // 3 essais max par adresse ip
  });

router.post('/signup', userCtrl.signup);// pour envoyer les info (email + password) d'un nouvel utilisateur
router.post('/login', passLimiter, userCtrl.login);// pour envoyer les informations d'un utilisateur déjà existant


module.exports = router;
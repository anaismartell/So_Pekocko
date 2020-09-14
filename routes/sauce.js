const express = require('express');
const router = express.Router();// création d'un router

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce);// créer une nouvelle sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);// modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce);// effacer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);// récuperer une sauce
router.get('/', auth, sauceCtrl.getAllSauces);// récuperer toutes les sauces depuis la base de donne
router.post('/:id/like', auth, sauceCtrl.userSaucesLiked); // envoyer like ou dislike

module.exports = router;
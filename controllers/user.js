const bcrypt = require('bcryptjs'); // chiffrement
const jwt = require('jsonwebtoken'); // token generator package
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const MaskData = require('maskdata');

const User = require('../models/user');


const passwordSchema = new passwordValidator();

passwordSchema
.is().min(6)   // longueur minimum de 6 caractères                                 
.is().max(20)   // longueur maximum de 20 caractères                               
.has().uppercase()  // doit contenir une majuscule                        
.has().lowercase()  // doit contenir une miniscule                         
.has().digits()    // doit contenir un chiffre    
.has().not().symbols() // ne doit pas contenir de caractères spéciaux                        
.has().not().spaces();  // ne doit pas contenir d'espaces                     


exports.signup = (req, res, next) => { // inscription du user
    if (!emailValidator.validate(req.body.email) || !passwordSchema.validate(req.body.password)) { // si l'email et le mot de passe ne sont pas valides
      return res.status(400).json({ message: 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre. Sa longueur doit être comprise entre 6 et 20 caractères'});
    } else if (emailValidator.validate(req.body.email) || passwordSchema.validate(req.body.password)) { // s'ils sont valides
    const maskedMail = MaskData.maskEmail2(req.body.email); // masquage de l'adresse mail
        bcrypt.hash(req.body.password, 10) // bcrypt hashe le mot de passe
        .then(hash => {
            const user = new User ({  // crée un nouveau user
                email: maskedMail, // avec l'adresse mail masquée 
                password: hash // et le mot de passe hashé
            });
            user.save() // et mongoose le stocke dans la bdd
            .then( hash => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
        };
    }
    
    
exports.login = (req, res, next) => { // connexion du user
const maskedMail = MaskData.maskEmail2(req.body.email);
    User.findOne({ email: maskedMail }) // on vérifie que l'adresse mail figure bien dansla bdd
    .then(user => {
        if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // on compare les mots de passes
        .then(valid => {
            if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ 
            userId: user._id,
            token: jwt.sign( // on génère un token de session pour le user maintenant connecté
                { userId: user._id},
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h'}
            )
            })    
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

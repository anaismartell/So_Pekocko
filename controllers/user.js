cconst bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/user");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const sanitizer = require("mongo-sanitize");

// Créer un schema
let validPassword = new passwordValidator();

validPassword
  .is()
  .min(8) // longueur mini 8
  .is()
  .max(20) // longueur maxi 20
  .has()
  .uppercase() // doit contenir une majuscule
  .has()
  .lowercase() // doit contenir une minuscule
  .has()
  .digits() // doit contenir un chiffre
  .has()
  .not()
  .spaces(); // ne doit pas contenir d'espace

exports.signup = (req, res, next) => {
  if (
    !emailValidator.validate(sanitizer(req.body.email)) ||
    !validPassword.validate(sanitizer(req.body.password))
  ) {
    return res.status(403).json({
      message:
        "le mot de passe doit contenir une majuscule, une minuscule et un chiffre. Sa longueur doit être comprise entre 8 et 20 caractères",
    });
  } else if (
    emailValidator.validate(sanitizer(req.body.email)) &&
    validPassword.validate(sanitizer(req.body.password))
  ) {
    //appeler la fonction de hachage, créer un nouvel utilisateur, le sauvegarder dans la base de données
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user.save((err, user) => {
          if (!err)
            res.status(201).json({ message: "Nouvel utilisateur créé !" });
          else {
            res.status(400).json({ err });
          }
        });
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: sanitizer(req.body.email) }) //trouver l'utilisateur qui correspond à l'adresse mail unique
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Les informations de connexion ne sont pas correctes!",
        }); //si non trouvé renvoyer une erreur
      } else {
        bcrypt
          .compare(req.body.password, user.password) //si trouvé comparer le mot de passe haché avec celui de la base de données grâce à bcrypt
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({
                message: "Les informations de connexion ne sont pas correctes!",
              }); //si mot de passe non valide renvoyer une erreur
            }
            res.status(200).json({
              //si valide, valider la requête, renvoyer un userId et un token
              userId: user._id,
              token: jsonWebToken.sign(
                { userId: user._id },
                process.env.TOKEN,
                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) => res.status(500).json({ error })); //si erreur autre renvoyer une erreur serveur
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
const Sauce = require('../models/sauce');
const fs = require('fs');// files sistem


// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);// pour transformer l'objet JSON en JS
    const sauce = new Sauce({// creation d'une nouvelle instance du model thing
        ...sauceObject,
        // http://localhost:3000/image/nomdufichier 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // modifier l'url de l'image par le nom de l'objet généré par multer
    });
    sauce.save()// pour enregistrer l'objet thing dans la base de données
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));

        sauceObject.likes = 0; // on ajoute un like à 0 pour l'objet sauce
        sauceObject.dislikes = 0; // on ajoute un dislike à l'objet sauce
        sauceObject.usersLiked = Array(); // déclare un tableau des utilisateurs qui ont liké
        sauceObject.usersDisliked = Array(); // déclare un tableau des utilisateurs qui ont disliké 
};

// Modification d'une sauce existante 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // usage de l'opérateur ternaire pour savoir si elle existe
    { ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// s'il existe on récupère toutes les infos sur l'objet et on génère l'image URL
    // si il y en a pas
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // on prend l'objet et on modifie l'identifiant
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // trouve le fichier avec l'ID qui correspond à celui dans la requête
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // on récupère le nom précis du fichier à supprimer
            fs.unlink(`images/${filename}`, () => { // fonction unlink du package fs pour supprimer un fichier
                Sauce.deleteOne({ _id: req.params.id }) // suppression de l'objet dans la base de données
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));// erreur du server
};

// Récupération d'une sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

 // Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // lit dans les différentes sauces dans la base de données
    .then(sauces => res.status(200).json(sauces)) // récupération du tableau des sauces
    .catch(error => res.status(400).json({ error }));
};

// Like ou Dislike
exports.userSaucesLiked = (req, res, next) => {
    if (req.body.like === 1) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: req.body.like++ },
          $push: { usersLiked: req.body.userId },
        }
      )
        .then(() =>
          res.status(200).json({ message: "L'utilisateur aime cette sauce !" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else if (req.body.like === -1) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: req.body.like++ * -1 },
          $push: { usersDisliked: req.body.userId },
        }
      )
        .then(() =>
          res
            .status(200).json({ message: "L'utilisateur n'aime pas cette sauce !" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else {
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
            )
              .then(() => {
                res
                  .status(200)
                  .json({ message: "L'utilisateur n'aime plus cette sauce !" });
              })
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              }
            )
              .then(() => {
                res.status(200).json({
                  message:
                    "Finalement l'utilisateur enlève son dislike pour cette sauce !",
                });
              })
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
    }
  };

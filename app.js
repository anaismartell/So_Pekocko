const express = require('express');
//transforme le corp des requetes en objet JS
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// nous donne access au chemin des fichiers
const path = require('path');

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user')

const app = express();

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://users:sopekocko2020@cluster0.6hccu.mongodb.net/users?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Eviter les erros CORS afin que tout le monde puisse faire des requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //accéder à l'API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// on donne l'autorisation de utiliser certaines entete
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// et aussi sur certaines methodes
    next();// j'appelle next() pour passer au middleware d'apres
});

app.use(bodyParser.json());// json c'est une methode de l'objet bodyParser

// creation des middleware
app.use('/images', express.static(path.join(__dirname, 'images'))); // pourque app.js serve le dossier /images 

app.use('/api/sauces', saucesRoutes);// pour le CRUD des sauces - se refer à ./routes/sauces.js
app.use('/api/auth', userRoutes);// pour l'autentification de l'utilisateur - se refer à ./routes/user.js

  
module.exports = app;// Export de l'application
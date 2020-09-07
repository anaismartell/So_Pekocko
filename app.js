const express = require('express');

const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://users:sopekocko2020@cluster0.6hccu.mongodb.net/users?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Eviter les erros CORS afin que tout le monde puisse faire des requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next(); // Appel de nex pour passer au middleware suivant
  });

app.use(bodyParser.json()); 

// Création des middlewares
app.use('/images', express.static(path.join(__dirname, 'images'))); // app.js sert le dossier / image statique 
app.use('/api/sauces', sauceRoutes); // pour le CRUD sauces - se référer à ./routes/sauces.js */
app.use('/api/auth', userRoutes); // pour l'authentification de l'utilisateur - se référer à ./routes/user.js


module.exports = app; // Export de l'application
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  //création d'une constante storage , avec multer comme configuration
  destination: (req, file, callback) => {
    //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); //la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]; //Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
    callback(null, name + Date.now() + "." + extension); //ajouter un timestamp Date.now() comme nom de fichier.
  },
});

module.exports = multer({ storage }).single("image"); //exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image

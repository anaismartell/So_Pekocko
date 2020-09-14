const multer = require('multer');

//pour modifier l'extension des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({// on enregistre dans le disk
    destination: (req, file, callback) => {// dans quel dossier enregistrer les fichiers
        callback(null, 'images');// null : pas d'erreur - le dossier images est le dossier de destination
    },
    filename: (req, file, callback) => {// quel nom de fichier utiliser pour générer le nom
        const name = file.originalname.split(' ').join('_');// nom d'origine, remplace des espaces par des _
        const extension = MIME_TYPES[file.mimetype];// extension a ajouter au nom
        callback(null, name + Date.now() + '.' + extension);// nom d'origine + numero unique + . + extension
    }
});

module.exports = multer({ storage: storage }).single('image');
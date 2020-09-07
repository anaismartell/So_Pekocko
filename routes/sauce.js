const express = require("express");
const router = express.Router();
const sauceControllers = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, sauceControllers.getAllSauces);
router.get("/:id", auth, sauceControllers.getOneSauce);
router.post("/", auth, multer, sauceControllers.createSauce);
router.put("/:id", auth, multer, sauceControllers.modifySauce);
router.delete("/:id", auth, sauceControllers.deleteSauce);
router.post("/:id/like", auth, sauceControllers.userSaucesLiked);

module.exports = router;
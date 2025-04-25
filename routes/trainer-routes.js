const express = require("express");
const router = express.Router();
const {upload} = require('../middleware')

const homeController = require("../controllers/home-controller");
const {isAuth, isAdmin} = require('../middleware');
const trainerController = require("../controllers/trainer-controller");

router.get("/", homeController.getTrainers);

router.use(isAuth);
router.use(isAdmin);
router.get("/admin/create", trainerController.getCreateTrainer);
router.post("/admin/create", upload.trainers.single('trainerImage') , trainerController.postCreateTrainer);
router.get('/admin/manage', trainerController.getManageTrainers);
router.post('/admin/delete', trainerController.postDeleteTrainer);
module.exports = router;

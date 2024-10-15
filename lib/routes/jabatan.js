const express = require("express");
const router = express.Router();
const controller = require("../controllers/jabatan_controller");
const { authentication } = require("../middlewares/authentication");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.use(authentication);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin_controller");
const { authentication, isSuperadmin } = require("../middlewares/authentication");

router.post("/login", controller.login);

router.use(authentication);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/me", controller.getMe);
router.put("/me", controller.updateMe);

router.use(isSuperadmin);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
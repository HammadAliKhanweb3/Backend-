import { Router } from "express";
import registerUser, { loginUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount1: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(auth.middleware, logoutUser);

export default router;

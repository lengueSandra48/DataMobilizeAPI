import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  logout,
} from "../controllers/user-oauth.controller";

const router = Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.get("/logout", logout);

export default router;

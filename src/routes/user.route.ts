import { Router } from "express";
import userController from "../controllers/user.controller";

export const UserRoute = () => {
  const router = Router();
  const prefix: string = "/users";
  const prefixGoogle: string = "/auth";
  router.get(`${prefix}`, userController.findAll);
  router.get(`${prefix}/reports`, userController.findAllWithReport);
  router.get(`${prefix}/:id`, userController.findOne);
  router.post(`${prefix}/register`, userController.register);
  router.post(`${prefix}/login`, userController.login);
  router.post(`${prefix}/verify/:userId`, userController.verify);
  router.delete(`${prefix}/:id`, userController.removeOne);
  router.put(`${prefix}/:id`, userController.updateOne);
  router.post(
    `${prefix}/requestpasswordreset`,
    userController.requestResetPassword
  );
  router.post(
    `${prefix}/:userId/validcodeforpasswordreset`,
    userController.validCodeForPasswordReset
  );
  router.put(`${prefix}/:userId/resetpassword`, userController.resetPassword);
  router.get(`${prefixGoogle}/google`, userController.googleAuth);
  router.get(
    `${prefixGoogle}/google/callback`,
    userController.googleAuthCallback
  );
  router.get("/logout", userController.logout);
  return router;
};

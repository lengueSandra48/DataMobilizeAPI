import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { CreateUserInput, User } from "../types/user.dto";
import userService from "../services/user.service";
import verificationService from "../services/verification.service";
import { STATUS_CODE } from "../utils/error_code";
import { KODY_NOREPLY_EMAIL } from "../startup/config";
import { sendEmail } from "../clients/email.client";
import passport from "passport";
import { VerificationInput } from "../types/verification.dto";

const register = async (req: Request, res: Response) => {
  const { email, localisation, username }: CreateUserInput = req.body;
  const password = bcrypt.hashSync(req.body.password, 10);

  try {
    // we check if user already exists
    let user = await userService.getByEmail(email);
    if (user) {
      if (user.isVerified) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "User already exists and is verified" });
      }
    } else {
      // Register the user
      user = await userService.create({
        username,
        email,
        password,
        localisation: req.language ?? localisation ?? "fr",
        expoPushToken: null,
        isVerified: false,
      });
    }
    console.log("User created: " + user.id);
    req.i18n.changeLanguage(user.localisation);

    let code = Math.floor(Math.random() * 10000);

    // we make sure the code is 4 digits
    while (code < 1000) {
      code = Math.floor(Math.random() * 10000);
    }

    console.log("creating verification code: " + code);
    const verification: VerificationInput = await verificationService.create({
      userId: user.id,
      code,
    });

    const sendSmtpEmail = {
      subject: req.t("verifySubject"),
      htmlContent: req.t("verifyEmail", {
        username: user.username,
        code: verification.code,
      }),
      sender: { name: "Kody", email: KODY_NOREPLY_EMAIL },
      to: [{ email: user.email, name: user.username }],
    };
    console.log("Sending email to user: " + user.id);
    await sendEmail(sendSmtpEmail);

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      localisation: user.localisation,
      expoPushToken: null,
    });
  } catch (error) {
    console.log("Failed to register user with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userService.getByEmail(req.body.email);
    if (!user) {
      return res
        .status(STATUS_CODE.USER_NOT_FOUND)
        .json({ message: "Login failed" });
    }
    const isMatch: boolean = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isMatch) {
      return res
        .status(STATUS_CODE.USER_INCORRECT_PASSWORD)
        .json({ message: "Login failed" });
    }
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      localisation: user.localisation,
      expoPushToken: user.expoPushToken,
    });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Login failed" });
  }
};

const verify = async (req: Request, res: Response) => {
  try {
    const { code }: { code: string } = req.body;

    const verification = await verificationService.getOne(req.params.userId);

    if (!verification) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "Verification code not found" });
    }

    if (verification.code.toString() !== code) {
      return res
        .status(STATUS_CODE.USER_INCORRECT_CODE)
        .json({ message: "Verification code incorrect" });
    }

    const user: User = await userService.getOne(req.params.userId);

    // Update user verification status
    user.isVerified = true;
    const updatedUser = await userService.updateOne(user);

    // Delete all codes related to the user
    await verificationService.deleteAllFromUser(req.params.userId);

    return res.status(STATUS_CODE.SUCCESS).json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      isVerified: updatedUser.isVerified,
      localisation: updatedUser.localisation,
      expoPushToken: updatedUser.expoPushToken,
    });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Verification failed", error: error.message });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAll();
    return res.json({ users });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Login failed" });
  }
};

const findAllWithReport = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsersWithReports();
    return res.json({ users });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Login failed" });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const user = await userService.getOne(req.params.id);
    return res.json({ user });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Login failed" });
  }
};

const removeOne = async (req: Request, res: Response) => {
  try {
    await userService.deleteOne(req.params.id);
    return res.json({ message: "User deleted" });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Failed to delete user: " + req.params.id });
  }
};

const updateOne = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const storedUser: User = await userService.getOne(req.params.id);

    if (!storedUser) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const updatedUser = await userService.updateOne(user);
    return res.status(STATUS_CODE.SUCCESS).json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      isVerified: updatedUser.isVerified,
      localisation: updatedUser.localisation,
      expoPushToken: updatedUser.expoPushToken,
    });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Failed to update user: " + req.body.id });
  }
};

const requestResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await userService.getByEmail(email);
    if (!user) {
      return res
        .status(STATUS_CODE.USER_NOT_FOUND)
        .json({ message: "User not found" });
    }
    req.i18n.changeLanguage(user.localisation);

    let code = Math.floor(Math.random() * 10000);

    // we make sure the code is 4 digits
    while (code < 1000) {
      code = Math.floor(Math.random() * 10000);
    }

    await verificationService.create({ userId: user.id, code });

    await sendEmail({
      to: [{ email: user.email, name: user.username }],
      subject: "Password Reset code",
      htmlContent: req.t("passwordResetCodeEmail", { code }),
      sender: {
        name: "Kody Support",
        email: KODY_NOREPLY_EMAIL,
      },
    });

    return res.status(STATUS_CODE.SUCCESS).json({
      userId: user.id,
      email: user.email,
      isVerified: user.isVerified,
      localisation: user.localisation,
    });
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json({
      message: "Failed to send password reset code",
      error: error.message,
    });
  }
};

const validCodeForPasswordReset = async (req: Request, res: Response) => {
  try {
    const { code }: { code: string; userId: string } = req.body;
    const userId = req.params.userId;

    // Vérifier si l'utilisateur existe
    const user = await userService.getOne(userId);
    if (!user) {
      return res
        .status(STATUS_CODE.USER_NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Vérifier le code de réinitialisation
    const verification = await verificationService.getOne(user.id);
    if (!verification || verification.code.toString() !== code) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "invalid verification code" });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    return res.status(STATUS_CODE.SUCCESS).json({
      userId: user.id,
      email: user.email,
      isVerified: user.isVerified,
      localisation: user.localisation,
    });
  } catch (error) {
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Code verification failed", error: error.message });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const userId = req.params.userId;
  try {
    const user = await userService.getOne(userId);
    if (!user) {
      return res
        .status(STATUS_CODE.USER_NOT_FOUND)
        .json({ message: "User not found" });
    }

    user.password = bcrypt.hashSync(password, 10);
    await userService.updateOne(user);

    return res.status(STATUS_CODE.SUCCESS).json({
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      localisation: user.localisation,
      expoPushToken: user.expoPushToken,
    });
  } catch (error) {
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: "Failed to reset password", error: error.message });
  }
};

/**
 * Google OAuth2.0 authentication
 */
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

/**
 * Google OAuth2.0 authentication callback
 */
const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/",
});

/**
 * Logout
 * @param req - Request
 * @param res - Response
 */
const logout = (req: Request, res: Response) => {
  //   req.logout();
  //   res.redirect("/");
};

export default {
  register,
  findAll,
  findOne,
  login,
  verify,
  removeOne,
  updateOne,
  findAllWithReport,
  requestResetPassword,
  validCodeForPasswordReset,
  resetPassword,
  googleAuth,
  googleAuthCallback,
  logout,
};

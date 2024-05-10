import {
  userForgotPassword,
  userResetPassword,
  userSignIn,
  userSignUp,
} from "../controllers/auth/auth.js";
import authMiddleware from "../middlewares/auth.js";

export default [
  {
    method: "POST",
    url: "/signup",
    handler: userSignUp,
  },
  {
    method: "POST",
    url: "/signin",
    handler: userSignIn,
  },
  {
    method: "POST",
    url: "/forgot-password",
    handler: userForgotPassword,
  },
  {
    method: "POST",
    url: "/reset-password",
    handler: userResetPassword,
  },
];

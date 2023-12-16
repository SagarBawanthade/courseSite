import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { buySubscription, paymentVerification, getRazorPaykey, cancelSubscription } from "../controllers/paymentController.js";

const router = express.Router();

//Buy Subscripton
router.route("/subscribe").get(isAuthenticated, buySubscription);

//verify payment ans save refernece in DB
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

//get razorpay key
router.route("/razorpaykey").get(getRazorPaykey);

//cancel subscription
router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);


export default router;  
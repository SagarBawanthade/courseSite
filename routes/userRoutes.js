import express from "express";
import { register, login, logout, getMyProfile, changePassword, updateProfile, updateProfilePicture, forgetPassword, resetPassword, addToPlayList, removeFromPlayList, getAllUsers, updateUserRole, deleteUser, deleteMyProfile } from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//to register new user
router.route("/register").post(singleUpload, register);

//login
router.route("/login").post(login);

//logout
router.route("/logout").get(logout);

//get my proflie
router.route("/me").get(isAuthenticated, getMyProfile);

//delete my profle
router.route("/me").delete(isAuthenticated, deleteMyProfile);

//change password
router.route("/changepassword").put(isAuthenticated, changePassword);

//update profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//update profile picture
router.route("/updateprofilepicture").put(isAuthenticated, singleUpload, updateProfilePicture);

//forget password
router.route("/forgetpassword").post(forgetPassword);


//reset password
router.route("/resetpassword/:token").put(resetPassword);

//add to playlist 
router.route("/addtoplaylist").post(isAuthenticated, addToPlayList);


//remove from playlist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlayList);

//ADMINS ROUTES
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

router.route("/admin/user/:id")
    .put(isAuthenticated, authorizeAdmin, updateUserRole)
    .delete(isAuthenticated, authorizeAdmin, deleteUser);






export default router;
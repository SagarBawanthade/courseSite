import express from "express";
import { addLecture, createCourse, getAllCourses, getCourseLectures, deleteCourse, deleteLecture } from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated, authorizeSubscribers } from "../middlewares/auth.js";

const router = express.Router();

//GET ALL COURSES WITHOUT LECTURES
router.route("/courses").get(getAllCourses);

//CREATE NEW COURSE ONLY ADMIN
router.route("/createcourse").post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

//Add LECTURE //DELETE COURSE //GET SOURCE DETAILS
router.route("/course/:id")
    .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
    .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
    .delete(isAuthenticated, authorizeAdmin, deleteCourse);

//DELETE LECTURE 
router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);


export default router;
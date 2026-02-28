const express = require("express");
const { register, login } = require("../controllers/authController");
const { body } = require("express-validator");
const { validate } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("role").isIn(["student", "employer"]).withMessage("Invalid role")
    ],
    validate,
    register
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email required"),
        body("password").notEmpty().withMessage("Password required")
    ],
    validate,
    login
);

module.exports = router;
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
    createJob,
    getAllJobs,
    applyForJob,
    getJobApplicants,
    selectStudent,
    closeJob,
    getMyJobs,
    getAppliedJobs
} = require("../controllers/jobController");
const router = express.Router();

// Employer creates job
router.post("/", protect, authorizeRoles("employer"), createJob);

// Student views jobs
router.get("/", protect, getAllJobs);

// Student applies
router.post("/:id/apply", protect, authorizeRoles("student"), applyForJob);
// Employer views applicants
router.get("/:id/applicants",
    protect,
    authorizeRoles("employer"),
    getJobApplicants
);

// Employer selects student
router.post("/:id/select",
    protect,
    authorizeRoles("employer"),
    selectStudent
);

// Employer closes job
router.put("/:id/close",
    protect,
    authorizeRoles("employer"),
    closeJob
);
// Employer - get my jobs
router.get("/myjobs",
    protect,
    authorizeRoles("employer"),
    getMyJobs
);

// Student - get applied jobs
router.get("/applied",
    protect,
    authorizeRoles("student"),
    getAppliedJobs
);
module.exports = router;
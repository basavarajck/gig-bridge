const Job = require("../models/Job");

// Create Job (Employer only)
exports.createJob = async (req, res) => {
    try {
        const { title, description, date, location, paymentAmount } = req.body;

        const job = await Job.create({
            title,
            description,
            date,
            location,
            paymentAmount,
            employer: req.user._id
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get All Jobs (Students can view)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: "open" })
            .populate("employer", "name email");

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Apply for Job (Student only)
exports.applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.applicants.includes(req.user._id)) {
            return res.status(400).json({ message: "Already applied" });
        }

        job.applicants.push(req.user._id);
        await job.save();

        res.json({ message: "Applied successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("applicants", "name email phone");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(job.applicants);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.selectStudent = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const studentId = req.body.studentId;

        if (!job.applicants.includes(studentId)) {
            return res.status(400).json({ message: "Student did not apply" });
        }

        if (!job.selectedStudents.includes(studentId)) {
            job.selectedStudents.push(studentId);
        }

        await job.save();

        res.json({ message: "Student selected successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.closeJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        job.status = "closed";
        await job.save();

        res.json({ message: "Job closed successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id })
            .populate("applicants", "name email");

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAppliedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            applicants: req.user._id
        }).populate("employer", "name email");

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
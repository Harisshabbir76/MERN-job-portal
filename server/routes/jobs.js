const express = require("express");
const Job = require("../models/Jobs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");


const router = express.Router();




router.post("/post-jobs", authMiddleware, async (req, res) => {
    try {
        const job = new Job({
            title: req.body.title,
            description: req.body.description,
            companyName: req.body.companyName,
            companyDescription: req.body.companyDescription,
            companyEmail: req.body.companyEmail,
            companyLocation: req.body.companyLocation,
            jobtype: req.body.jobtype,
            salary: req.body.salary,
            createdBy: req.user._id  
        });

        await job.save();
        res.json({ message: "Job posted successfully", job });
    } catch (err) {
        res.status(400).json({ error: "Error posting job" });
    }
});







router.get('/jobs', async (req, res) => {
    const jobs = await Job.find()
    res.json(jobs)
    
})

router.get('/jobs/:jobId', async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
});






const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });


router.post('/jobs/:jobId/apply', authMiddleware, upload.single('resume'), async (req, res) => {
    const { experience, coverletter } = req.body;
    const jobId = req.params.jobId;
    const resumeFilePath = req.file ? req.file.path : null;

    try {
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ error: "Job not found" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if user already applied
        if (user.appliedJobs.includes(jobId)) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }

        // Add job to user's applied jobs list
        user.appliedJobs.push(jobId);
        await user.save();

        // Send application email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: job.companyEmail,
            subject: `New Job Application for ${job.title}`,
            html: `
                <h2>New Job Application Received</h2>
                <p><strong>Applicant Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Age:</strong> ${user.age}</p>
                <p><strong>Experience:</strong> ${experience} years</p>
                <p><strong>Cover Letter:</strong></p>
                <p>${coverletter}</p>
                <p><strong>Resume:</strong> ${resumeFilePath ? "Attached" : "Not provided"}</p>
                <p>Best regards,</p>
                <p>Your Job Portal</p>
            `,
            attachments: resumeFilePath
                ? [{ filename: path.basename(resumeFilePath), path: resumeFilePath }]
                : [],
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Application submitted and email sent to the company!" });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.put("/jobs/:jobId/edit", authMiddleware, async (req, res) => {
    const { title, description, companyName, companyDescription, companyEmail, companyLocation, jobtype, salary } = req.body;

    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) return res.status(404).json({ error: "Job not found" });

        // Check if the logged-in user is the creator of the job
        if (job.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to edit this job" });
        }

        // Update the job
        job.title = title;
        job.description = description;
        job.companyName = companyName;
        job.companyDescription = companyDescription;
        job.companyEmail = companyEmail;
        job.companyLocation = companyLocation;
        job.jobtype = jobtype;
        job.salary = salary;

        await job.save();
        res.json({ message: "Job updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/posted-jobs", authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        console.log("Logged-in User ID:", req.user._id); // Debugging

        const jobs = await Job.find({ createdBy: req.user._id });
        console.log("Jobs Found:", jobs); // Debugging

        if (jobs.length === 0) {
            return res.json([]); // Return an empty array instead of an error
        }

        res.json(jobs);
    } catch (err) {
        console.error("Error fetching user-posted jobs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});





module.exports =router
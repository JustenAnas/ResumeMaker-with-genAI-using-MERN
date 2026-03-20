const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/file.middleware");
const interviewController = require("../controllers/interview.controller");
 

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * Note: Swapped upload and auth to ensure the file stream is caught early.
 */
interviewRouter.post(
    "/", 
    upload.single("resume"), 
    authMiddleware.authUser, 
    interviewController.generateInterviewReportController
);

/**
 * @route GET /api/interview/report/:interviewId
 */
interviewRouter.get(
    "/report/:interviewId", 
    authMiddleware.authUser, 
    interviewController.getInterviewReportByIdController
);

/**
 * @route GET /api/interview/
 */
interviewRouter.get(
    "/", 
    authMiddleware.authUser, 
    interviewController.getAllInterviewReportsController
);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId", 
    authMiddleware.authUser, 
    interviewController.generateResumePdfController
);

module.exports = interviewRouter;
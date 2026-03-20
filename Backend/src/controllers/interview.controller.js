const PDFParser = require("pdf2json");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */


async function generateInterviewReportController(req, res) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded or buffer missing." });
    }

    // 1. Setup the Parser (Compatible with Node 24 Classes)
    const pdfParser = new PDFParser(null, 1); 

    // 2. Wrap the parser in a Promise so the code waits for the text
    const extractedText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        // getRawTextContent() is the magic fix for getting clean strings
        resolve(pdfParser.getRawTextContent());
      });
      
      pdfParser.parseBuffer(req.file.buffer);
    });

    if (!extractedText) {
      throw new Error("PDF parsed but no text was extracted.");
    }

    console.log("✅ PDF Extraction Success using pdf2json");

    // 3. Get input from Request Body
    const { selfDescription, jobDescription } = req.body;

    // 4. Call AI Service (Double check your API Key and Model Name)
    const interviewReportByAi = await generateInterviewReport({
      resume: extractedText,
      selfDescription,
      jobDescription,
    });

    // 5. Save to Database
    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: extractedText,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found." });
    }

    res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );

    res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @description Controller to generate resume PDF based on user data.
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;
    const interviewReport =
      await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found." });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  generateInterviewReportController, // Ensure this name matches the Route exactly
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};

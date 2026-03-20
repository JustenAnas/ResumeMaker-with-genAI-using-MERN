import React, { useState, useRef } from 'react';
import "../style/home.scss";
import { useInterview } from "../hook/useinterview";
import { useNavigate } from "react-router";

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();
    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        // Ensure we have at least a JD and one form of profile
        if (!jobDescription || (!resumeFile && !selfDescription)) {
            alert("Please provide a Job Description and either a Resume or Self Description.");
            return;
        }
        
        const data = await generateReport({ jobDescription, selfDescription, resumeFile });
        if (data?._id) {
            navigate(`/interview/${data._id}`);
        }
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader-content">
                    <div className="spinner"></div>
                    <p>Analyzing Resume...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            {/* Header section added for that professional tutorial look */}
            <header className="home-header">
                <h1>Create Your Custom <span className="highlight">Interview Plan</span></h1>
                <p>Our AI analyzes job requirements against your profile to build a winning strategy.</p>
            </header>

            <main className="home">
                <div className="left">
                    <label className="input-label">Target Job Description</label>
                    <textarea 
                        onChange={(e) => setJobDescription(e.target.value)} 
                        name="jobDescription" 
                        id="jobDescription" 
                        placeholder="Paste the full job description here... (Required)"
                    ></textarea>
                </div> 

                <div className="right">
                    <div className="input-group">
                        <label htmlFor="resume">Upload Resume</label>
                        <input 
                            ref={resumeInputRef} 
                            type="file" 
                            name="resume" 
                            id="resume" 
                            accept=".pdf" 
                        />
                    </div>

                    <div className="or-divider"><span>OR</span></div>

                    <div className="input-group">
                        <label htmlFor="selfDescription">Self Description</label>
                        <textarea 
                            onChange={(e) => setSelfDescription(e.target.value)} 
                            name="selfDescription" 
                            id="selfDescription" 
                            placeholder="Briefly describe your experience and skills..."
                        ></textarea>
                    </div>

                    <button onClick={handleGenerateReport} className="generate-btn">
                        Generate Interview Report
                    </button>
                </div>
            </main>

            {/* Footer section for links and policy */}
            <footer className="home-footer">
                <div className="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                    <a href="#help">Help Center</a>
                </div>
                <p>&copy; 2026 AI Interview Strategist. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
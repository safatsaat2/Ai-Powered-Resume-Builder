import { useState } from "react";
import {
  generateSummary,
  generateExperience,
  improveResumeSection,
} from "../utils/gemini";

export default function Resume() {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
    certifications: "",
    languages: "",
    references: "",
    customSections: [],
    experiences: [
    {
      id: 1,
      company: '',
      position: '',
      duration: '',
      description: ''
    }
  ]
  });

  const [loading, setLoading] = useState({
    summary: false,
    experience: false,
    education: false,
    improve: false,
  });

  const [activeTab, setActiveTab] = useState("form");
  const [exportFormat, setExportFormat] = useState("pdf");

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleGenerateSummary = async () => {
    setLoading({ ...loading, summary: true });
    try {
      const prompt = `Write a professional 3-sentence summary for ${
        resume.name || "a candidate"
      } who has these skills: ${
        resume.skills || "various technical and soft skills"
      }. Focus on achievements and use professional tone.`;
      const aiSummary = await generateSummary(prompt);
      setResume({ ...resume, summary: aiSummary });
    } catch (error) {
      alert("Failed to generate summary. Please try again.");
    }
    setLoading({ ...loading, summary: false });
  };

  const handleGenerateExperience = async () => {
    setLoading({ ...loading, experience: true });
    try {
      const prompt = `${
        resume.experience || "No experience provided yet."
      } Skills: ${resume.skills || "Various skills"}`;
      const aiExperience = await generateExperience(prompt);
      setResume({ ...resume, experience: aiExperience });
    } catch (error) {
      alert("Failed to generate experience. Please try again.");
    }
    setLoading({ ...loading, experience: false });
  };

  const handleGenerateEducation = async () => {
    setLoading({ ...loading, education: true });
    try {
      const prompt = `Format this education section professionally for a resume: ${
        resume.education || "No education details provided yet."
      }`;
      const aiEducation = await generateSummary(prompt);
      setResume({ ...resume, education: aiEducation });
    } catch (error) {
      alert("Failed to generate education section. Please try again.");
    }
    setLoading({ ...loading, education: false });
  };

  const handleImproveSection = async (section) => {
    setLoading({ ...loading, improve: true });
    try {
      const improvedContent = await improveResumeSection(
        section,
        resume[section] || `No ${section} content yet.`
      );
      setResume({ ...resume, [section]: improvedContent });
    } catch (error) {
      alert(`Failed to improve ${section}. Please try again.`);
    }
    setLoading({ ...loading, improve: false });
  };

  const handleExport = () => {
    alert(`Exporting resume as ${exportFormat.toUpperCase()}...`);
    // In a real app, you would implement actual export functionality here
  };
const addExperience = () => {
  setResume({
    ...resume,
    experiences: [...resume.experiences, {
      id: Date.now(),
      company: '',
      position: '',
      duration: '',
      description: ''
    }]
  });
};
const removeExperience = (id) => {
  setResume({
    ...resume,
    experiences: resume.experiences.filter(exp => exp.id !== id)
  });
};
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Resume Builder</h1>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "form"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("form")}
        >
          Build Resume
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "preview"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
      </div>

      {activeTab === "form" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  className="w-full border p-2 rounded"
                  name="name"
                  placeholder="John Doe"
                  value={resume.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border p-2 rounded"
                  name="email"
                  placeholder="john@example.com"
                  value={resume.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full border p-2 rounded"
                  name="phone"
                  placeholder="(123) 456-7890"
                  value={resume.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Professional Summary
                </label>
                <textarea
                  className="w-full border p-2 rounded min-h-[100px]"
                  name="summary"
                  placeholder="Experienced professional with..."
                  value={resume.summary}
                  onChange={handleChange}
                />
                <button
                  className="mt-2 !bg-blue-900 text-white px-3 py-1 rounded text-sm"
                  onClick={handleGenerateSummary}
                  disabled={loading.summary}
                >
                  {loading.summary ? "Generating..." : "AI Generate Summary"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <textarea
                  className="w-full border p-2 rounded min-h-[80px]"
                  name="skills"
                  placeholder="JavaScript, React, Project Management..."
                  value={resume.skills}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Projects</label>
                <textarea
                  name="projects"
                  value={resume.projects}
                  onChange={handleChange}
                />
                <button onClick={() => handleGenerateSection("projects")}>
                  AI Generate Projects
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Form Continued */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Experience & Education</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Work Experience
              </label>
              <textarea
                className="w-full border p-2 rounded min-h-[150px]"
                name="experience"
                placeholder="Company Name, Position\n- Achievements..."
                value={resume.experience}
                onChange={handleChange}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="!bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={handleGenerateExperience}
                  disabled={loading.experience}
                >
                  {loading.experience
                    ? "Generating..."
                    : "AI Generate Experience"}
                </button>
                <button
                  className="!bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleImproveSection("experience")}
                  disabled={loading.improve}
                >
                  {loading.improve ? "Improving..." : "Improve Section"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Education
              </label>
              <textarea
                className="w-full border p-2 rounded min-h-[100px]"
                name="education"
                placeholder="University Name, Degree\nYear of Graduation..."
                value={resume.education}
                onChange={handleChange}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="!bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={handleGenerateEducation}
                  disabled={loading.education}
                >
                  {loading.education ? "Generating..." : "AI Format Education"}
                </button>
                <button
                  className="!bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleImproveSection("education")}
                  disabled={loading.improve}
                >
                  {loading.improve ? "Improving..." : "Improve Section"}
                </button>
              </div>
            </div>

            {/* Export Options */}
            <div className="mt-8 p-4 border rounded bg-gray-50">
              <h3 className="font-medium mb-2">Export Options</h3>
              <div className="flex items-center gap-4">
                <select
                  className="border p-2 rounded"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">Word</option>
                  <option value="txt">Plain Text</option>
                </select>
                <button
                  className="!bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={handleExport}
                >
                  Export Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Tab */
        <div className="bg-white p-6 rounded shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{resume.name || "Your Name"}</h2>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              {resume.email && <span>{resume.email}</span>}
              {resume.phone && <span>{resume.phone}</span>}
            </div>
          </div>

          {resume.summary && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold border-b pb-1 mb-2">
                Professional Summary
              </h3>
              <p className="whitespace-pre-line">{resume.summary}</p>
            </div>
          )}

          {resume.skills && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold border-b pb-1 mb-2">
                Skills
              </h3>
              <p className="whitespace-pre-line">{resume.skills}</p>
            </div>
          )}

          {resume.experience && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold border-b pb-1 mb-2">
                Work Experience
              </h3>
              <div className="whitespace-pre-line">{resume.experience}</div>
            </div>
          )}

          {resume.education && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold border-b pb-1 mb-2">
                Education
              </h3>
              <div className="whitespace-pre-line">{resume.education}</div>
            </div>
          )}

          {!resume.summary &&
            !resume.skills &&
            !resume.experience &&
            !resume.education && (
              <p className="text-gray-500 text-center py-8">
                Fill out the form to see your resume preview
              </p>
            )}
        </div>
      )}
    </div>
  );
}

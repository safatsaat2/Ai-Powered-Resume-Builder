import { useState, useRef } from 'react';
import { generateSummary, generateExperience, improveResumeSection, generateSection } from '../utils/gemini';
import { exportToPDF } from '../utils/exportResume';

export default function Resume() {
  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    skills: '',
    experiences: [
      {
        id: Date.now(),
        company: '',
        position: '',
        duration: '',
        description: ''
      }
    ],
    education: '',
    projects: '',
    certifications: '',
    languages: ''
  });

  const [loading, setLoading] = useState({
    summary: false,
    experience: false,
    education: false,
    projects: false,
    improve: false
  });

  const [activeTab, setActiveTab] = useState('form');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const previewRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now(),
          company: '',
          position: '',
          duration: '',
          description: ''
        }
      ]
    }));
  };

  const removeExperience = (id) => {
    if (resume.experiences.length > 1) {
      setResume(prev => ({
        ...prev,
        experiences: prev.experiences.filter(exp => exp.id !== id)
      }));
    }
  };

  const handleGenerate = async (section, prompt) => {
    setLoading(prev => ({ ...prev, [section]: true }));
    try {
      let generatedContent;
      
      if (section === 'summary') {
        generatedContent = await generateSummary(prompt);
      } else if (section === 'experiences') {
        generatedContent = await generateExperience(prompt);
      } else {
        generatedContent = await generateSection(section, prompt);
      }

      setResume(prev => ({ 
        ...prev, 
        [section]: section === 'experiences' ? 
          { ...prev.experiences[0], description: generatedContent } : 
          generatedContent 
      }));
    } catch (error) {
      alert(`Failed to generate ${section}. Please try again.`);
      console.error(error);
    }
    setLoading(prev => ({ ...prev, [section]: false }));
  };

  const handleImproveSection = async (section, content) => {
    setLoading(prev => ({ ...prev, improve: true }));
    try {
      const improvedContent = await improveResumeSection(section, content || `No ${section} content yet.`);
      setResume(prev => ({ ...prev, [section]: improvedContent }));
    } catch (error) {
      alert(`Failed to improve ${section}. Please try again.`);
    }
    setLoading(prev => ({ ...prev, improve: false }));
  };

  const handleExport = async () => {
    if (exportFormat === 'pdf') {
      await exportToPDF(previewRef.current, `${resume.name || 'my'}-resume`);
    } else {
      // Implement other export formats here
      alert(`${exportFormat.toUpperCase()} export will be implemented soon`);
    }
  };

  const templates = [
    { id: 'professional', name: 'Professional', class: 'bg-white text-gray-800' },
    { id: 'modern', name: 'Modern', class: 'bg-gray-50 text-gray-800' },
    { id: 'creative', name: 'Creative', class: 'bg-indigo-50 text-gray-800' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">AI Resume Builder</h1>
        <p className="text-gray-600">Create a professional resume in minutes</p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'form' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('form')}
        >
          Build Resume
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'preview' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'templates' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
      </div>

      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name*</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                    name="name"
                    value={resume.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email*</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                    name="email"
                    type="email"
                    value={resume.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                    name="phone"
                    value={resume.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                    name="address"
                    value={resume.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Professional Summary</label>
                  <textarea
                    className="w-full border p-2 rounded min-h-[120px] focus:ring-2 focus:ring-indigo-200"
                    name="summary"
                    value={resume.summary}
                    onChange={handleChange}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                      onClick={() => handleGenerate(
                        'summary', 
                        `Write a professional 3-sentence summary for ${resume.name || 'a candidate'} with skills: ${resume.skills || 'various skills'}. Focus on achievements.`
                      )}
                      disabled={loading.summary}
                    >
                      {loading.summary ? 'Generating...' : 'AI Generate'}
                    </button>
                    <button
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                      onClick={() => handleImproveSection('summary', resume.summary)}
                      disabled={loading.improve}
                    >
                      {loading.improve ? 'Improving...' : 'Improve'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">Skills & Languages</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                  <textarea
                    className="w-full border p-2 rounded min-h-[80px] focus:ring-2 focus:ring-indigo-200"
                    name="skills"
                    value={resume.skills}
                    onChange={handleChange}
                    placeholder="JavaScript, React, Project Management..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Languages</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                    name="languages"
                    value={resume.languages}
                    onChange={handleChange}
                    placeholder="English (Fluent), Spanish (Basic)..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Experience & Education */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-600">Work Experience</h2>
                <button 
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                  onClick={addExperience}
                >
                  + Add Experience
                </button>
              </div>
              
              <div className="space-y-6">
                {resume.experiences.map((exp, index) => (
                  <div key={exp.id} className="border-l-2 border-indigo-200 pl-4 relative">
                    {index > 0 && (
                      <button 
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        onClick={() => removeExperience(exp.id)}
                      >
                        ×
                      </button>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Company*</label>
                        <input
                          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Position*</label>
                          <input
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Duration</label>
                          <input
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                            value={exp.duration}
                            onChange={(e) => handleExperienceChange(exp.id, 'duration', e.target.value)}
                            placeholder="Jan 2020 - Present"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          className="w-full border p-2 rounded min-h-[100px] focus:ring-2 focus:ring-indigo-200"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                            onClick={() => handleGenerate(
                              'experiences',
                              `Write professional work experience bullet points for a ${exp.position} at ${exp.company}. Skills: ${resume.skills}. Focus on achievements with metrics.`
                            )}
                            disabled={loading.experience}
                          >
                            {loading.experience ? 'Generating...' : 'AI Generate'}
                          </button>
                          <button
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                            onClick={() => handleImproveSection('experiences', exp.description)}
                            disabled={loading.improve}
                          >
                            {loading.improve ? 'Improving...' : 'Improve'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">Education</h2>
              
              <div className="space-y-4">
                <textarea
                  className="w-full border p-2 rounded min-h-[120px] focus:ring-2 focus:ring-indigo-200"
                  name="education"
                  value={resume.education}
                  onChange={handleChange}
                  placeholder="University Name, Degree, Year..."
                />
                <div className="flex gap-2">
                  <button
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                    onClick={() => handleGenerate(
                      'education',
                      `Format this education section professionally: ${resume.education || 'No education details yet'}. Include degree, university, and year.`
                    )}
                    disabled={loading.education}
                  >
                    {loading.education ? 'Generating...' : 'AI Generate'}
                  </button>
                  <button
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                    onClick={() => handleImproveSection('education', resume.education)}
                    disabled={loading.improve}
                  >
                    {loading.improve ? 'Improving...' : 'Improve'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Projects & Export */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">Projects</h2>
              
              <div className="space-y-4">
                <textarea
                  className="w-full border p-2 rounded min-h-[120px] focus:ring-2 focus:ring-indigo-200"
                  name="projects"
                  value={resume.projects}
                  onChange={handleChange}
                  placeholder="Project Name, Technologies Used, Description..."
                />
                <div className="flex gap-2">
                  <button
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                    onClick={() => handleGenerate(
                      'projects',
                      `Write 2-3 professional project descriptions for a resume. Skills: ${resume.skills}. Include technologies used and outcomes.`
                    )}
                    disabled={loading.projects}
                  >
                    {loading.projects ? 'Generating...' : 'AI Generate'}
                  </button>
                  <button
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                    onClick={() => handleImproveSection('projects', resume.projects)}
                    disabled={loading.improve}
                  >
                    {loading.improve ? 'Improving...' : 'Improve'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">Certifications</h2>
              
              <div>
                <textarea
                  className="w-full border p-2 rounded min-h-[80px] focus:ring-2 focus:ring-indigo-200"
                  name="certifications"
                  value={resume.certifications}
                  onChange={handleChange}
                  placeholder="Certification Name, Issuing Organization, Year..."
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">Export Resume</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Format</label>
                  <select 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-200"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">Word Document</option>
                    <option value="txt">Plain Text</option>
                  </select>
                </div>
                
                <button
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
                  onClick={handleExport}
                  disabled={!resume.name || !resume.email}
                >
                  <span>Export Resume</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'preview' ? (
        /* Preview Tab */
        <div className="flex justify-center">
          <div 
            ref={previewRef}
            className={`w-full max-w-2xl p-8 rounded-lg shadow-lg ${templates.find(t => t.id === selectedTemplate)?.class || 'bg-white'}`}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{resume.name || 'Your Name'}</h2>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                {resume.email && <span>{resume.email}</span>}
                {resume.phone && <span>{resume.phone}</span>}
                {resume.address && <span>{resume.address}</span>}
              </div>
            </div>

            {resume.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-1 mb-2">PROFESSIONAL SUMMARY</h3>
                <p className="whitespace-pre-line text-sm">{resume.summary}</p>
              </div>
            )}

            {resume.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-1 mb-2">SKILLS</h3>
                <p className="whitespace-pre-line text-sm">{resume.skills}</p>
              </div>
            )}

            {resume.experiences.some(exp => exp.company || exp.position || exp.description) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-1 mb-2">WORK EXPERIENCE</h3>
                {resume.experiences.map((exp, index) => (
                  (exp.company || exp.position || exp.description) && (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{exp.company}</h4>
                        {exp.duration && <span className="text-sm text-gray-600">{exp.duration}</span>}
                      </div>
                      {exp.position && <p className="text-sm italic mb-2">{exp.position}</p>}
                      {exp.description && (
                        <div className="whitespace-pre-line text-sm pl-4">
                          {exp.description.split('\n').map((item, i) => (
                            <p key={i} className="mb-1">{item}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {resume.education && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-1 mb-2">EDUCATION</h3>
                <div className="whitespace-pre-line text-sm">{resume.education}</div>
              </div>
            )}

            {resume.projects && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-1 mb-2">PROJECTS</h3>
                <div className="whitespace-pre-line text-sm">{resume.projects}</div>
              </div>
            )}

            {resume.certifications && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-1 mb-2">CERTIFICATIONS</h3>
                <div className="whitespace-pre-line text-sm">{resume.certifications}</div>
              </div>
            )}

            {resume.languages && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-1 mb-2">LANGUAGES</h3>
                <p className="text-sm">{resume.languages}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Templates Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map(template => (
            <div 
              key={template.id}
              className={`p-6 rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id ? 'ring-4 ring-indigo-500' : ''}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className={`${template.class} p-6 rounded shadow h-80 overflow-y-auto`}>
                <h3 className="text-xl font-bold mb-2">Sample Resume</h3>
                <p className="text-sm mb-4">This is a preview of the {template.name} template</p>
                <div className="h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  Template Preview
                </div>
              </div>
              <div className="mt-4 text-center font-medium">
                {template.name} Template
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
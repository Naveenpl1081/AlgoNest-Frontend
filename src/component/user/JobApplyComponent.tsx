import React, { useState } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  contactNo?: string;
  location?: string;
  highestQualification?: string;
  qualificationName?: string;
  institutionName?: string;
  yearOfGraduation?: string;
  cgpa?: string;
  skills?: string;
  resume?: string;
  aboutYourself?: string;
}

interface JobApplyComponentProps {
  onSubmitApplication: (applicationData: any) => void;
}

const JobApplyComponent: React.FC<JobApplyComponentProps> = ({ onSubmitApplication }) => {
  const [skills, setSkills] = useState<string[]>([""]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [plusTwoCertificate, setPlusTwoCertificate] = useState<File | null>(null);
  const [degreeCertificate, setDegreeCertificate] = useState<File | null>(null);
  const [pgCertificate, setPgCertificate] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    location: "",
    highestQualification: "",
    qualificationName: "",
    institutionName: "",
    yearOfGraduation: "",
    cgpa: "",
    totalExperience: "",
    previousJobTitles: "",
    companyNames: "",
    githubProfile: "",
    linkedinProfile: "",
    personalWebsite: "",
    aboutYourself: "",
  });

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
    
    if (errors.skills) {
      setErrors({ ...errors, skills: undefined });
    }
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
   
    if (errors.skills && value.trim()) {
      setErrors({ ...errors, skills: undefined });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
   
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: "File size should not exceed 5MB" });
        return;
      }
      setResumeFile(file);
      setErrors({ ...errors, resume: undefined });
    }
  };

  const handlePlusTwoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setPlusTwoCertificate(file);
    }
  };

  const handleDegreeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setDegreeCertificate(file);
    }
  };

  const handlePgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setPgCertificate(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Contact number validation
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNo.replace(/\s/g, ""))) {
      newErrors.contactNo = "Please enter a valid 10-digit contact number";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Education validations
    if (!formData.highestQualification.trim()) {
      newErrors.highestQualification = "Highest qualification is required";
    }

    if (!formData.qualificationName.trim()) {
      newErrors.qualificationName = "Qualification name is required";
    }

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = "Institution name is required";
    }

    if (!formData.yearOfGraduation.trim()) {
      newErrors.yearOfGraduation = "Year of graduation is required";
    } else if (!/^\d{4}$/.test(formData.yearOfGraduation)) {
      newErrors.yearOfGraduation = "Please enter a valid year (e.g., 2024)";
    } else {
      const year = parseInt(formData.yearOfGraduation);
      const currentYear = new Date().getFullYear();
      if (year < 1950 || year > currentYear + 5) {
        newErrors.yearOfGraduation = `Year must be between 1950 and ${currentYear + 5}`;
      }
    }

    if (!formData.cgpa.trim()) {
      newErrors.cgpa = "CGPA is required";
    } else if (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      newErrors.cgpa = "Please enter a valid CGPA (0-10)";
    }

    // Skills validation
    const validSkills = skills.filter(skill => skill.trim() !== "");
    if (validSkills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    // Resume validation
    if (!resumeFile) {
      newErrors.resume = "Resume is required";
    }

    // About yourself validation
    if (!formData.aboutYourself.trim()) {
      newErrors.aboutYourself = "Please tell us about yourself";
    } else if (formData.aboutYourself.trim().length < 50) {
      newErrors.aboutYourself = "Please provide at least 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const applicationData = {
        ...formData,
        skills: skills.filter(s => s.trim()),
        resume: resumeFile,
        plusTwoCertificate: plusTwoCertificate,
        degreeCertificate: degreeCertificate,
        pgCertificate: pgCertificate,
      };
      
      console.log("Form data being submitted:", {
        ...applicationData,
        resume: resumeFile?.name,
        plusTwoCertificate: plusTwoCertificate?.name,
        degreeCertificate: degreeCertificate?.name,
        pgCertificate: pgCertificate?.name,
      });
      
      onSubmitApplication(applicationData);
      
    } else {
      const firstErrorField = document.querySelector('.border-red-500');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-600/50 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Apply for this role
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Personal Information <span className="text-red-400">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.name ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.email ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Contact No <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={formData.contactNo}
                onChange={(e) => handleInputChange("contactNo", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.contactNo ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Enter contact number"
              />
              {errors.contactNo && (
                <p className="text-red-400 text-sm mt-1">{errors.contactNo}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.location ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Enter your location"
              />
              {errors.location && (
                <p className="text-red-400 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Educational Background */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Educational Background <span className="text-red-400">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Highest Qualification <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.highestQualification}
                onChange={(e) => handleInputChange("highestQualification", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.highestQualification ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="e.g., B.Tech, M.Tech, BCA"
              />
              {errors.highestQualification && (
                <p className="text-red-400 text-sm mt-1">{errors.highestQualification}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Qualification Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.qualificationName}
                onChange={(e) => handleInputChange("qualificationName", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.qualificationName ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="e.g., Computer Science"
              />
              {errors.qualificationName && (
                <p className="text-red-400 text-sm mt-1">{errors.qualificationName}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Institution Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) => handleInputChange("institutionName", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.institutionName ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Enter institution"
              />
              {errors.institutionName && (
                <p className="text-red-400 text-sm mt-1">{errors.institutionName}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Year of Graduation <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.yearOfGraduation}
                onChange={(e) => handleInputChange("yearOfGraduation", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.yearOfGraduation ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="e.g., 2024"
              />
              {errors.yearOfGraduation && (
                <p className="text-red-400 text-sm mt-1">{errors.yearOfGraduation}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                CGPA <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) => handleInputChange("cgpa", e.target.value)}
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.cgpa ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="e.g., 8.5"
              />
              {errors.cgpa && (
                <p className="text-red-400 text-sm mt-1">{errors.cgpa}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Work Experience (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Total experience of work
              </label>
              <input
                type="text"
                value={formData.totalExperience}
                onChange={(e) => handleInputChange("totalExperience", e.target.value)}
                className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="e.g., 2 years"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Previous Job Titles
              </label>
              <input
                type="text"
                value={formData.previousJobTitles}
                onChange={(e) => handleInputChange("previousJobTitles", e.target.value)}
                className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="e.g., Junior Developer"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300 mb-2 text-sm">
              Company Names
            </label>
            <input
              type="text"
              value={formData.companyNames}
              onChange={(e) => handleInputChange("companyNames", e.target.value)}
              className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Enter company names"
            />
          </div>
        </div>

        {/* Technical Expertise */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Technical Expertise <span className="text-red-400">*</span>
          </h3>
          <label className="block text-gray-300 mb-2 text-sm">
            Skills <span className="text-red-400">*</span>
          </label>
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className={`flex-1 bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.skills && index === 0 ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Enter a skill"
              />
              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {errors.skills && (
            <p className="text-red-400 text-sm mb-2">{errors.skills}</p>
          )}
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add another skill</span>
          </button>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Links (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Github profile
              </label>
              <input
                type="url"
                value={formData.githubProfile}
                onChange={(e) => handleInputChange("githubProfile", e.target.value)}
                className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Enter Github URL"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                LinkedIn profile
              </label>
              <input
                type="url"
                value={formData.linkedinProfile}
                onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Enter LinkedIn URL"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300 mb-2 text-sm">
              Personal website
            </label>
            <input
              type="url"
              value={formData.personalWebsite}
              onChange={(e) => handleInputChange("personalWebsite", e.target.value)}
              className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Enter website URL"
            />
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <label className="block text-gray-300 mb-2 text-sm">
                Resume <span className="text-red-400">*</span>
              </label>
              <label className={`block bg-slate-600/50 border rounded-lg p-6 cursor-pointer hover:bg-slate-600/70 transition-colors ${
                errors.resume ? "border-red-500" : "border-slate-500"
              }`}>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                {resumeFile && (
                  <p className="text-xs text-green-400 mt-2 truncate">
                    {resumeFile.name}
                  </p>
                )}
              </label>
              {errors.resume && (
                <p className="text-red-400 text-sm mt-1">{errors.resume}</p>
              )}
            </div>
            <div className="text-center">
              <label className="block text-gray-300 mb-2 text-sm">Plus Two Certificate</label>
              <label className="block bg-slate-600/50 border border-slate-500 rounded-lg p-6 cursor-pointer hover:bg-slate-600/70 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handlePlusTwoUpload}
                />
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                {plusTwoCertificate && (
                  <p className="text-xs text-green-400 mt-2 truncate">
                    {plusTwoCertificate.name}
                  </p>
                )}
              </label>
            </div>
            <div className="text-center">
              <label className="block text-gray-300 mb-2 text-sm">Degree Certificate</label>
              <label className="block bg-slate-600/50 border border-slate-500 rounded-lg p-6 cursor-pointer hover:bg-slate-600/70 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDegreeUpload}
                />
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                {degreeCertificate && (
                  <p className="text-xs text-green-400 mt-2 truncate">
                    {degreeCertificate.name}
                  </p>
                )}
              </label>
            </div>
            <div className="text-center">
              <label className="block text-gray-300 mb-2 text-sm">PG Certificate</label>
              <label className="block bg-slate-600/50 border border-slate-500 rounded-lg p-6 cursor-pointer hover:bg-slate-600/70 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handlePgUpload}
                />
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                {pgCertificate && (
                  <p className="text-xs text-green-400 mt-2 truncate">
                    {pgCertificate.name}
                  </p>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* About Yourself */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Tell About Yourself <span className="text-red-400">*</span>
          </h3>
          <textarea
            rows={6}
            value={formData.aboutYourself}
            onChange={(e) => handleInputChange("aboutYourself", e.target.value)}
            className={`w-full bg-slate-600/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none ${
              errors.aboutYourself ? "border-red-500" : "border-slate-500"
            }`}
            placeholder="Write about yourself... (minimum 50 characters)"
          />
          {errors.aboutYourself && (
            <p className="text-red-400 text-sm mt-1">{errors.aboutYourself}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            {formData.aboutYourself.length} / 50 characters minimum
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplyComponent;
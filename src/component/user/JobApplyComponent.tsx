import React, { useEffect, useRef, useState } from "react";
import { Upload, Plus, Trash2, Loader2, MapPin } from "lucide-react";
import { LocationSuggestion } from "../recruiter/JobPostComponent";
import { applicationService } from "../../service/ApplicationService";

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
  githubProfile?: string;
  linkedinProfile?: string;
  personalWebsite?: string;
}

interface JobApplyComponentProps {
  onSubmitApplication: (applicationData: any) => void;
}
const predefinedSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML/CSS",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
  "REST API",
  "GraphQL",
  "Vue.js",
  "Angular",
  "Express.js",
  "Django",
  "Flask",
];

const JobApplyComponent: React.FC<JobApplyComponentProps> = ({
  onSubmitApplication,
}) => {
  const [skills, setSkills] = useState<string[]>([""]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [plusTwoCertificate, setPlusTwoCertificate] = useState<File | null>(
    null
  );
  const [degreeCertificate, setDegreeCertificate] = useState<File | null>(null);
  const [pgCertificate, setPgCertificate] = useState<File | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const locationInputRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);

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

  const handleLocationSelect = (location: LocationSuggestion) => {
    const parts = location.display_name.split(",");
    const cleanLocation = parts.slice(0, 2).join(",").trim();

    setFormData((prev) => ({
      ...prev,
      location: cleanLocation,
    }));
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const query = formData.location.trim();

      if (query.length < 3) {
        setLocationSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingLocations(true);

      try {
        const response = await applicationService.fetchLocationSuggestions(
          query
        );

        if (response.data && response.data.success) {
          setLocationSuggestions(response.data.data || []);
          setShowSuggestions(response.data.data.length > 0);
        } else {
          setLocationSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocationSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchLocations();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [formData.location]);

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);

    if (errors.skills && value.trim()) {
      setErrors({ ...errors, skills: undefined });
    }

    if (value.trim()) {
      setShowDropdown(index);
    } else {
      setShowDropdown(null);
    }
  };

  const selectSkill = (index: number, skill: string) => {
    const newSkills = [...skills];
    newSkills[index] = skill;
    setSkills(newSkills);
    setShowDropdown(null);

    if (errors.skills) {
      setErrors({ ...errors, skills: undefined });
    }
  };

  const getFilteredSkills = (inputValue: string) => {
    if (!inputValue.trim()) return predefinedSkills;
    return predefinedSkills.filter((skill) =>
      skill.toLowerCase().includes(inputValue.toLowerCase())
    );
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
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidGithubUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    if (!isValidUrl(url)) return false;
    return url.toLowerCase().includes("github.com");
  };

  const isValidLinkedInUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    if (!isValidUrl(url)) return false;
    return url.toLowerCase().includes("linkedin.com");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if(formData.name.trim().length>100){
      newErrors.name = "Name can not be add more than 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNo.replace(/\s/g, ""))) {
      newErrors.contactNo = "Please enter a valid 10-digit contact number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.highestQualification.trim()) {
      newErrors.highestQualification = "Highest qualification is required";
    }else if(formData.highestQualification.trim().length>100){
      newErrors.name = "Name can not be add more than 100 characters";
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
        newErrors.yearOfGraduation = `Year must be between 1950 and ${
          currentYear + 5
        }`;
      }
    }

    if (!formData.cgpa.trim()) {
      newErrors.cgpa = "CGPA is required";
    } else if (
      isNaN(Number(formData.cgpa)) ||
      Number(formData.cgpa) < 0 ||
      Number(formData.cgpa) > 10
    ) {
      newErrors.cgpa = "Please enter a valid CGPA (0-10)";
    }

    const validSkills = skills.filter((skill) => skill.trim() !== "");
    if (validSkills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    if (!resumeFile) {
      newErrors.resume = "Resume is required";
    }

    if (!formData.aboutYourself.trim()) {
      newErrors.aboutYourself = "Please tell us about yourself";
    } else if (formData.aboutYourself.trim().length < 50) {
      newErrors.aboutYourself = "Please provide at least 50 characters";
    }
    if (
      formData.githubProfile.trim() &&
      !isValidGithubUrl(formData.githubProfile)
    ) {
      newErrors.githubProfile =
        "Please enter a valid GitHub URL (e.g., https://github.com/username)";
    }

    if (
      formData.linkedinProfile.trim() &&
      !isValidLinkedInUrl(formData.linkedinProfile)
    ) {
      newErrors.linkedinProfile =
        "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)";
    }

    if (
      formData.personalWebsite.trim() &&
      !isValidUrl(formData.personalWebsite)
    ) {
      newErrors.personalWebsite =
        "Please enter a valid URL (e.g., https://example.com)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const applicationData = {
        ...formData,
        skills: skills.filter((s) => s.trim()),
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
      const firstErrorField = document.querySelector(".border-red-500");
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-600/50 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Apply for this role
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            <div ref={locationInputRef}>
              <label className="block text-gray-300 mb-2 text-sm">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                onFocus={() => {
                  if (locationSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="e.g. Bangalore, Karnataka"
                autoComplete="off"
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.location ? "border-red-500" : "border-slate-500"
                }`}
              />
              {isLoadingLocations && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                </div>
              )}
              {errors.location && (
                <p className="text-red-400 text-sm mt-1">{errors.location}</p>
              )}
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                  {locationSuggestions.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700 last:border-b-0 flex items-start gap-3"
                    >
                      <MapPin className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-200">
                        {location.display_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {showSuggestions &&
                !isLoadingLocations &&
                formData.location.length >= 3 &&
                locationSuggestions.length === 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 text-center text-gray-400 text-sm">
                    No locations found. Try a different search.
                  </div>
                )}
            </div>
          </div>
        </div>

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
                onChange={(e) =>
                  handleInputChange("highestQualification", e.target.value)
                }
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.highestQualification
                    ? "border-red-500"
                    : "border-slate-500"
                }`}
                placeholder="e.g., B.Tech, M.Tech, BCA"
              />
              {errors.highestQualification && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.highestQualification}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Qualification Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.qualificationName}
                onChange={(e) =>
                  handleInputChange("qualificationName", e.target.value)
                }
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.qualificationName
                    ? "border-red-500"
                    : "border-slate-500"
                }`}
                placeholder="e.g., Computer Science"
              />
              {errors.qualificationName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.qualificationName}
                </p>
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
                onChange={(e) =>
                  handleInputChange("institutionName", e.target.value)
                }
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.institutionName ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Enter institution"
              />
              {errors.institutionName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.institutionName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Year of Graduation <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.yearOfGraduation}
                onChange={(e) =>
                  handleInputChange("yearOfGraduation", e.target.value)
                }
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.yearOfGraduation
                    ? "border-red-500"
                    : "border-slate-500"
                }`}
                placeholder="e.g., 2024"
              />
              {errors.yearOfGraduation && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.yearOfGraduation}
                </p>
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
                onChange={(e) =>
                  handleInputChange("totalExperience", e.target.value)
                }
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
                onChange={(e) =>
                  handleInputChange("previousJobTitles", e.target.value)
                }
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
              onChange={(e) =>
                handleInputChange("companyNames", e.target.value)
              }
              className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Enter company names"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Technical Expertise <span className="text-red-400">*</span>
          </h3>
          <label className="block text-gray-300 mb-2 text-sm">
            Skills <span className="text-red-400">*</span>
          </label>
          {skills.map((skill, index) => (
            <div key={index} className="relative flex gap-2 mb-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  onFocus={() => setShowDropdown(index)}
                  onBlur={() => setTimeout(() => setShowDropdown(null), 200)}
                  className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                    errors.skills && index === 0
                      ? "border-red-500"
                      : "border-slate-500"
                  }`}
                  placeholder="Type or select a skill"
                />

                {showDropdown === index && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-500 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {getFilteredSkills(skill).map((predefinedSkill, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSkill(index, predefinedSkill)}
                        className="px-4 py-2 hover:bg-slate-600 cursor-pointer text-white text-sm transition-colors"
                      >
                        {predefinedSkill}
                      </div>
                    ))}
                    {getFilteredSkills(skill).length === 0 && (
                      <div className="px-4 py-2 text-gray-400 text-sm">
                        No matching skills. Type to add custom skill.
                      </div>
                    )}
                  </div>
                )}
              </div>

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

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Links (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Github profile
              </label>
              <input
                type="text"
                value={formData.githubProfile}
                onChange={(e) =>
                  handleInputChange("githubProfile", e.target.value)
                }
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.githubProfile ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="https://github.com/username"
              />
              {errors.githubProfile && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.githubProfile}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                LinkedIn profile
              </label>
              <input
                type="text"
                value={formData.linkedinProfile}
                onChange={(e) =>
                  handleInputChange("linkedinProfile", e.target.value)
                }
                className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                  errors.linkedinProfile ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="https://linkedin.com/in/username"
              />
              {errors.linkedinProfile && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.linkedinProfile}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300 mb-2 text-sm">
              Personal website
            </label>
            <input
              type="text"
              value={formData.personalWebsite}
              onChange={(e) =>
                handleInputChange("personalWebsite", e.target.value)
              }
              className={`w-full bg-slate-600/50 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${
                errors.personalWebsite ? "border-red-500" : "border-slate-500"
              }`}
              placeholder="https://yourwebsite.com"
            />
            {errors.personalWebsite && (
              <p className="text-red-400 text-sm mt-1">
                {errors.personalWebsite}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <label className="block text-gray-300 mb-2 text-sm">
                Resume <span className="text-red-400">*</span>
              </label>
              <label
                className={`block bg-slate-600/50 border rounded-lg p-6 cursor-pointer hover:bg-slate-600/70 transition-colors ${
                  errors.resume ? "border-red-500" : "border-slate-500"
                }`}
              >
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
              <label className="block text-gray-300 mb-2 text-sm">
                Plus Two Certificate
              </label>
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
              <label className="block text-gray-300 mb-2 text-sm">
                Degree Certificate
              </label>
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
              <label className="block text-gray-300 mb-2 text-sm">
                PG Certificate
              </label>
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

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  MapPin,
  DollarSign,
  Users,
  Code,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import { JobPostFormData } from "../../models/recruiter";
import { validateJobPost } from "../../utils/validations/ValidateJobPost";
import { jobService } from "../../service/jobService";

interface JobPostComponentProps {
  onSubmit: (data: JobPostFormData) => void;
  initialData?: JobPostFormData;
  isEditMode?: boolean;
}

export interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const JobPostComponent: React.FC<JobPostComponentProps> = ({
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState<JobPostFormData>({
    role: "",
    workTime: "",
    workMode: "",
    jobLocation: "",
    minExperience: "",
    minSalary: "",
    maxSalary: "",
    requirements: [],
    responsibilities: [],
  });

  const [newRequirement, setNewRequirement] = useState<string>("");
  const [newResponsibility, setNewResponsibility] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  const locationInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      console.log("initialdata", initialData);
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchLocations = async () => {
      const query = formData.jobLocation.trim();

      if (query.length < 3) {
        setLocationSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingLocations(true);

      try {
        const response = await jobService.fetchLocationSuggestions(query);

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
  }, [formData.jobLocation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof JobPostFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    const parts = location.display_name.split(",");
    const cleanLocation = parts.slice(0, 2).join(",").trim();

    setFormData((prev) => ({
      ...prev,
      jobLocation: cleanLocation,
    }));
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const addRequirement = (): void => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addResponsibility = (): void => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }));
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const { valid, errors } = validateJobPost(formData);

    if (!valid) {
      setErrors(errors);
      return;
    }

    setErrors([]);
    onSubmit(formData);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {errors.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-400 text-red-300">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {isEditMode ? "Update" : "Post a New"}
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tech Position
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isEditMode
              ? "Update the job details and requirements"
              : "Find the perfect candidate for your tech role by providing detailed job requirements"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-700/30 to-slate-600/20 backdrop-blur-md rounded-3xl p-8 border border-slate-600/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Code className="w-4 h-4 mr-2 text-blue-400" />
                  Role *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="e.g. Senior Full Stack Developer"
                />
              </div>

              <div ref={locationInputRef} className="relative">
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                  Job Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.jobLocation}
                    onChange={(e) =>
                      handleInputChange("jobLocation", e.target.value)
                    }
                    onFocus={() => {
                      if (locationSuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    placeholder="e.g. Bangalore, Karnataka"
                    autoComplete="off"
                  />
                  {isLoadingLocations && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    </div>
                  )}
                </div>

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
                  formData.jobLocation.length >= 3 &&
                  locationSuggestions.length === 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 text-center text-gray-400 text-sm">
                      No locations found. Try a different search.
                    </div>
                  )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-400" />
                  Work Time *
                </label>
                <select
                  value={formData.workTime}
                  onChange={(e) =>
                    handleInputChange("workTime", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                >
                  <option value="">Select</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-cyan-400" />
                  Work Mode *
                </label>
                <select
                  value={formData.workMode}
                  onChange={(e) =>
                    handleInputChange("workMode", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                >
                  <option value="">Select</option>
                  <option value="remote">Remote</option>
                  <option value="on-site">On Site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Min Experience (years) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.minExperience}
                  onChange={(e) =>
                    handleInputChange("minExperience", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  placeholder="e.g. 3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
                Salary Range (LPA)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    min="0"
                    value={formData.minSalary}
                    onChange={(e) =>
                      handleInputChange("minSalary", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                    placeholder="Min salary"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxSalary}
                    onChange={(e) =>
                      handleInputChange("maxSalary", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                    placeholder="Max salary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Requirements
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Enter requirement"
                  onKeyPress={(e) => handleKeyPress(e, addRequirement)}
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {formData.requirements.length > 0 && (
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-600/30"
                    >
                      <span className="flex-1 text-sm">{req}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Responsibilities
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="Enter responsibility"
                  onKeyPress={(e) => handleKeyPress(e, addResponsibility)}
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {formData.responsibilities.length > 0 && (
                <div className="space-y-2">
                  {formData.responsibilities.map((resp, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-600/30"
                    >
                      <span className="flex-1 text-sm">{resp}</span>
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isEditMode ? "UPDATE JOB" : "POST JOB"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostComponent;

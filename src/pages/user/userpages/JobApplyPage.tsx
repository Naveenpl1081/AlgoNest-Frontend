import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import JobApplyComponent from "../../../component/user/JobApplyComponent";

import SingleJobDetailsComponent from "../../../component/user/SingleJobDetailsComponent";
import UserLayout from "../../../layouts/UserLayout";
import { applicationService } from "../../../service/ApplicationService";
import { jobService } from "../../../service/jobService";

const JobApplyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitApplication = async (applicationData: any) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("jobId", job._id || job.id);
      formData.append("name", applicationData.name);
      formData.append("email", applicationData.email);
      formData.append("contactNo", applicationData.contactNo);
      formData.append("location", applicationData.location);

      formData.append(
        "education",
        JSON.stringify({
          highestQualification: applicationData.highestQualification,
          qualificationName: applicationData.qualificationName,
          institutionName: applicationData.institutionName,
          yearOfGraduation: applicationData.yearOfGraduation,
          cgpa: applicationData.cgpa,
        })
      );

      const workExperience: any = {};
      if (applicationData.totalExperience) {
        workExperience.totalExperience = applicationData.totalExperience;
      }
      if (applicationData.previousJobTitles) {
        workExperience.previousJobTitles = applicationData.previousJobTitles;
      }
      if (applicationData.companyNames) {
        workExperience.companyNames = applicationData.companyNames;
      }
      if (Object.keys(workExperience).length > 0) {
        formData.append("workExperience", JSON.stringify(workExperience));
      }

      const links: any = {};
      if (applicationData.githubProfile) {
        links.githubProfile = applicationData.githubProfile;
      }
      if (applicationData.linkedinProfile) {
        links.linkedinProfile = applicationData.linkedinProfile;
      }
      if (applicationData.personalWebsite) {
        links.personalWebsite = applicationData.personalWebsite;
      }
      if (Object.keys(links).length > 0) {
        formData.append("links", JSON.stringify(links));
      }

      formData.append("aboutYourself", applicationData.aboutYourself);

      formData.append("skills", JSON.stringify(applicationData.skills));

      if (applicationData.resume) {
        formData.append("resume", applicationData.resume);
      }
      if (applicationData.plusTwoCertificate) {
        formData.append(
          "plusTwoCertificate",
          applicationData.plusTwoCertificate
        );
      }
      if (applicationData.degreeCertificate) {
        formData.append("degreeCertificate", applicationData.degreeCertificate);
      }
      if (applicationData.pgCertificate) {
        formData.append("pgCertificate", applicationData.pgCertificate);
      }

      console.log("Submitting FormData...");

      const response = await applicationService.postJobApplication(formData);

      if (response.success) {
        setIsSubmitting(false);
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/user/jobdetails", {
            state: { message: "Application submitted successfully!" },
          });
        }, 3000);
      } else {
        setIsSubmitting(false);
        toast.error(response.message)
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsSubmitting(false);
      alert("Failed to submit application. Please try again.");
    }
  };

  if (!job) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-600/50 p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Job Selected
              </h3>
              <p className="text-gray-500">Please select a job to apply</p>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <SingleJobDetailsComponent job={job} />

          {isSubmitting && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-slate-800 rounded-lg p-6 flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-white">Submitting your application...</p>
              </div>
            </div>
          )}

          {showSuccess && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700 shadow-2xl animate-scaleIn">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-checkmarkCircle">
                      <svg
                        className="w-12 h-12 text-white animate-checkmark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ripple"></div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-slate-300">
                    Your application has been successfully submitted.
                  </p>
                </div>

                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          <JobApplyComponent onSubmitApplication={handleSubmitApplication} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes checkmarkCircle {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes checkmark {
          0% { stroke-dasharray: 0, 100; }
          100% { stroke-dasharray: 100, 100; }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }

        .animate-checkmarkCircle {
          animation: checkmarkCircle 0.6s ease-out;
        }

        .animate-checkmark {
          animation: checkmark 0.6s ease-out 0.2s both;
        }

        .animate-ripple {
          animation: ripple 1.5s ease-out infinite;
        }
      `}</style>
    </UserLayout>
  );
};

export default JobApplyPage;

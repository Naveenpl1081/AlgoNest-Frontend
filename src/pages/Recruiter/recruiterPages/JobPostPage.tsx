import React, { useState } from "react";
import MessageModal from "../../../component/common/messageModal";
import JobPostComponent from "../../../component/recruiter/JobPostComponent";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import { useNavigate, useLocation } from "react-router-dom";
import {
  JobPost,
  JobPostFormData,
  SubmitStatus,
  ApiError,
  Job,
} from "../../../models/recruiter";
import { jobService } from "../../../service/jobService";

const JobPostPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const jobToEdit = location.state?.jobs as Job | undefined;

  const getInitialFormData = (): JobPostFormData | undefined => {
    if (!jobToEdit) return undefined;

    return {
      role: jobToEdit.jobrole || "",
      jobLocation: jobToEdit.jobLocation || "",
      workTime: jobToEdit.workTime || "",
      workMode: jobToEdit.workMode || "",
      minExperience: jobToEdit.minExperience || "",
      minSalary: jobToEdit.minSalary || "",
      maxSalary: jobToEdit.maxSalary || "",
      requirements: jobToEdit.requirements || [],
      responsibilities: jobToEdit.responsibilities || [],
    };
  };

  const transformFormDataToJobPost = (formData: JobPostFormData): JobPost => {
    return {
      jobrole: formData.role,
      jobLocation: formData.jobLocation,
      workTime: formData.workTime,
      workMode: formData.workMode,
      minExperience: formData.minExperience,
      minSalary: formData.minSalary,
      maxSalary: formData.maxSalary,
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
    };
  };

  const submitJobDetails = async (jobData: JobPostFormData): Promise<void> => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const jobPostData = transformFormDataToJobPost(jobData);
      console.log("Job Details to be sent:", jobPostData);

      let response;
      if (jobToEdit?._id) {
        response = await jobService.updateJobDetails(
          jobToEdit._id,
          jobPostData
        );
        setSubmitStatus({
          type: "success",
          message: "Job updated successfully!",
        });
      } else {
        response = await jobService.postJobDetails(jobPostData);
        setSubmitStatus({
          type: "success",
          message:
            "Job posted successfully! Candidates will be able to apply soon.",
        });
      }

      console.log("API Response:", response);

      setTimeout(() => {
        setSubmitStatus(null);
        navigate("/recruiter/viewallpost");
      }, 1000);
    } catch (error: unknown) {
      console.error("Error submitting job:", error);
      const apiError = error as ApiError;
      let errorMessage = jobToEdit
        ? "Failed to update job. Please try again."
        : "Failed to post job. Please try again.";

      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.response?.statusText) {
        errorMessage = `Error: ${apiError.response.statusText}`;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecruiterLayout>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl p-8 border border-slate-500">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="text-white text-lg font-semibold">
                {jobToEdit ? "Updating your job..." : "Posting your job..."}
              </span>
            </div>
          </div>
        </div>
      )}

      {submitStatus && (
        <MessageModal
          submitStatus={submitStatus}
          setSubmitStatus={setSubmitStatus}
        />
      )}

      <JobPostComponent
        onSubmit={submitJobDetails}
        initialData={getInitialFormData()}
        isEditMode={!!jobToEdit}
      />
    </RecruiterLayout>
  );
};

export default JobPostPage;

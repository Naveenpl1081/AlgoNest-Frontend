// pages/recruiter/RecruiterVerifyPage.tsx
import React from "react";
import RecruiterVerify from "../../../component/recruiter/RecruiterVerify";
import { recruiterAuthService } from "../../../service/RecruiterAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RecruiterVerifyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      const obj = Object.fromEntries(formData.entries());
      console.log("FormData as object:", obj);

      const response = await recruiterAuthService.approveRecruiter(formData);

      console.log("response from ",response.data)


      if (response.success) {
        toast.success(
          response.message || "Verification submitted. It will take 24 hours."
        );

        navigate("/recruiter/portal", {
          state: { isVerified: response.data.isVerified, status: response.data.status },
        });
      } else {
        toast.error(response.message || "Failed to submit verification");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("Error submitting verification. Please try again.");
    }
  };

  return <RecruiterVerify onSubmit={handleSubmit} />;
};

export default RecruiterVerifyPage;

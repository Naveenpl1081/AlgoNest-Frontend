import React, { useState } from "react";
import ProblemAddingComponent from "../../../component/admin/ProblemAddingCom";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import { IProblem } from "../../../types/component.types";
import { problemService } from "../../../service/problemService";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  validateProblem,
  cleanProblemData,
} from "../../../utils/validations/ProblemAddingValidation";

const ProblemAddingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editProblem: IProblem | undefined = location.state?.problem;
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [problemData, setProblemData] = useState<IProblem>(() => {
    if (editProblem) {
      const migratedProblem = {
        ...editProblem,
        testCases: editProblem.testCases.map((tc) => ({
          ...tc,
          input: Array.isArray(tc.input) ? tc.input : [tc.input],
        })),
      };
      return migratedProblem;
    }
    return {
      _id: "",
      problemId: "",
      title: "",
      description: "",
      difficulty: "Easy",
      tags: [],
      constraints: [],
      examples: [{ input: "", output: "", explanation: "" }],
      testCases: [{ input: [""], output: "" }],
      functionName: "",
      parameters: [{ name: "", type: "" }],
      returnType: "",
      category: {
        _id: "",
        name: "",
      },
      solution: "",
      status: "Active",
      timeLimit: "",
      memoryLimit: "",
      starterCode: {
        javascript: "",
        python: "",
        java: "",
        cpp: "",
      },
      hints: [],
      createdBy: "",
      isPremium: false,
      visible: true,
      createdAt: "",
      updatedAt: "",
    };
  });

  const handleChange = (field: keyof IProblem, value: any) => {
    setProblemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const validation = validateProblem(problemData);

      // if (!validation.isValid) {

      //   validation.errors.forEach(error => toast.error(error));
      //   return;
      // }
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }
      setFormErrors([]); // clear errors if valid

      const cleanedData = cleanProblemData(problemData, !!editProblem);

      let response;
      if (editProblem && editProblem._id) {
        response = await problemService.updateProblem(
          editProblem._id,
          cleanedData as IProblem
        );
      } else {
        response = await problemService.addProblems(cleanedData as IProblem);
      }

      if (response.success) {
        toast.success(response.message || "Problem saved successfully!");
        navigate("/admin/problems");
      } else {
        toast.error(response.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred!");
    }
  };

  return (
    <AdminLayout>
      {formErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          <ul className="list-disc ml-5">
            {formErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">
          {editProblem ? "Edit Problem" : "Add New Problem"}
        </h1>
        <ProblemAddingComponent
          problemData={problemData}
          onChange={handleChange}
        />
        <div className="mt-4">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            {editProblem ? "Update Problem" : "Submit Problem"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProblemAddingPage;

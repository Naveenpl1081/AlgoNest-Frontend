import React, { useState } from "react";
import ProblemAddingComponent from "../../../component/admin/ProblemAddingCom";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import { IProblem } from "../../../types/component.types";
import { problemService } from "../../../service/problemService";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";


const ProblemAddingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editProblem: IProblem | undefined = location.state?.problem;
  console.log("edit", editProblem);

  const [problemData, setProblemData] = useState<IProblem>(() => {
    if (editProblem) {
      return editProblem;
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
      testCases: [{ input: "", output: "" }],
      functionName: "",
      parameters: [{ name: "", type: "" }],
      returnType: "",
      category: {
        _id: "",
        name: ""
      },
      solution: "",
      status:"Active",
      timeLimit:"",
      memoryLimit:"",
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

  // Validation function
  const validateProblemData = (data: IProblem): string | null => {
    if (!data.title.trim()) return "Title is required";
    if (!data.problemId.trim()) return "Problem ID is required";
    if (!data.description.trim()) return "Description is required";
    if (!data.functionName.trim()) return "Function name is required";
    
    // Check if at least one example is complete
    const validExamples = data.examples.filter(ex => 
      ex.input.trim() && ex.output.trim()
    );
    if (validExamples.length === 0) {
      return "At least one complete example is required";
    }
    
    // Check if at least one test case is complete
    const validTestCases = data.testCases.filter(tc => 
      tc.input.trim() && tc.output.trim()
    );
    if (validTestCases.length === 0) {
      return "At least one complete test case is required";
    }
    
    // Check if at least one parameter is complete (if any parameters exist)
    if (data.parameters.length > 0) {
      const validParameters = data.parameters.filter(param => 
        param.name.trim() && param.type.trim()
      );
      if (validParameters.length === 0) {
        return "Complete parameter information is required";
      }
    }
    
    return null;
  };

  // Clean data function
  const cleanProblemData = (data: IProblem): Partial<IProblem> => {
    const cleanedData: Partial<IProblem> = {
      ...data,
      // Remove _id for new problems or keep it for updates
      ...(editProblem ? { _id: data._id } : {}),
      // Filter out empty examples
      examples: data.examples.filter(ex => 
        ex.input.trim() && ex.output.trim()
      ),
      // Filter out empty test cases
      testCases: data.testCases.filter(tc => 
        tc.input.trim() && tc.output.trim()
      ),
      // Filter out empty parameters
      parameters: data.parameters.filter(param => 
        param.name.trim() && param.type.trim()
      ),
      // Filter out empty tags
      tags: data.tags.filter(tag => tag.trim()),
      // Filter out empty constraints
      constraints: data.constraints.filter(constraint => constraint.trim()),
      // Filter out empty hints
      hints: data.hints.filter(hint => hint.trim()),
    };

    // Remove _id if it's empty string (for new problems)
    if (!editProblem || !cleanedData._id || cleanedData._id === "") {
      delete cleanedData._id;
    }

    return cleanedData;
  };

  const handleSubmit = async () => {
    try {
      // Validate the problem data
      const validationError = validateProblemData(problemData);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      // Clean the data
      const cleanedData = cleanProblemData(problemData);
      
      let response;
      if (editProblem && editProblem._id) {
        response = await problemService.updateProblem(editProblem._id, cleanedData as IProblem);
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
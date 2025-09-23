import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { IProblem } from "../../types/component.types";
import { Example } from "../../types/component.types";
import { TestCase } from "../../types/component.types";
import { Parameter } from "../../types/component.types";
import { categoryService } from "../../service/categoryService";
import { DropdownFilter } from "../common/DropDownFilter";

interface ProblemAddingComponentProps {
  problemData: IProblem;
  onChange: (field: keyof IProblem, value: any) => void;
}

const ProblemAddingComponent: React.FC<ProblemAddingComponentProps> = ({
  problemData,
  onChange,
}) => {
  const [newTag, setNewTag] = useState("");
  const [newConstraint, setNewConstraint] = useState("");
  const [newHint, setNewHint] = useState("");
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  const handleArrayAdd = (
    field: "tags" | "constraints" | "hints",
    value: string
  ) => {
    if (value.trim()) {
      const currentArray = problemData[field] as string[];
      onChange(field, [...currentArray, value.trim()]);

      if (field === "tags") setNewTag("");
      if (field === "constraints") setNewConstraint("");
      if (field === "hints") setNewHint("");
    }
  };

  const handleArrayRemove = (
    field: "tags" | "constraints" | "hints",
    index: number
  ) => {
    const currentArray = problemData[field] as string[];
    onChange(
      field,
      currentArray.filter((_, i) => i !== index)
    );
  };

  const addExample = () => {
    onChange("examples", [
      ...problemData.examples,
      { input: "", output: "", explanation: "" },
    ]);
  };

  const removeExample = (index: number) => {
    if (problemData.examples.length > 1) {
      onChange(
        "examples",
        problemData.examples.filter((_, i) => i !== index)
      );
    }
  };

  const addTestCase = () => {
    // Initialize test case inputs based on current parameters
    const initialInputs = problemData.parameters.map(() => "");
    onChange("testCases", [
      ...problemData.testCases,
      { input: initialInputs, output: "" },
    ]);
  };

  const removeTestCase = (index: number) => {
    if (problemData.testCases.length > 1) {
      onChange(
        "testCases",
        problemData.testCases.filter((_, i) => i !== index)
      );
    }
  };

  const addParameter = () => {
    const newParam = { name: "", type: "" };
    const updatedParams = [...problemData.parameters, newParam];
    onChange("parameters", updatedParams);

    // Update existing test cases to include new parameter input
    const updatedTestCases = problemData.testCases.map(testCase => ({
      ...testCase,
      input: [...testCase.input, ""]
    }));
    onChange("testCases", updatedTestCases);
  };

  const removeParameter = (index: number) => {
    if (problemData.parameters.length > 1) {
      const updatedParams = problemData.parameters.filter((_, i) => i !== index);
      onChange("parameters", updatedParams);

      // Update existing test cases to remove the parameter input at the same index
      const updatedTestCases = problemData.testCases.map(testCase => ({
        ...testCase,
        input: testCase.input.filter((_, i) => i !== index)
      }));
      onChange("testCases", updatedTestCases);
    }
  };

  const updateExample = (
    index: number,
    field: keyof Example,
    value: string
  ) => {
    const updatedExamples = problemData.examples.map((example, i) =>
      i === index ? { ...example, [field]: value } : example
    );
    onChange("examples", updatedExamples);
  };

  const updateTestCase = (
    index: number,
    field: keyof TestCase,
    value: string | string[]
  ) => {
    const updatedTestCases = problemData.testCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    onChange("testCases", updatedTestCases);
  };

  const updateTestCaseInput = (
    testCaseIndex: number,
    parameterIndex: number,
    value: string
  ) => {
    const updatedTestCases = problemData.testCases.map((testCase, i) => {
      if (i === testCaseIndex) {
        const updatedInputs = [...testCase.input];
        updatedInputs[parameterIndex] = value;
        return { ...testCase, input: updatedInputs };
      }
      return testCase;
    });
    onChange("testCases", updatedTestCases);
  };

  const updateParameter = (
    index: number,
    field: keyof Parameter,
    value: string
  ) => {
    const updatedParameters = problemData.parameters.map((param, i) =>
      i === index ? { ...param, [field]: value } : param
    );
    onChange("parameters", updatedParameters);
  };

  const updateStarterCode = (language: string, code: string) => {
    onChange("starterCode", {
      ...problemData.starterCode,
      [language]: code,
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAllCategory();
      const options = data.map((cat: any) => ({
        value: cat._id,
        label: cat.name,
      }));
      setCategories(options);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Problem Title *
            </label>
            <input
              type="text"
              value={problemData.title}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="e.g., Two Sum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">TimeLimit</label>
            <input
              type="text"
              value={problemData.timeLimit}
              onChange={(e) => onChange("timeLimit", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="e.g., 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">MemoryLimit</label>
            <input
              type="text"
              value={problemData.memoryLimit}
              onChange={(e) => onChange("memoryLimit", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="e.g., 128"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Problem ID *
            </label>
            <input
              type="text"
              value={problemData.problemId}
              onChange={(e) => onChange("problemId", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="e.g., two-sum"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            Problem Description *
          </label>
          <textarea
            value={problemData.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none h-32 resize-none"
            placeholder="Write a detailed problem description here..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={problemData.difficulty}
              onChange={(e) => onChange("difficulty", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={problemData.isPremium}
                onChange={(e) => onChange("isPremium", e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Premium</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={problemData.visible}
                onChange={(e) => onChange("visible", e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Visible</span>
            </label>
          </div>
        </div>
      </section>

      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Category</h2>
        <DropdownFilter
          label="Select Category"
          options={categories}
          value={problemData.category._id || ""}
          onChange={(value) => {
            const selectedCategory = categories.find(
              (cat) => cat.value === value
            );
            onChange(
              "category",
              selectedCategory
                ? { _id: selectedCategory.value, name: selectedCategory.label }
                : { _id: "", name: "" }
            );
          }}
        />
      </section>

      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          Function Definition
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Function Name *
            </label>
            <input
              type="text"
              value={problemData.functionName}
              onChange={(e) => onChange("functionName", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="e.g., twoSum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Return Type
            </label>
            <select
              value={problemData.returnType}
              onChange={(e) => onChange("returnType", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
            >
              <option value="number">number</option>
              <option value="string">string</option>
              <option value="boolean">boolean</option>
              <option value="number[]">number[]</option>
              <option value="string[]">string[]</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Parameters</label>
            <button
              onClick={addParameter}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              <Plus size={16} />
              Add Parameter
            </button>
          </div>
          {problemData.parameters.map((param, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={param.name}
                onChange={(e) => updateParameter(index, "name", e.target.value)}
                className="flex-1 p-2 rounded bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
                placeholder="Parameter name"
              />
              <select
                value={param.type}
                onChange={(e) => updateParameter(index, "type", e.target.value)}
                className="w-32 p-2 rounded bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
              >
                <option value="">Type</option>
                <option value="number">number</option>
                <option value="string">string</option>
                <option value="number[]">number[]</option>
                <option value="string[]">string[]</option>
              </select>
              <button
                onClick={() => removeParameter(index)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Tags</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 p-2 rounded bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
            placeholder="Add tag (e.g., Array, Hash Table)"
            onKeyPress={(e) =>
              e.key === "Enter" && handleArrayAdd("tags", newTag)
            }
          />
          <button
            onClick={() => handleArrayAdd("tags", newTag)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {problemData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => handleArrayRemove("tags", index)}
                className="ml-1 hover:text-red-300"
              >
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
      </section>

      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          Constraints
        </h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newConstraint}
            onChange={(e) => setNewConstraint(e.target.value)}
            className="flex-1 p-2 rounded bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
            placeholder="Add constraint (e.g., 2 ≤ nums.length ≤ 10^4)"
            onKeyPress={(e) =>
              e.key === "Enter" && handleArrayAdd("constraints", newConstraint)
            }
          />
          <button
            onClick={() => handleArrayAdd("constraints", newConstraint)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {problemData.constraints.map((constraint, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-slate-600 rounded"
            >
              <span className="flex-1 text-sm font-mono">{constraint}</span>
              <button
                onClick={() => handleArrayRemove("constraints", index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-400">Examples</h2>
          <button
            onClick={addExample}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            <Plus size={16} />
            Add Example
          </button>
        </div>
        {problemData.examples.map((example, index) => (
          <div key={index} className="mb-6 p-4 bg-slate-600 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Example {index + 1}</h3>
              <button
                onClick={() => removeExample(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Input</label>
                <textarea
                  value={example.input}
                  onChange={(e) =>
                    updateExample(index, "input", e.target.value)
                  }
                  className="w-full p-2 rounded bg-slate-700 border border-slate-500 focus:border-blue-400 focus:outline-none font-mono text-sm"
                  rows={3}
                  placeholder="nums = [2,7,11,15], target = 9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Output</label>
                <textarea
                  value={example.output}
                  onChange={(e) =>
                    updateExample(index, "output", e.target.value)
                  }
                  className="w-full p-2 rounded bg-slate-700 border border-slate-500 focus:border-blue-400 focus:outline-none font-mono text-sm"
                  rows={3}
                  placeholder="[0,1]"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Explanation
              </label>
              <textarea
                value={example.explanation}
                onChange={(e) =>
                  updateExample(index, "explanation", e.target.value)
                }
                className="w-full p-2 rounded bg-slate-700 border border-slate-500 focus:border-blue-400 focus:outline-none text-sm"
                rows={2}
                placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
              />
            </div>
          </div>
        ))}
      </section>

      <section className="bg-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-400">Test Cases</h2>
          <button
            onClick={addTestCase}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            <Plus size={16} />
            Add Test Case
          </button>
        </div>
        {problemData.testCases.map((testCase, testCaseIndex) => (
          <div key={testCaseIndex} className="mb-4 p-4 bg-slate-600 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Test Case {testCaseIndex + 1}</h3>
              <button
                onClick={() => removeTestCase(testCaseIndex)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2">Inputs</label>
                {problemData.parameters.length > 0 ? (
                  <div className="space-y-2">
                    {problemData.parameters.map((param, paramIndex) => (
                      <div key={paramIndex}>
                        <label className="block text-xs text-gray-400 mb-1">
                          {param.name} ({param.type})
                        </label>
                        <input
                          type="text"
                          value={testCase.input[paramIndex] || ""}
                          onChange={(e) =>
                            updateTestCaseInput(testCaseIndex, paramIndex, e.target.value)
                          }
                          className="w-full p-2 rounded bg-slate-700 border border-slate-500 focus:border-blue-400 focus:outline-none font-mono text-xs"
                          placeholder={`Enter value for ${param.name}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">
                    Add parameters first to create test case inputs
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1">
                  Expected Output
                </label>
                <textarea
                  value={testCase.output}
                  onChange={(e) =>
                    updateTestCase(testCaseIndex, "output", e.target.value)
                  }
                  className="w-full p-2 rounded bg-slate-700 border border-slate-500 focus:border-blue-400 focus:outline-none font-mono text-xs"
                  rows={2}
                  placeholder="Expected output"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Solution */}
      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Solution</h2>
        <textarea
          value={problemData.solution}
          onChange={(e) => onChange("solution", e.target.value)}
          className="w-full p-4 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none font-mono text-sm h-48 resize-none"
          placeholder="Write the optimal solution here..."
        />
      </section>

      {/* Starter Code */}
      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          Starter Code
        </h2>
        <div className="space-y-4">
          {Object.entries(problemData.starterCode).map(([language, code]) => (
            <div key={language}>
              <label className="block text-sm font-medium mb-2 capitalize">
                {language}
              </label>
              <textarea
                value={code}
                onChange={(e) => updateStarterCode(language, e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none font-mono text-sm h-24 resize-none"
                placeholder={`Write starter code for ${language}...`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Hints */}
      <section className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Hints</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            className="flex-1 p-2 rounded bg-slate-600 border border-slate-500 focus:border-blue-400 focus:outline-none"
            placeholder="Add a hint for the problem"
            onKeyPress={(e) =>
              e.key === "Enter" && handleArrayAdd("hints", newHint)
            }
          />
          <button
            onClick={() => handleArrayAdd("hints", newHint)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {problemData.hints.map((hint, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-slate-600 rounded"
            >
              <span className="text-sm text-gray-400 mt-1">#{index + 1}</span>
              <span className="flex-1 text-sm">{hint}</span>
              <button
                onClick={() => handleArrayRemove("hints", index)}
                className="text-red-400 hover:text-red-300 mt-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProblemAddingComponent;
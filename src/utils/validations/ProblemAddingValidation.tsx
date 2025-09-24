import { IProblem } from "../../types/component.types";


export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateProblem = (data: IProblem): ValidationResult => {
  const errors: string[] = [];


  if (!data.title?.trim()) {
    errors.push("Title is required");
  }

  if (!data.problemId?.trim()) {
    errors.push("Problem ID is required");
  }

  if (!data.description?.trim()) {
    errors.push("Description is required");
  }

  if (!data.functionName?.trim()) {
    errors.push("Function name is required");
  }

  if (!data.timeLimit?.trim()) {
    errors.push("Time limit is required");
  }

  if (!data.memoryLimit?.trim()) {
    errors.push("Memory limit is required");
  }


  if (!data.category?._id?.trim()) {
    errors.push("Category is required");
  }


  const validParameters = data.parameters?.filter(param => 
    param.name?.trim() && param.type?.trim()
  ) || [];

  if (data.parameters?.length > 0 && validParameters.length === 0) {
    errors.push("Complete parameter information is required");
  }

  
  const validExamples = data.examples?.filter(ex => 
    ex.input?.trim() && ex.output?.trim()
  ) || [];

  if (validExamples.length === 0) {
    errors.push("At least one complete example is required");
  }

 
  const validTestCases = data.testCases?.filter(tc => {
    const allInputsFilled = tc.input?.every(input => input?.trim()) || false;
    const outputFilled = tc.output?.trim() || false;
    return allInputsFilled && outputFilled;
  }) || [];

  if (validTestCases.length === 0) {
    errors.push("At least one complete test case is required");
  }


  const mismatchedTestCases = data.testCases?.filter(
    tc => tc.input?.length !== validParameters.length
  ) || [];

  if (mismatchedTestCases.length > 0) {
    errors.push("Test case input count must match the number of parameters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};


export const cleanProblemData = (data: IProblem, isEdit: boolean = false): Partial<IProblem> => {
  const cleanedData: Partial<IProblem> = {
    ...data,
    
    ...(isEdit && data._id ? { _id: data._id } : {}),
    
   
    examples: data.examples?.filter(ex => 
      ex.input?.trim() && ex.output?.trim()
    ) || [],
    
    testCases: data.testCases?.filter(tc => {
      const allInputsFilled = tc.input?.every(input => input?.trim()) || false;
      const outputFilled = tc.output?.trim() || false;
      return allInputsFilled && outputFilled;
    }) || [],

    parameters: data.parameters?.filter(param => 
      param.name?.trim() && param.type?.trim()
    ) || [],

    tags: data.tags?.filter(tag => tag?.trim()) || [],
    constraints: data.constraints?.filter(constraint => constraint?.trim()) || [],
    hints: data.hints?.filter(hint => hint?.trim()) || [],
  };

  
  if (!isEdit || !cleanedData._id) {
    delete cleanedData._id;
  }

  return cleanedData;
};
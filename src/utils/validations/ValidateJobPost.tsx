import { JobPostFormData } from "../../models/recruiter";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateJobPost = (formData: JobPostFormData): ValidationResult => {
  const errors: string[] = [];


  if (!formData.role || !formData.role.trim()) {
    errors.push("Role is required.");
  } else if (formData.role.trim().length < 3) {
    errors.push("Role must be at least 3 characters long.");
  } else if (formData.role.trim().length > 100) {
    errors.push("Role must not exceed 100 characters.");
  }

  
  if (!formData.jobLocation || !formData.jobLocation.trim()) {
    errors.push("Job location is required.");
  } else if (formData.jobLocation.trim().length < 2) {
    errors.push("Job location must be at least 2 characters long.");
  } else if (formData.jobLocation.trim().length > 100) {
    errors.push("Job location must not exceed 100 characters.");
  }


  const validWorkTimes = ["full-time", "part-time", "contract", "internship"];
  if (!formData.workTime || !formData.workTime.trim()) {
    errors.push("Work time is required.");
  } else if (!validWorkTimes.includes(formData.workTime.toLowerCase())) {
    errors.push("Please select a valid work time option.");
  }


  const validWorkModes = ["remote", "on-site", "hybrid"];
  if (!formData.workMode || !formData.workMode.trim()) {
    errors.push("Work mode is required.");
  } else if (!validWorkModes.includes(formData.workMode.toLowerCase())) {
    errors.push("Please select a valid work mode option.");
  }


  if (!formData.minExperience) {
    errors.push("Minimum experience is required.");
  } else {
    const minExp = Number(formData.minExperience);
    if (isNaN(minExp)) {
      errors.push("Minimum experience must be a valid number.");
    } else if (minExp < 0) {
      errors.push("Minimum experience cannot be negative.");
    } else if (minExp > 50) {
      errors.push("Minimum experience seems unrealistic (max 50 years).");
    } else if (!Number.isInteger(minExp)) {
      errors.push("Minimum experience must be a whole number.");
    }
  }

  
  const hasMinSalary = formData.minSalary ;
  const hasMaxSalary = formData.maxSalary ;

  if (hasMinSalary || hasMaxSalary) {
    if (hasMinSalary && !hasMaxSalary) {
      errors.push("Maximum salary is required when minimum salary is provided.");
    } else if (!hasMinSalary && hasMaxSalary) {
      errors.push("Minimum salary is required when maximum salary is provided.");
    } else if (hasMinSalary && hasMaxSalary) {
      const minSal = parseFloat(formData.minSalary);
      const maxSal = parseFloat(formData.maxSalary);

      if (isNaN(minSal)) {
        errors.push("Minimum salary must be a valid number.");
      } else if (minSal < 0) {
        errors.push("Minimum salary cannot be negative.");
      } else if (minSal > 1000) {
        errors.push("Minimum salary seems unrealistic (max 1000 LPA).");
      }

      if (isNaN(maxSal)) {
        errors.push("Maximum salary must be a valid number.");
      } else if (maxSal < 0) {
        errors.push("Maximum salary cannot be negative.");
      } else if (maxSal > 1000) {
        errors.push("Maximum salary seems unrealistic (max 1000 LPA).");
      }

      if (!isNaN(minSal) && !isNaN(maxSal)) {
        if (minSal > maxSal) {
          errors.push("Minimum salary cannot be greater than maximum salary.");
        } else if (minSal === maxSal) {
          errors.push("Minimum and maximum salary cannot be the same.");
        } else if (maxSal - minSal < 0.5) {
          errors.push("Salary range should be at least 0.5 LPA.");
        }
      }
    }
  }


  if (formData.requirements && formData.requirements.length > 0) {
    formData.requirements.forEach((req, index) => {
      if (!req || !req.trim()) {
        errors.push(`Requirement ${index + 1} is empty. Please remove empty entries.`);
      } else if (req.trim().length < 5) {
        errors.push(`Requirement ${index + 1} is too short (minimum 5 characters).`);
      } else if (req.trim().length > 500) {
        errors.push(`Requirement ${index + 1} is too long (maximum 500 characters).`);
      }
    });

    
    const uniqueReqs = new Set(formData.requirements.map(r => r.trim().toLowerCase()));
    if (uniqueReqs.size < formData.requirements.length) {
      errors.push("Duplicate requirements found. Please remove duplicates.");
    }

    if (formData.requirements.length > 20) {
      errors.push("Maximum 20 requirements allowed.");
    }
  }

 
  if (formData.responsibilities && formData.responsibilities.length > 0) {
    formData.responsibilities.forEach((resp, index) => {
      if (!resp || !resp.trim()) {
        errors.push(`Responsibility ${index + 1} is empty. Please remove empty entries.`);
      } else if (resp.trim().length < 5) {
        errors.push(`Responsibility ${index + 1} is too short (minimum 5 characters).`);
      } else if (resp.trim().length > 500) {
        errors.push(`Responsibility ${index + 1} is too long (maximum 500 characters).`);
      }
    });

   
    const uniqueResps = new Set(formData.responsibilities.map(r => r.trim().toLowerCase()));
    if (uniqueResps.size < formData.responsibilities.length) {
      errors.push("Duplicate responsibilities found. Please remove duplicates.");
    }

    if (formData.responsibilities.length > 20) {
      errors.push("Maximum 20 responsibilities allowed.");
    }
  }

  
  if ((!formData.requirements || formData.requirements.length === 0) &&
      (!formData.responsibilities || formData.responsibilities.length === 0)) {
    errors.push("Please add at least one requirement or responsibility to make the job post more informative.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
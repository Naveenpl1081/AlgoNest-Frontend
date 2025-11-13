import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import InputField from "../common/InputField";

import { ISubscriptionPlan } from "../../models/admin";
import { subscriptionValidationSchema } from "../../utils/validations/SubscriptionValidationSchema";

interface AddSubscriptionPlanProps {
  onCancel: () => void;
  onSubmit: (subscriptionId:string,data: any) => Promise<void>;
  isLoading?: boolean;
  initialValues?: Partial<ISubscriptionPlan>;
  isEditing?: boolean;
}

export const AddSubscriptionPlan: React.FC<AddSubscriptionPlanProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  initialValues,
  isEditing = false,
}) => {
  const formik = useFormik({
    initialValues: {
      _id:initialValues?._id,
      planName: initialValues?.planName ?? "",
      price:
        initialValues?.price !== undefined
          ? initialValues.price.toString()
          : "",
      durationInMonths:
        initialValues?.durationInMonths !== undefined
          ? initialValues.durationInMonths.toString()
          : "",
      description: initialValues?.description ?? "",
    },
    validationSchema: subscriptionValidationSchema,
    onSubmit: (values) => {
      const payload = {
        planName: values.planName.toUpperCase(),
        price: Number(values.price),
        durationInMonths: Number(values.durationInMonths),
        description: values.description.trim(),
        ...(isEditing && initialValues?._id ? { _id: initialValues._id } : {}),
      };
      onSubmit(initialValues?._id ?? "", payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="px-2 w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <InputField
          label="Plan Name"
          name="planName"
          type="text"
          value={formik.values.planName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter plan name (e.g., BASIC, PREMIUM)..."
          error={formik.errors.planName}
          touched={formik.touched.planName}
        
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Price (₹)"
          name="price"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter the price..."
          error={formik.errors.price}
          touched={formik.touched.price}
  
        />

        <InputField
          label="Duration (Months)"
          name="durationInMonths"
          type="number"
          value={formik.values.durationInMonths}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter duration in months..."
          error={formik.errors.durationInMonths}
          touched={formik.touched.durationInMonths}
      
        />
      </div>

      <div className="mb-6">
        <InputField
          label="Description"
          name="description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter plan description..."
          error={formik.errors.description}
          touched={formik.touched.description}
    
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
          className="py-2 px-4 w-24"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="py-2 px-4 w-24"
        >
          {isEditing ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

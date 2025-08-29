import React, { useState } from "react";

interface RecruiterVerifyProps {
  onSubmit: (formData: FormData) => void;
}

const RecruiterVerify: React.FC<RecruiterVerifyProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    companyName: "",
    companyType: "",
    yearEstablished: "",
    phone: "",
    website: "",
    hrName: "",
    hrDesignation: "",
    document: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, document: e.target.files![0] }));
      if (errors["document"]) {
        setErrors((prev) => ({ ...prev, document: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const requiredFields = [
      "companyName",
      "companyType",
      "yearEstablished",
      "phone",
      "website",
      "hrName",
      "hrDesignation",
    ];

    requiredFields.forEach((field) => {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = "This field is required";
      }
    });

    if (!form.document) {
      newErrors["document"] = "Please upload a document/photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        const value = form[key as keyof typeof form];
        if (value) {
          formData.append(key, value);
        }
      });

      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h1 className="text-2xl font-bold text-center">
              Company Verification
            </h1>
            <p className="text-blue-100 text-center mt-2">
              Submit your basic company details for admin verification
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <input
                name="companyName"
                placeholder="Company Name *"
                value={form.companyName}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-slate-700 border ${
                  errors.companyName ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
              />
              <select
                name="companyType"
                value={form.companyType}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-slate-700 border ${
                  errors.companyType ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
              >
                <option value="">Company Type *</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
                <option value="LLP">LLP</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Startup">Startup</option>
              </select>
              <input
                name="yearEstablished"
                type="number"
                placeholder="Year Established *"
                value={form.yearEstablished}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-slate-700 border ${
                  errors.yearEstablished ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-slate-700 border ${
                  errors.phoneNumber ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
              />
              <input
                name="website"
                type="url"
                placeholder="Company Website *"
                value={form.website}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-slate-700 border ${
                  errors.website ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
              />
              <input
                name="hrName"
                placeholder="HR Representative Name *"
                value={form.hrName}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-slate-700 border ${
                  errors.hrName ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
              />
              <input
                name="hrDesignation"
                placeholder="HR Designation *"
                value={form.hrDesignation}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-slate-700 border ${
                  errors.hrDesignation ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Company Documents*
                </label>
                <input
                  type="file"
                  name="document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className={`w-full p-3 rounded-lg bg-slate-700 border ${
                    errors.document ? "border-red-500" : "border-slate-600"
                  } focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer`}
                />
                {errors.document && (
                  <p className="text-red-400 text-sm mt-1">{errors.document}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition duration-200 ${
                loading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterVerify;

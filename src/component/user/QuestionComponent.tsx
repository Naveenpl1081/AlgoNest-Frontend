import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { HelpCircle, Tag, AlertCircle, CheckCircle2 } from "lucide-react";

interface FormData {
  title: string;
  description: string;
  tags: string[];
  isDuplicate: boolean;
}

interface Errors {
  title?: string;
  description?: string;
  tags?: string;
  isDuplicate?: string;
}

interface QuestionComponentProps {
  handleSubmit: (formData: FormData) => Promise<void>;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  handleSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    tags: [],
    isDuplicate: false,
  });

  const [tagInput, setTagInput] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const suggestedTags: string[] = [
    "javascript",
    "react",
    "python",
    "algorithms",
    "data-structures",
    "debugging",
    "performance",
    "typescript",
    "nodejs",
    "css",
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value.toLowerCase());
  };

  const addTag = (tag: string) => {
    if (formData.tags.length < 5 && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
      if (errors.tags) {
        setErrors((prev) => ({ ...prev, tags: "" }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const filteredSuggestions = suggestedTags.filter(
    (tag) => tag.includes(tagInput) && !formData.tags.includes(tag)
  );

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title should be at least 10 characters";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title should not be more than 200 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Add at least one tag";
    }

    if (!formData.isDuplicate) {
      newErrors.isDuplicate = "Please confirm this is not a duplicate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await handleSubmit(formData);
      setFormData({
        title: "",
        description: "",
        tags: [],
        isDuplicate: false,
      });
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-4 border border-blue-500/30">
            <HelpCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Got a Question? Throw it to the Crowd!
          </h1>
          <p className="text-gray-400 text-lg">
            Share your challenge with the community and get expert help
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            How to Ask a Good Question
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Write a Clear Title",
                desc: "Summarize your problem in one line.",
              },
              {
                title: "Explain the Issue",
                desc: "Provide enough detail for others to understand.",
              },
              {
                title: "Share What You Tried",
                desc: "Mention attempted solutions and expected results.",
              },
              {
                title: "Add Relevant Tags",
                desc: "Use keywords to reach the right audience.",
              },
              {
                title: "Review and Post",
                desc: "Check for clarity, then submit your question.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-gray-200 font-medium group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Title
              <span className="text-red-400 ml-1">*</span>
            </label>
            <p className="text-gray-400 text-sm mb-3">
              Be specific and imagine you're asking a question to another
              person.
            </p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., How do I implement a binary search tree in JavaScript?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Description
              <span className="text-red-400 ml-1">*</span>
            </label>
            <p className="text-gray-400 text-sm mb-3">
              Elaborate your question clearly in minimum 20 characters
            </p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your problem in detail. Include what you've tried, error messages, and expected behavior..."
              rows={8}
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              {errors.description && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <p
                className={`text-sm ml-auto ${
                  formData.description.length >= 20
                    ? "text-green-400"
                    : "text-gray-500"
                }`}
              >
                {formData.description.length} characters
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Tags
              <span className="text-red-400 ml-1">*</span>
            </label>
            <p className="text-gray-400 text-sm mb-3">
              Add up to 5 tags to describe what your question is about. Start
              typing to see suggestions.
            </p>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type to search or add tags..."
                disabled={formData.tags.length >= 5}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {tagInput && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4 text-blue-400" />
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {errors.tags && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.tags}
              </p>
            )}
          </div>

          <div className="mb-8">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <p className="text-orange-300 text-sm mb-3">
                <strong>Before you post:</strong> Carefully duplicate of
                questions make sure you're avoiding it. Refer by someone. You
                can check it by searching for your question in the community.
              </p>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.isDuplicate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDuplicate: e.target.checked,
                    }))
                  }
                  className="mt-1 w-5 h-5 rounded border-2 border-slate-600 bg-slate-900 checked:bg-gradient-to-br checked:from-blue-500 checked:to-purple-500 checked:border-transparent focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                  I am sure this question is not a duplicated question.
                </span>
              </label>
              {errors.isDuplicate && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.isDuplicate}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/25"
          >
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default QuestionComponent;

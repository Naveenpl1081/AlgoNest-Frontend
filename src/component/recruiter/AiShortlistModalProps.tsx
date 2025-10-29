import React from "react";

interface JobTitle {
  jobrole: string;
  jobId: string;
}

interface AiShortlistModalProps {
  isOpen: boolean;
  jobTitles: JobTitle[];
  aiJobTitle: string;
  selectedJobId: string;
  threshold: string;
  isProcessing: boolean;
  onJobTitleChange: (jobTitle: string, jobId: string) => void;
  onThresholdChange: (threshold: string) => void;
  onApply: () => void;
  onClose: () => void;
}

const AiShortlistModal: React.FC<AiShortlistModalProps> = ({
  isOpen,
  jobTitles,
  aiJobTitle,
  selectedJobId,
  threshold,
  isProcessing,
  onJobTitleChange,
  onThresholdChange,
  onApply,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedJob = jobTitles.find((job) => job.jobrole === selectedValue);

    if (selectedJob) {
      onJobTitleChange(selectedValue, selectedJob.jobId);
    } else {
      onJobTitleChange("", "");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-950/95 via-slate-900/95 to-purple-950/95 backdrop-blur-sm z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-purple-500/20">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 relative border-b border-purple-500/20">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Shortlist</h2>
              <p className="text-purple-100 text-sm mt-1">
                Intelligent candidate selection
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-14 space-y-8">
              <style>{`
                @keyframes orbit {
                  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
                  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                }
                @keyframes shimmer {
                  0% { background-position: -100% 0; }
                  100% { background-position: 200% 0; }
                }
                @keyframes fadeInScale {
                  0% { opacity: 0; transform: scale(0.8); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes scan-vertical {
                  0%, 100% { top: 10%; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 90%; opacity: 0; }
                }
                @keyframes particle-float {
                  0% { transform: translate(0, 0); opacity: 0; }
                  50% { opacity: 1; }
                  100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
                }
                .orbit-item { animation: orbit 3s linear infinite; }
                .float-animation { animation: float 3s ease-in-out infinite; }
                .shimmer-bg {
                  background: linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent);
                  background-size: 200% 100%;
                  animation: shimmer 2s infinite;
                }
                .fade-in-scale { animation: fadeInScale 0.5s ease-out; }
                .scan-line { animation: scan-vertical 2s ease-in-out infinite; }
                .particle { animation: particle-float 2s ease-out infinite; }
              `}</style>

              <div className="relative w-40 h-40 fade-in-scale">
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-transparent to-transparent blur-2xl"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="orbit-item absolute w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-400/40 flex items-center justify-center"
                      style={{
                        animationDelay: `${i * 1}s`,
                        animationDuration: "3s",
                      }}
                    >
                      <svg
                        className="w-4 h-4 text-purple-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative float-animation">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border border-purple-400/30">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>

                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent scan-line"></div>
                  </div>
                </div>

                {[...Array(6)].map((_, i) => (
                  <div
                    key={`particle-${i}`}
                    className="particle absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
                    style={
                      {
                        left: "50%",
                        top: "50%",
                        "--tx": `${Math.cos((i * Math.PI * 2) / 6) * 60}px`,
                        "--ty": `${Math.sin((i * Math.PI * 2) / 6) * 60}px`,
                        animationDelay: `${i * 0.3}s`,
                      } as React.CSSProperties
                    }
                  ></div>
                ))}
              </div>

              <div
                className="text-center space-y-4 fade-in-scale"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                    AI Processing
                    <span
                      className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></span>
                  </h3>
                  <p className="text-purple-200 text-sm max-w-sm mx-auto">
                    Analyzing resumes and matching candidates with job
                    requirements
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-xs text-purple-300/80 max-w-xs mx-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Parsing candidate profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <span>Matching skills & experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                    <span>Calculating compatibility scores</span>
                  </div>
                </div>
              </div>

              <div
                className="w-full max-w-sm space-y-2 fade-in-scale"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex justify-between text-xs text-purple-300">
                  <span>Progress</span>
                  <span className="font-medium">Processing...</span>
                </div>
                <div className="relative w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="absolute inset-0 shimmer-bg"></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <p className="text-sm text-purple-100">
                  Our AI will analyze and shortlist candidates based on your
                  criteria
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Job Position *
                </label>
                <select
                  value={aiJobTitle}
                  onChange={handleJobSelect}
                  className="w-full px-4 py-3 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white bg-slate-800 appearance-none cursor-pointer"
                >
                  <option value="">Select a position</option>
                  {jobTitles.map((job) => (
                    <option key={job.jobId} value={job.jobrole}>
                      {job.jobrole}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400">
                  Choose the job role for AI-based matching
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Match Threshold *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={threshold}
                    onChange={(e) => onThresholdChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                    placeholder="e.g., 75"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 font-medium">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Candidates matching above this percentage will be shortlisted
                </p>
              </div>

              {selectedJobId && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-xs text-green-300">
                    ✓ Job ID selected: {selectedJobId}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-slate-900/50 px-6 py-4 flex justify-end gap-3 border-t border-purple-500/20">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2.5 text-gray-300 font-medium rounded-lg hover:bg-slate-700 transition-colors border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            disabled={!selectedJobId || !threshold || isProcessing}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Apply AI Shortlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiShortlistModal;

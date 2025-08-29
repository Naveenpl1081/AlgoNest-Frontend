import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userAuthService } from "../../service/userAuth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const GitHubCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (code) {
        console.log("GitHub sent us code:", code);

        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 20;
          });
        }, 200);

        try {
          const response = await userAuthService.githubAuth(code);
          clearInterval(progressInterval);
          setProgress(100);

          if (response.success && response.access_token) {
            setStatus("success");
            const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
            Cookies.set("access_token", response.access_token, {
              expires: inOneHour,
            });

            setTimeout(() => {
              toast.success(response.message || "GitHub login successful!");
              navigate("/user/home");
            }, 1500);
          } else {
            setStatus("error");
            setTimeout(() => {
              toast.error(response.message || "GitHub login failed");
              navigate("/user/login");
            }, 2000);
          }
        } catch (error) {
          console.log(error);
          clearInterval(progressInterval);
          setStatus("error");
          setTimeout(() => {
            toast.error("GitHub login failed");
            navigate("/user/login");
          }, 2000);
        }
      } else {
        console.log("No code received");
        setStatus("error");
        setTimeout(() => {
          toast.error("GitHub login failed");
          navigate("/user/login");
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const GitHubIcon = () => (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`github-icon ${
        status === "processing" ? "animate-pulse" : ""
      }`}
      style={{
        color: "#f0f6ff",
        filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
      }}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2"
      className="animate-bounce"
    >
      <path d="m9 12 2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );

  const ErrorIcon = () => (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2"
      className="animate-pulse"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1f2937 0%, #111827 50%, #000000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "32px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {status === "processing" && <GitHubIcon />}
            {status === "success" && <CheckIcon />}
            {status === "error" && <ErrorIcon />}
          </div>

          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "8px",
            }}
          >
            {status === "processing" && "Connecting to GitHub"}
            {status === "success" && "Successfully Connected!"}
            {status === "error" && "Connection Failed"}
          </h2>

          <p
            style={{
              color: "#d1d5db",
              marginBottom: "24px",
              lineHeight: "1.5",
            }}
          >
            {status === "processing" &&
              "Verifying your credentials and setting up your account..."}
            {status === "success" &&
              "Welcome! Redirecting you to your dashboard..."}
            {status === "error" &&
              "Something went wrong. Redirecting you back to login..."}
          </p>

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                width: "100%",
                backgroundColor:
                  status === "success"
                    ? "#064e3b"
                    : status === "error"
                    ? "#7f1d1d"
                    : "#374151",
                borderRadius: "9999px",
                height: "8px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  background:
                    status === "success"
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : status === "error"
                      ? "linear-gradient(90deg, #ef4444, #dc2626)"
                      : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  height: "8px",
                  borderRadius: "9999px",
                  width: status === "processing" ? `${progress}%` : "100%",
                  transition: "width 0.3s ease-out",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "14px",
                color:
                  status === "success"
                    ? "#22c55e"
                    : status === "error"
                    ? "#ef4444"
                    : "#9ca3af",
              }}
            >
              {status === "processing" && `${Math.round(progress)}% complete`}
              {status === "success" && "Authentication complete!"}
              {status === "error" && "Please try again"}
            </p>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "4px" }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor:
                    status === "processing"
                      ? "#3b82f6"
                      : status === "success"
                      ? "#22c55e"
                      : "#ef4444",
                  animation:
                    status === "processing"
                      ? `bounce 1.4s ease-in-out infinite both ${i * 0.2}s`
                      : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Secured by{" "}
            <span style={{ fontWeight: "600", color: "white" }}>
              GitHub OAuth
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: iconBounce 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default GitHubCallback;

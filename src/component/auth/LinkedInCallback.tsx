import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userAuthService } from "../../service/userAuth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { linkedinAuthService } from "../../service/linkedinAuth";

const LinkedinCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      if (error) {
        console.log("LinkedIn error:", error);
        setStatus("error");
        setTimeout(() => {
          toast.error("LinkedIn login cancelled or failed");
          navigate("/user/login");
        }, 2000);
        return;
      }

      if (code && state) {
        console.log("LinkedIn sent us code:", code);

        const isValidState = linkedinAuthService.verifyState(state);
        if (!isValidState) {
          setStatus("error");
          setTimeout(() => {
            toast.error("Invalid state parameter - security error");
            navigate("/user/login");
          }, 2000);
          return;
        }

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
          const response = await userAuthService.linkedinAuth(code);
          clearInterval(progressInterval);
          setProgress(100);

          if (response.success && response.access_token) {
            setStatus("success");
            const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
            Cookies.set("access_token", response.access_token, {
              expires: inOneHour,
            });

            setTimeout(() => {
              toast.success(response.message || "LinkedIn login successful!");
              navigate("/user/home");
            }, 1500);
          } else {
            setStatus("error");
            setTimeout(() => {
              toast.error(response.message || "LinkedIn login failed");
              navigate("/user/login");
            }, 2000);
          }
        } catch (error) {
          console.log(error);
          clearInterval(progressInterval);
          setStatus("error");
          setTimeout(() => {
            toast.error("LinkedIn login failed");
            navigate("/user/login");
          }, 2000);
        }
      } else {
        console.log("No code received from LinkedIn");
        setStatus("error");
        setTimeout(() => {
          toast.error("LinkedIn login failed");
          navigate("/user/login");
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const LinkedinIcon = () => (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`linkedin-icon ${
        status === "processing" ? "animate-pulse" : ""
      }`}
      style={{
        color: "#0A66C2",
        filter: "drop-shadow(0 0 20px rgba(10, 102, 194, 0.5))",
      }}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
          "linear-gradient(135deg, #0A66C2 0%, #084d94 50%, #062952 100%)",
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
            {status === "processing" && <LinkedinIcon />}
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
            {status === "processing" && "Connecting to LinkedIn"}
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
                    : "#0A66C2",
                borderRadius: "9999px",
                height: "8px",
                marginBottom: "8px",
                opacity: 0.3,
              }}
            >
              <div
                style={{
                  background:
                    status === "success"
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : status === "error"
                      ? "linear-gradient(90deg, #ef4444, #dc2626)"
                      : "linear-gradient(90deg, #0A66C2, #084d94)",
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
                      ? "#0A66C2"
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
              LinkedIn OAuth
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

export default LinkedinCallback;

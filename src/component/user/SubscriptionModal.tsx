import React, { useEffect, useState } from "react";
import { X, Check, Zap, Star, Loader2 } from "lucide-react"; 
import { subscriptionService } from "../../service/subscriptionService";
import { SubscriptionShimmer } from "../../utils/shimmer/SubscriptionShimmer";

interface SubscriptionPlan {
  _id: string;
  planName: string;
  price: number;
  durationInMonths: number;
  description: string;
  status: string;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); 

  useEffect(() => {
    if (isOpen) fetchPlans();
  }, [isOpen]);

  const handleSubmit = async (planId: string) => {
    try {
      setSelectedPlanId(planId); 
      const response = await subscriptionService.makePurcahse(planId);

      console.log("Payment response:", response);

      if (response?.success && response?.data?.checkoutUrl) {
       
        window.location.href = response.data.checkoutUrl;
      } else {
        console.error("Checkout URL not found in response:", response);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setSelectedPlanId(null); 
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.showAllSubscriptions();
      setPlans(response.data.subscriptions);
    } catch (err: any) {
      console.error("Error fetching subscriptions:", err);
      setError("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  const bestValuePlan =
    plans.length > 0
      ? plans.reduce((best, plan) =>
          plan.price / plan.durationInMonths <
          best.price / best.durationInMonths
            ? plan
            : best
        )
      : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl max-h-[88vh] overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/40 shadow-xl">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-white/15 rounded-full hover:bg-white/25 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Choose a Plan
          </h1>
          <p className="mt-1 text-sm text-indigo-100">
            AI-powered learning, unlimited access
          </p>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(88vh-130px)]">
          {loading ? (
            <SubscriptionShimmer />
          ) : error ? (
            <div className="text-center py-10 text-red-400 text-sm">{error}</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No plans available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan, idx) => {
                const isBest = bestValuePlan?._id === plan._id;
                const monthly: any = (
                  plan.price / plan.durationInMonths
                ).toFixed(0);
                const savings =
                  plan.durationInMonths > 1
                    ? Math.round(
                        100 -
                          (monthly * 100) /
                            (plans.find((p) => p.durationInMonths === 1)
                              ?.price || 1)
                      )
                    : 0;

                const isLoading = selectedPlanId === plan._id;

                return (
                  <div
                    key={plan._id}
                    className={`relative group rounded-xl bg-slate-800/70 backdrop-blur-sm border transition-all duration-300 p-5 flex flex-col h-full
                      ${
                        isBest
                          ? "border-indigo-500/70 shadow-lg shadow-indigo-500/20"
                          : "border-slate-700/50"
                      }
                      ${
                        hoveredId === plan._id
                          ? "shadow-md shadow-indigo-500/10 -translate-y-0.5"
                          : ""
                      }`}
                    onMouseEnter={() => setHoveredId(plan._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                    }}
                  >
                    {isBest && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-slate-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          RECOMMENDED
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-semibold text-white text-center mb-2">
                      {plan.planName}
                    </h3>

                    <div className="text-center mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                          ₹{plan.price.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-sm">
                          /{plan.durationInMonths} mo
                        </span>
                      </div>
                      {plan.durationInMonths > 1 && (
                        <p className="text-xs text-green-400 mt-1">
                          ₹{monthly}/mo • Save {savings}%
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2 mb-5 text-xs text-gray-300 flex-1">
                      {plan.description
                        .split(".")
                        .filter((s) => s.trim())
                        .map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                            <span>{s.trim()}.</span>
                          </li>
                        ))}
                    </ul>

                    <button
                      onClick={() => handleSubmit(plan._id)}
                      disabled={isLoading}
                      className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all relative overflow-hidden mt-auto flex items-center justify-center gap-2
                        ${
                          isBest
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow hover:shadow-indigo-500/30"
                            : "bg-slate-700 text-white hover:bg-slate-600"
                        }
                        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        <>
                          <span>Choose Plan</span>
                          {isBest && <Zap className="w-4 h-4" />}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

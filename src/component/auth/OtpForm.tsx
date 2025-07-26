import React, { useRef, useState, useEffect } from 'react';
import { UserLikeRoles } from '../../types/auth.types';
import Button from '../common/Button';

interface Props {
  role: UserLikeRoles;
  onSubmit?: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>; 
}

const OtpForm: React.FC<Props> = ({ role, onSubmit, onResend }) => {
  const length = 4;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // ⏱️ Timer logic
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== length) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(fullOtp);
      }
    } catch (err) {
      console.error(err);
      setError('OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLoading || timer > 0) return;
    try {
      setResendLoading(true);
      if (onResend) {
        await onResend();
        setOtp(Array(length).fill(''));
        setTimer(60); // Restart timer
      }
    } catch (err) {
      console.error("Resend OTP failed:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">Verify OTP</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">
        Enter the 4-digit code sent to your email for <span className="font-semibold">{role}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el: HTMLInputElement | null) => {
                inputsRef.current[idx] = el;
              }}
              className="w-12 h-12 text-center text-xl rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full mt-4"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>

      <div className="text-center mt-4 text-sm text-gray-400">
        {timer > 0 ? (
          <>Resend code in <span className="text-blue-400">{timer}s</span></>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition"
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpForm;

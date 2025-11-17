import React, { useState, useEffect } from 'react';

const AILoadingModal = ({ isOpen }: { isOpen: boolean }) =>{
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const steps = [
    { text: "Reading your code...", icon: "📖", color: "bg-blue-500" },
    { text: "Analyzing logic flow...", icon: "🔍", color: "bg-green-500" },
    { text: "Identifying potential issues...", icon: "🎯", color: "bg-yellow-500" },
    { text: "Generating solutions...", icon: "💡", color: "bg-purple-500" },
    { text: "Preparing explanation...", icon: "✨", color: "bg-pink-500" }
  ];

  const loadingMessages = [
    "🤖 AI is thinking...",
    "🧠 Processing your code...", 
    "⚡ Almost ready...",
    "🎉 Finalizing analysis..."
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 800);

    const textInterval = setInterval(() => {
      setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 1500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(textInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
     
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <div className="text-3xl animate-spin">🤖</div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Code Debugger</h2>
          <p className="text-gray-600">Our AI is analyzing your code to provide helpful insights</p>
        </div>

     
        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                index <= currentStep ? step.color : 'bg-gray-300'
              } transition-all duration-300 ${
                index === currentStep ? 'animate-pulse scale-110' : ''
              }`}>
                {index <= currentStep ? '✓' : (index - currentStep === 1 ? step.icon : '')}
              </div>
              <span className={`text-sm transition-all duration-300 ${
                index <= currentStep ? 'text-gray-800 font-medium' : 'text-gray-400'
              }`}>
                {step.text}
              </span>
              {index === currentStep && (
                <div className="flex space-x-1 ml-2">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

       
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>

       
        <div className="text-center">
          <p className="text-sm text-gray-600 animate-pulse">
            {loadingText || loadingMessages[0]}
          </p>
        </div>

 
        <div className="text-center mt-3">
          <p className="text-xs text-gray-400">
            ⏱️ Usually takes 2-5 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default AILoadingModal;
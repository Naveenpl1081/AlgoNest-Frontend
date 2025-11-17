import React from 'react';


interface AIExplanationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
  suggestedFix: string;
  codeExample?: string;
  confidence: number;
  aiProvider: string;
}

const AIExplanationPopup: React.FC<AIExplanationPopupProps> = ({ isOpen, onClose, explanation, suggestedFix, codeExample, confidence, aiProvider }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
       
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Code Analysis</h2>
              <p className="text-blue-100 text-sm">{aiProvider} • {confidence}% Confidence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

    
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
       
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                📋
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Explanation</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <pre className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
                {explanation}
              </pre>
            </div>
          </div>

         
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                🔧
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Suggested Fix</h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {suggestedFix}
              </pre>
            </div>
          </div>

    
          {codeExample && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  💻
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Code Example</h3>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-purple-500">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Confidence Level</span>
              <span className="text-sm font-semibold text-gray-800">{confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  confidence >= 90 ? 'bg-green-500' :
                  confidence >= 75 ? 'bg-blue-500' :
                  confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`EXPLANATION:\n${explanation}\n\nSUGGESTED FIX:\n${suggestedFix}${codeExample ? `\n\nCODE EXAMPLE:\n${codeExample}` : ''}`);
              alert('Analysis copied to clipboard!');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
          >
            📋 Copy
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIExplanationPopup;
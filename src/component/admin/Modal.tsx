import { X } from "lucide-react";

export const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-slate-700">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
            {children}
          </div>
        </div>
      </div>
    );
  };
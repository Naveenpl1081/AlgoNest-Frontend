import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const SocialButton: React.FC<{
  provider: 'github' | 'linkedin';
  onClick: () => void;
}> = ({ provider, onClick }) => {
  const config = {
    github: {
      icon: <Github size={18} className="text-white" />,
      text: 'GitHub'
    },
    linkedin: {
      icon: <Linkedin size={18} className="text-white" />,
      text: 'LinkedIn'
    }
  };

  const { icon, text } = config[provider];

  return (
    <button
      onClick={onClick}
      className={`
        w-full sm:w-auto 
        flex items-center justify-center gap-3 
        px-5 py-2.5 rounded-xl
        bg-white/10 backdrop-blur-md
        border border-white/20 
        shadow-[0_4px_20px_rgba(255,255,255,0.05)]
        hover:shadow-[0_6px_25px_rgba(255,255,255,0.1)]
        hover:scale-[1.03] transition-all duration-200
        text-white text-sm font-medium
      `}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default SocialButton;

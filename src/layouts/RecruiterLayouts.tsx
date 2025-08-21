import React from 'react';
import { RecruiterLayoutProps } from '../types/component.types';
import RecruiterNavbar from '../component/recruiter/RecruiterNavbar';
import RecruiterFooter from '../component/recruiter/RecruiterFooter';

const RecruiterLayout: React.FC<RecruiterLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-purple-950 text-white">

      <RecruiterNavbar />


      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>

 
      <RecruiterFooter />
    </div>
  );
};

export default RecruiterLayout;

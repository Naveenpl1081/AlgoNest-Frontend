import React from 'react';
import { UserLayoutProps } from '../types/component.types';
import UserNavbar from '../component/user/UserNavbar';
import UserFooter from '../component/user/UserFooter';

const UserLayout:React.FC<UserLayoutProps>  = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <UserNavbar/>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
      <UserFooter/>
    </div>
  );
};

export default UserLayout;
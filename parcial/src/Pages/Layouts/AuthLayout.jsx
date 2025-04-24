import { Outlet } from 'react-router-dom';
import React from 'react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
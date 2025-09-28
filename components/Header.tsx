import React from 'react';
import SchoolCrestIcon from './icons/SchoolCrestIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-stoneridge-green">
            <SchoolCrestIcon className="w-10 h-10" />
        </div>
        <div>
            <h1 className="text-xl font-bold text-stoneridge-green">Administrative Agent</h1>
            <p className="text-sm text-gray-500">The Stoneridge School</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

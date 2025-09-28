import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="flex-shrink-0 bg-stoneridge-green text-white rounded-full w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default KPICard;
import React from 'react';
import type { View } from './Sidebar';
import UploadIcon from './icons/UploadIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import RocketIcon from './icons/RocketIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';

interface HomeProps {
    setActiveView: (view: View) => void;
}

const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    className?: string;
}> = ({ icon, title, description, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left w-full ${className}`}
    >
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-stoneridge-green text-white rounded-full w-12 h-12 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-stoneridge-green">{title}</h3>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>
        </div>
    </button>
);

const Home: React.FC<HomeProps> = ({ setActiveView }) => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-100">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-stoneridge-green">Welcome to the Administrative Agent</h1>
                    <p className="text-xl text-gray-500 mt-2">Your AI-powered assistant for managing The Stoneridge School.</p>
                </header>

                <div className="bg-white p-8 rounded-lg shadow-xl mb-10 border-t-4 border-stoneridge-gold">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
                    <p className="text-gray-700 mb-6">
                        This application is ready to be tailored to our school's specific needs. To unlock its full potential, the first and most important step is to import your data. Without data, the agent's abilities are limited.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <ActionCard 
                            icon={<UploadIcon className="w-6 h-6" />}
                            title="Import Your Data"
                            description="Upload student, teacher, and staff lists to begin."
                            onClick={() => setActiveView('DataImport')}
                            className="bg-stoneridge-gold/10 border border-stoneridge-gold"
                        />
                         <ActionCard 
                            icon={<QuestionMarkCircleIcon className="w-6 h-6" />}
                            title="Read the User Manual"
                            description="Learn how to format and manage your data."
                            onClick={() => setActiveView('UserManual')}
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ActionCard 
                            icon={<RocketIcon className="w-6 h-6" />}
                            title="School Operations"
                            description="View the main dashboard for admissions, fees, and attendance."
                            onClick={() => setActiveView('SchoolOps')}
                        />
                        <ActionCard 
                            icon={<AcademicCapIcon className="w-6 h-6" />}
                            title="Student Management"
                            description="Search, manage, and analyze student records."
                            onClick={() => setActiveView('Students')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.24-1.879M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.284.24-1.879m10.518-10.879a3 3 0 11-4.242 0M7.24 9.121a3 3 0 114.242 0M12 12.879a3 3 0 014.242 0" />
    </svg>
);

export default UsersIcon;

import React from 'react';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import MegaphoneIcon from './icons/MegaphoneIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import UsersIcon from './icons/UsersIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import RocketIcon from './icons/RocketIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import ClipboardCheckIcon from './icons/ClipboardCheckIcon';
import UploadIcon from './icons/UploadIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import ServerIcon from './icons/ServerIcon';
import HomeIcon from './icons/HomeIcon';
// Fix: Import ClipboardListIcon for the Task Manager nav item.
import ClipboardListIcon from './icons/ClipboardListIcon';

export type View =
  | 'Home'
  | 'Chat'
  | 'EmailDrafter'
  | 'AnnouncementCreator'
  | 'ActivityPlanner'
  | 'SchoolOps'
  | 'Students'
  | 'Teachers'
  | 'Staff'
  | 'Parents'
  | 'Contractors'
  | 'DataImport'
  | 'UserManual'
  | 'DeploymentGuide'
  // Fix: Add 'TaskManager' to the View type to resolve the type error.
  | 'TaskManager';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-stoneridge-gold text-white'
        : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

const SectionHeading: React.FC<{ label: string }> = ({ label }) => (
    <div className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = {
    main: [
        { id: 'Home', icon: <HomeIcon className="w-5 h-5" />, label: 'Home' },
        { id: 'Chat', icon: <ChatBubbleIcon className="w-5 h-5" />, label: 'Agent Chat' },
        { id: 'SchoolOps', icon: <RocketIcon className="w-5 h-5" />, label: 'School Operations' },
        // Fix: Add a navigation item for the Task Manager.
        { id: 'TaskManager', icon: <ClipboardListIcon className="w-5 h-5" />, label: 'Task Manager' },
    ],
    aiTools: [
        { id: 'EmailDrafter', icon: <EnvelopeIcon className="w-5 h-5" />, label: 'Email Drafter' },
        { id: 'AnnouncementCreator', icon: <MegaphoneIcon className="w-5 h-5" />, label: 'Announcement Creator' },
        { id: 'ActivityPlanner', icon: <LightBulbIcon className="w-5 h-5" />, label: 'Activity Planner' },
    ],
    directory: [
        { id: 'Students', icon: <AcademicCapIcon className="w-5 h-5" />, label: 'Students' },
        { id: 'Parents', icon: <UserGroupIcon className="w-5 h-5" />, label: 'Parents' },
        { id: 'Teachers', icon: <UsersIcon className="w-5 h-5" />, label: 'Teachers' },
        { id: 'Staff', icon: <BriefcaseIcon className="w-5 h-5" />, label: 'Staff' },
        { id: 'Contractors', icon: <ClipboardCheckIcon className="w-5 h-5" />, label: 'Contractors' },
    ],
    settings: [
        { id: 'DataImport', icon: <UploadIcon className="w-5 h-5" />, label: 'Data Import/Export' },
        { id: 'UserManual', icon: <QuestionMarkCircleIcon className="w-5 h-5" />, label: 'User Manual' },
        { id: 'DeploymentGuide', icon: <ServerIcon className="w-5 h-5" />, label: 'Installation Guide' },
    ]
  };

  const renderNavItems = (items: { id: string; icon: JSX.Element; label: string }[]) => {
    return items.map((item) => (
      <NavItem
        key={item.id}
        icon={item.icon}
        label={item.label}
        isActive={activeView === item.id}
        onClick={() => setActiveView(item.id as View)}
      />
    ));
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        <SectionHeading label="Main" />
        {renderNavItems(navItems.main)}

        <SectionHeading label="AI Tools" />
        {renderNavItems(navItems.aiTools)}

        <SectionHeading label="Directory" />
        {renderNavItems(navItems.directory)}
      </nav>
      <div className="py-2 space-y-1 border-t border-gray-200">
         <SectionHeading label="Settings & Help" />
         {renderNavItems(navItems.settings)}
      </div>
    </aside>
  );
};

export default Sidebar;

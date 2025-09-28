import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar, { type View } from './components/Sidebar';
import Home from './components/Home';
import ChatWindow from './components/ChatWindow';
import ToolContainer from './components/ToolContainer';
import TaskManager from './components/TaskManager';
import SchoolOpsDashboard from './components/SchoolOps/SchoolOpsDashboard';
import StudentManager from './components/StudentManager';
import TeacherManager from './components/TeacherManager';
import StaffManager from './components/StaffManager';
import ParentManager from './components/ParentManager';
import ContractorManager from './components/ContractorManager';
import DataImportManager from './components/DataImportManager';
import UserManual from './components/UserManual';
import DeploymentGuide from './components/DeploymentGuide';
import { Author, type ChatMessage } from './types';
import { sendMessageToChat } from './services/geminiService';
import { getStudents } from './services/dataService';

const App: React.FC = () => {
  const [initialView] = useState<View>(() => {
    // Check if student data exists to determine the initial view
    const students = getStudents();
    return students.length > 0 ? 'SchoolOps' : 'Home';
  });

  const [activeView, setActiveView] = useState<View>(initialView);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      author: Author.AI,
      text: "Hello! I'm the administrative agent for The Stoneridge School. How can I assist you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = { author: Author.USER, text: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseText = await sendMessageToChat(message);
      const aiMessage: ChatMessage = { author: Author.AI, text: aiResponseText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        author: Author.AI,
        text: error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'Home':
        return <Home setActiveView={setActiveView} />;
      case 'Chat':
        return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />;
      case 'EmailDrafter':
        return <ToolContainer tool="EmailDrafter" title="Email Drafter" description="Draft professional emails to parents, staff, or the wider school community." placeholder="e.g., Draft an email to parents about the upcoming sports day..." />;
      case 'AnnouncementCreator':
        return <ToolContainer tool="AnnouncementCreator" title="Announcement Creator" description="Create engaging announcements for school events, holidays, or news." placeholder="e.g., Announce the dates for the end-of-term exams..." />;
      case 'ActivityPlanner':
        return <ToolContainer tool="ActivityPlanner" title="Activity Planner" description="Generate creative ideas and structured plans for school activities and events." placeholder="e.g., Plan a science fair for students in Year 5 and 6..." />;
      case 'TaskManager':
          return <TaskManager />;
      case 'SchoolOps':
          return <SchoolOpsDashboard />;
      case 'Students':
          return <StudentManager />;
      case 'Teachers':
          return <TeacherManager />;
      case 'Staff':
          return <StaffManager />;
      case 'Parents':
          return <ParentManager />;
      case 'Contractors':
          return <ContractorManager />;
      case 'DataImport':
          return <DataImportManager />;
      case 'UserManual':
          return <UserManual />;
      case 'DeploymentGuide':
          return <DeploymentGuide />;
      default:
        return <Home setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
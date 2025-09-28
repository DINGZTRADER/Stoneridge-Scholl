
import React, { useState, useEffect } from 'react';

import KPICard from './KPICard';
import AdmissionsManager from './AdmissionsManager';
import FeesManager from './FeesManager';
import AttendanceManager from './AttendanceManager';
import TransportManager from './TransportManager';
import BroadcastManager from './BroadcastManager';
import AdmissionsPipelineChart from './AdmissionsPipelineChart';
import FeeCollectionChart from './FeeCollectionChart';
import AttendanceChart from './AttendanceChart';

import UsersIcon from '../icons/UsersIcon';
import AcademicCapIcon from '../icons/AcademicCapIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import ClockIcon from '../icons/ClockIcon';

import { getStudents, getApplications, getInvoices, getAttendance } from '../../services/dataService';
import type { Student, Application, Invoice, AttendanceRecord } from '../../types';

const SchoolOpsDashboard: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

    useEffect(() => {
        setStudents(getStudents());
        setApplications(getApplications());
        setInvoices(getInvoices());
        setAttendance(getAttendance());
    }, []);

    const totalStudents = students.length;
    const pendingApplications = applications.filter(a => a.status !== 'Enrolled' && a.status !== 'Rejected').length;
    const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;

    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;
    const attendancePercentage = totalStudents > 0 ? (presentToday / totalStudents * 100).toFixed(0) : 0;

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-stoneridge-green">School Operations Dashboard</h2>
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard title="Total Students" value={totalStudents} description="Currently enrolled" icon={<UsersIcon className="w-6 h-6"/>} />
                    <KPICard title="Pending Applications" value={pendingApplications} description="In the pipeline" icon={<AcademicCapIcon className="w-6 h-6"/>} />
                    <KPICard title="Overdue Invoices" value={overdueInvoices} description="Require follow-up" icon={<BriefcaseIcon className="w-6 h-6"/>} />
                    <KPICard title="Today's Attendance" value={`${attendancePercentage}%`} description={`${presentToday} students present`} icon={<ClockIcon className="w-6 h-6"/>} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <AttendanceChart students={students} attendance={attendance} />
                    </div>
                     <div className="lg:col-span-1">
                        <FeeCollectionChart invoices={invoices} />
                    </div>
                     <div className="lg:col-span-1">
                        <AdmissionsPipelineChart applications={applications} />
                    </div>
                </div>

                {/* Manager Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AdmissionsManager />
                    <FeesManager />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <TransportManager />
                    </div>
                    <div className="lg:col-span-2">
                        <AttendanceManager />
                    </div>
                </div>

                <div>
                    <BroadcastManager />
                </div>

            </div>
        </div>
    );
};

export default SchoolOpsDashboard;

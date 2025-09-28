import React, { useState, useEffect } from 'react';
import type { Application, ApplicationStatus } from '../../types';
import { APPLICATION_STEPS } from '../../types';
import { getApplications, saveApplications } from '../../services/dataService';

const AdmissionsManager: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        setApplications(getApplications());
    }, []);

    const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
        const updatedApps = applications.map(app => app.id === id ? { ...app, status: newStatus } : app);
        setApplications(updatedApps);
        saveApplications(updatedApps);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
             <h3 className="text-xl font-semibold text-gray-800 mb-4">Admissions Pipeline</h3>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applying For</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map(app => (
                            <tr key={app.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                                    <div className="text-sm text-gray-500">{app.guardianName} ({app.guardianContact})</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applyingForClass}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-stoneridge-gold focus:ring-stoneridge-gold"
                                    >
                                        {APPLICATION_STEPS.map(step => (
                                            <option key={step} value={step}>{step}</option>
                                        ))}
                                         <option value="Rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdmissionsManager;
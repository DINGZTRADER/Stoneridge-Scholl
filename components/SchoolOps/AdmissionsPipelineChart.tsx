
import React, { useMemo } from 'react';
import type { Application, ApplicationStatus } from '../../types';
import { APPLICATION_STEPS } from '../../types';

interface AdmissionsPipelineChartProps {
  applications: Application[];
}

const ALL_STATUSES: ApplicationStatus[] = [...APPLICATION_STEPS, 'Rejected'];

const AdmissionsPipelineChart: React.FC<AdmissionsPipelineChartProps> = ({ applications }) => {
  const data = useMemo(() => {
    const statusCounts = ALL_STATUSES.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    const total = applications.length > 0 ? applications.length : 1; // Avoid division by zero
    return ALL_STATUSES.map(status => {
        const count = statusCounts[status];
        return {
            status,
            count,
            percentage: (count / total) * 100,
        }
    });
  }, [applications]);

  const colors: Record<string, string> = {
    Submitted: 'bg-blue-400',
    'In Review': 'bg-cyan-400',
    Interview: 'bg-indigo-400',
    Offered: 'bg-purple-400',
    Enrolled: 'bg-green-500',
    Rejected: 'bg-red-400',
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Admissions Funnel</h3>
      <div className="space-y-3">
        {data.map(({ status, count, percentage }) => (
          <div key={status}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium text-gray-700">{status}</span>
              <span className="text-gray-500">{count} applicant(s)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${colors[status] || 'bg-gray-400'}`}
                style={{ width: `${percentage}%` }}
                title={`${percentage.toFixed(1)}%`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmissionsPipelineChart;

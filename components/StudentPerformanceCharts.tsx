import React, { useMemo } from 'react';
import type { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StudentPerformanceChartsProps {
    students: Student[];
}

const StudentPerformanceCharts: React.FC<StudentPerformanceChartsProps> = ({ students }) => {

    const classAverageData = useMemo(() => {
        if (!students || students.length === 0) return [];
        
        const classScores: { [className: string]: { totalScore: number; count: number } } = {};

        students.forEach(student => {
            const className = student.class;
            if (!classScores[className]) {
                classScores[className] = { totalScore: 0, count: 0 };
            }
            classScores[className].totalScore += student.performance.avgScore;
            classScores[className].count++;
        });

        return Object.keys(classScores)
            .map(className => ({
                name: className,
                'Average Score': parseFloat((classScores[className].totalScore / classScores[className].count).toFixed(1)),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [students]);

    const scoreDistributionData = useMemo(() => {
        if (!students || students.length === 0) return [];

        const brackets = {
            'A (80+)': 0,
            'B (60-79)': 0,
            'C (40-59)': 0,
            'D (<40)': 0,
        };

        students.forEach(student => {
            const score = student.performance.avgScore;
            if (score >= 80) brackets['A (80+)']++;
            else if (score >= 60) brackets['B (60-79)']++;
            else if (score >= 40) brackets['C (40-59)']++;
            else brackets['D (<40)']++;
        });

        return Object.keys(brackets).map(key => ({
            name: key,
            value: brackets[key as keyof typeof brackets],
        }));
    }, [students]);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (students.length === 0) {
        return (
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-stoneridge-green mb-4">Performance Overview</h3>
                <div className="text-center py-10 text-gray-500">
                    <p>No student performance data available.</p>
                    <p className="text-sm">Import student data to see performance charts.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-stoneridge-green mb-6">Performance Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ height: '300px' }}>
                <div>
                    <h4 className="text-center font-semibold text-gray-700 mb-2">Average Score by Class</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classAverageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Average Score" fill="#004d40" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h4 className="text-center font-semibold text-gray-700 mb-2">Overall Score Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={scoreDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {scoreDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StudentPerformanceCharts;

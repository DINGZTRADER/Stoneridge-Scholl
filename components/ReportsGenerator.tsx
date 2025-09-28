import React, { useState, useMemo, useEffect } from 'react';
import { getStudents } from '../services/dataService';
import type { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ReportMetric = 'avgScore';
type ReportGroupBy = 'gender' | 'class' | 'stream';
type ReportResult = { name: string; value: number }[];

const ReportsGenerator: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [metric, setMetric] = useState<ReportMetric>('avgScore');
    const [groupBy, setGroupBy] = useState<ReportGroupBy>('gender');
    const [subjectFilter, setSubjectFilter] = useState<string>('All');
    const [classFilter, setClassFilter] = useState<string>('All');
    
    const [reportData, setReportData] = useState<ReportResult | null>(null);

    useEffect(() => {
        setStudents(getStudents());
    }, []);

    const { availableSubjects, availableClasses } = useMemo(() => {
        const subjects = new Set<string>();
        const classes = new Set<string>();
        students.forEach(s => {
            Object.keys(s.subjectMarks).forEach(sub => subjects.add(sub));
            classes.add(s.class);
        });
        return {
            availableSubjects: ['All', ...Array.from(subjects).sort()],
            availableClasses: ['All', ...Array.from(classes).sort()],
        };
    }, [students]);

    const handleGenerateReport = () => {
        let filteredStudents = students;

        // Apply class filter
        if (classFilter !== 'All') {
            filteredStudents = filteredStudents.filter(s => s.class === classFilter);
        }

        // Apply subject filter (if metric is avgScore)
        const getScore = (student: Student): number => {
            if (metric === 'avgScore') {
                if (subjectFilter !== 'All') {
                    return student.subjectMarks[subjectFilter] ?? 0;
                }
                return student.performance.avgScore;
            }
            return 0;
        };

        const groupedData: { [key: string]: { totalScore: number; count: number } } = {};

        filteredStudents.forEach(student => {
            const groupKey = student[groupBy];
            const score = getScore(student);
            
            if (score > 0) { // Only include students with a valid score for the metric
                if (!groupedData[groupKey]) {
                    groupedData[groupKey] = { totalScore: 0, count: 0 };
                }
                groupedData[groupKey].totalScore += score;
                groupedData[groupKey].count++;
            }
        });

        const result: ReportResult = Object.entries(groupedData).map(([name, data]) => ({
            name,
            value: data.count > 0 ? data.totalScore / data.count : 0,
        })).sort((a,b) => b.value - a.value); // Sort descending

        setReportData(result);
    };

    const metricLabel = metric === 'avgScore' ? `Average Score ${subjectFilter !== 'All' ? `(${subjectFilter})` : ''}` : 'Average Score';

    if (students.length === 0) {
        return (
             <div className="p-8 h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-stoneridge-green mb-4">Reports Generator</h2>
                    <p className="text-gray-500">No student data available to generate reports.</p>
                    <p className="text-sm mt-2">Please import student data via the 'Data Import/Export' page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-stoneridge-green mb-6">Reports Generator</h2>
                
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        {/* Group By */}
                        <div>
                            <label htmlFor="group-by" className="block text-sm font-medium text-gray-700">Group By</label>
                            <select id="group-by" value={groupBy} onChange={e => setGroupBy(e.target.value as ReportGroupBy)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stoneridge-gold focus:border-stoneridge-gold sm:text-sm rounded-md">
                                <option value="gender">Gender</option>
                                <option value="class">Class</option>
                                <option value="stream">Stream</option>
                            </select>
                        </div>

                        {/* Filter by Class */}
                         <div>
                            <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700">Filter by Class</label>
                            <select id="class-filter" value={classFilter} onChange={e => setClassFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stoneridge-gold focus:border-stoneridge-gold sm:text-sm rounded-md">
                                {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Filter by Subject */}
                        <div>
                            <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700">Filter by Subject</label>
                            <select id="subject-filter" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stoneridge-gold focus:border-stoneridge-gold sm:text-sm rounded-md">
                                {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select a subject to see specific scores, or 'All' for overall average.</p>
                        </div>
                        
                        {/* Generate Button */}
                        <div className="lg:col-span-2 text-right">
                             <button onClick={handleGenerateReport} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800">
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>

                {reportData ? (
                    reportData.length > 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                            <h3 className="text-xl font-bold text-stoneridge-green mb-6">Report: {metricLabel} by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2" style={{ height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value: number) => value.toFixed(2)} />
                                            <Legend />
                                            <Bar dataKey="value" name={metricLabel} fill="#004d40" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Data Table</h4>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{groupBy}</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reportData.map(item => (
                                                <tr key={item.name}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.value.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                            <h3 className="text-lg text-gray-600">No data available for the selected criteria.</h3>
                            <p className="text-sm text-gray-500">Please adjust your filters and try again.</p>
                        </div>
                    )
                ) : (
                    <div className="bg-white p-10 rounded-lg shadow-sm text-center border-2 border-dashed border-gray-300">
                        <h3 className="text-xl font-medium text-gray-700">Ready to Analyze Your Data</h3>
                        <p className="text-gray-500 mt-2">Select your criteria above and click "Generate Report" to see an analysis of student performance.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsGenerator;

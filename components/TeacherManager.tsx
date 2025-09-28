import React, { useState, useEffect, useMemo } from 'react';
import { getTeachers, saveTeachers, transformTeacherData } from '../services/dataService';
import type { Teacher, SortConfig, SortDirection } from '../types';
import FileUpload from './shared/FileUpload';
import SortableTableHeader from './shared/SortableTableHeader';

type ImportStatus = { message: string; type: 'success' | 'error' };

const TeacherManager: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<Teacher> | null>({ key: 'name', direction: 'ascending' });
    
    useEffect(() => {
        setTeachers(getTeachers());
    }, []);

    const handleTeacherImport = (data: any[]) => {
        setImportStatus(null);
        try {
            const newTeachers = transformTeacherData(data);
            const existingTeacherIds = new Set(teachers.map(t => t.id));
            const uniqueNewTeachers = newTeachers.filter(t => t.id && !existingTeacherIds.has(t.id));
            
            const duplicates = newTeachers.length - uniqueNewTeachers.length;

            if (uniqueNewTeachers.length > 0) {
                const updatedTeachers = [...teachers, ...uniqueNewTeachers];
                setTeachers(updatedTeachers);
                saveTeachers(updatedTeachers);
                 setImportStatus({
                    message: `Successfully imported ${uniqueNewTeachers.length} new teachers. ${duplicates > 0 ? `${duplicates} duplicate(s) were ignored.` : ''}`,
                    type: 'success'
                });
            } else {
                 setImportStatus({
                    message: `Import complete. No new teachers were added. Found ${duplicates} duplicate(s).`,
                    type: 'success'
                });
            }
        } catch (err) {
            handleImportError("The imported file structure is incorrect for teacher data.");
        }
    };
    
    const handleImportError = (message: string) => {
        setImportStatus({ message, type: 'error' });
    };

    const handleSort = (key: keyof Teacher) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredTeachers = useMemo(() => {
        let filtered: Teacher[] = [...teachers];

        if (searchTerm.trim()) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = teachers.filter(teacher => 
                Object.values(teacher).some(value => 
                    String(value).toLowerCase().includes(lowercasedFilter)
                )
            );
        }

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        return filtered;
    }, [teachers, searchTerm, sortConfig]);

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-stoneridge-green">Teacher Management</h2>
                    <FileUpload label="Import Teachers" onFileUpload={handleTeacherImport} onError={handleImportError} />
                </div>

                {importStatus && (
                    <div className={`p-4 mb-4 rounded-md text-sm ${importStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {importStatus.message}
                    </div>
                )}

                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search teachers..."
                        className="w-full max-w-sm p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
                        aria-label="Search teachers"
                    />
                </div>
                
                <div className="bg-white rounded-lg shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <SortableTableHeader<Teacher> label="Teacher ID" sortKey="teacherId" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Teacher> label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Teacher> label="Subject" sortKey="subject" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Teacher> label="Class Assigned" sortKey="classAssigned" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Teacher> label="Contact" sortKey="contact" sortConfig={sortConfig} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedAndFilteredTeachers.length > 0 ? (
                                    sortedAndFilteredTeachers.map(teacher => (
                                        <tr key={teacher.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.teacherId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{teacher.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.subject}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.classAssigned}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.contact}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-gray-500">
                                            {teachers.length > 0 ? 'No teachers match your search.' : 'No teachers found. Use the "Import Teachers" button to add data.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherManager;
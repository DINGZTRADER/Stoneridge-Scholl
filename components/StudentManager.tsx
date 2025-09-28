import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getStudents, saveStudents, transformStudentData } from '../services/dataService';
import { findStudentsWithAI } from '../services/geminiService';
import type { Student, SortConfig, SortDirection } from '../types';
import Spinner from './shared/Spinner';
import ImportModal from './shared/FileUpload';
import StudentPerformanceCharts from './StudentPerformanceCharts';
import SortableTableHeader from './shared/SortableTableHeader';

// Modal component for assigning a new class
const AssignClassModal: React.FC<{
    isOpen: boolean;
    studentCount: number;
    onClose: () => void;
    onAssign: (newClass: string) => void;
}> = ({ isOpen, studentCount, onClose, onAssign }) => {
    const [selectedClass, setSelectedClass] = useState('Year 7');
    // Example classes, can be dynamically generated in a real app
    const availableClasses = ['Year 7', 'Year 8', 'Year 9'];

    if (!isOpen) return null;

    const handleAssign = () => {
        onAssign(selectedClass);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Assign Class</h3>
                <p className="mb-4 text-sm text-gray-600">
                    You are about to assign a new class to {studentCount} selected student(s).
                </p>
                <div className="mb-4">
                    <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">New Class</label>
                    <select
                        id="class-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stoneridge-gold focus:border-stoneridge-gold sm:text-sm rounded-md"
                    >
                        {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={handleAssign} type="button" className="px-4 py-2 bg-stoneridge-green text-white rounded-md text-sm font-medium hover:bg-green-800">
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
};

type AiSearchResult = { studentId: string; reason: string };

const StudentManager: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<Student> | null>({ key: 'name', direction: 'ascending' });
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [aiSearchResults, setAiSearchResults] = useState<AiSearchResult[] | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiSearchError, setAiSearchError] = useState<string | null>(null);
    
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setStudents(getStudents());
    }, []);
    
    const handleStudentImport = (data: any[]) => {
        try {
            const newStudents = transformStudentData(data);
            const existingStudentIds = new Set(students.map(s => s.id));
            const uniqueNewStudents = newStudents.filter(s => !existingStudentIds.has(s.id));
            
            if (uniqueNewStudents.length > 0) {
                const updatedStudents = [...students, ...uniqueNewStudents];
                setStudents(updatedStudents);
                saveStudents(updatedStudents);
            }
        } catch (err) {
            console.error("Failed to transform student data:", err);
        }
    };
    
    const handleSort = (key: keyof Student) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAiSearch = async () => {
        if (!searchTerm.trim()) return;

        setIsAiLoading(true);
        setAiSearchError(null);
        setAiSearchResults(null);
        
        try {
            const results = await findStudentsWithAI(searchTerm, students);
            setAiSearchResults(results);
        } catch(err) {
            setAiSearchError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setAiSearchResults(null);
        setAiSearchError(null);
    };

    const sortedAndFilteredStudents = useMemo(() => {
        let filtered: Student[] = [...students];

        if (aiSearchResults) {
            const resultMap = new Map(aiSearchResults.map(r => [r.studentId, r.reason]));
            filtered = students
                .filter(student => resultMap.has(student.studentId))
                .map(student => ({ ...student, matchReason: resultMap.get(student.studentId) }));
        } else if (searchTerm.trim()) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = students.filter(student => 
                student.name.toLowerCase().includes(lowercasedFilter) || 
                student.studentId.toLowerCase().includes(lowercasedFilter)
            );
        }

        if (sortConfig !== null && !aiSearchResults) { // Don't re-sort AI results, keep the model's order
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        return filtered;
    }, [students, searchTerm, sortConfig, aiSearchResults]);

    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            const numSelected = selectedStudentIds.length;
            const numVisible = sortedAndFilteredStudents.length;
            selectAllCheckboxRef.current.checked = numSelected > 0 && numSelected === numVisible;
            selectAllCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numVisible;
        }
    }, [selectedStudentIds, sortedAndFilteredStudents]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedStudentIds(sortedAndFilteredStudents.map(s => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleSelectOne = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleBulkAction = (action: string) => {
        if (!action) return;

        if (action === 'delete') {
            if (window.confirm(`Are you sure you want to delete ${selectedStudentIds.length} student(s)? This action cannot be undone.`)) {
                const updatedStudents = students.filter(s => !selectedStudentIds.includes(s.id));
                setStudents(updatedStudents);
                saveStudents(updatedStudents);
                setSelectedStudentIds([]);
            }
        } else if (action === 'assignClass') {
            setIsAssignModalOpen(true);
        }
    };

    const handleAssignClass = (newClass: string) => {
        const updatedStudents = students.map(student =>
            selectedStudentIds.includes(student.id) ? { ...student, class: newClass } : student
        );
        setStudents(updatedStudents);
        saveStudents(updatedStudents);
        setSelectedStudentIds([]);
        setIsAssignModalOpen(false);
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <AssignClassModal
                isOpen={isAssignModalOpen}
                studentCount={selectedStudentIds.length}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleAssignClass}
            />
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={handleStudentImport}
                expectedStructure="array"
                title="Import Student Data"
                description={
                    <p>Upload a JSON file containing an array of student records. The system will add new students and ignore any duplicates based on Student ID.</p>
                }
            />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-stoneridge-green">Student Management</h2>
                    <button onClick={() => setIsImportModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800">
                        Import Students
                    </button>
                </div>

                <div className="mb-8">
                    <StudentPerformanceCharts students={students} />
                </div>

                <div className="mb-6">
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., students who excel in science and are in the chess club"
                            className="w-full max-w-xl p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
                            aria-label="Search students"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAiSearch(); }}
                        />
                         <button onClick={handleAiSearch} disabled={isAiLoading || !searchTerm.trim()} className="px-4 py-3 bg-stoneridge-gold text-white rounded-md font-medium hover:bg-yellow-600 disabled:bg-yellow-300 flex items-center justify-center min-w-[120px]">
                            {isAiLoading ? <Spinner /> : "AI Search"}
                        </button>
                        {(aiSearchResults || searchTerm) && (
                            <button onClick={clearSearch} className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300">
                                Clear
                            </button>
                        )}
                    </div>
                     <p className="text-xs text-gray-500 mt-2">Use the AI Search for complex queries. For simple name/ID lookups, just type and the list will filter automatically.</p>
                </div>
                 
                {aiSearchError && (
                    <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md border border-red-200">
                        <p><span className="font-bold">Error:</span> {aiSearchError}</p>
                    </div>
                )}


                {selectedStudentIds.length > 0 && (
                    <div className="bg-stoneridge-green/10 p-4 mb-6 rounded-md flex items-center justify-between">
                        <span className="text-sm font-medium text-stoneridge-green">
                            {selectedStudentIds.length} student(s) selected
                        </span>
                        <div>
                             <select
                                onChange={(e) => {
                                    handleBulkAction(e.target.value);
                                    e.target.value = '';
                                }}
                                className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stoneridge-gold focus:border-stoneridge-gold sm:text-sm rounded-md"
                                aria-label="Bulk actions"
                            >
                                <option value="">Bulk Actions</option>
                                <option value="assignClass">Assign to Class...</option>
                                <option value="delete">Delete Selected</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <label htmlFor="select-all-students" className="sr-only">Select all students</label>
                                        <input
                                            id="select-all-students"
                                            type="checkbox"
                                            ref={selectAllCheckboxRef}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-stoneridge-green border-gray-300 rounded focus:ring-stoneridge-gold"
                                        />
                                    </th>
                                    <SortableTableHeader<Student> label="Student ID" sortKey="studentId" sortConfig={sortConfig} onSort={handleSort} disabled={!!aiSearchResults} />
                                    <SortableTableHeader<Student> label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} disabled={!!aiSearchResults} />
                                    <SortableTableHeader<Student> label="Class" sortKey="class" sortConfig={sortConfig} onSort={handleSort} disabled={!!aiSearchResults} />
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardian Name</th>
                                    {aiSearchResults && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Reason</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedAndFilteredStudents.length > 0 ? (
                                    sortedAndFilteredStudents.map((student, index) => (
                                        <tr key={student.id} className={selectedStudentIds.includes(student.id) ? 'bg-stoneridge-gold/10' : ''}>
                                            <td className="p-4">
                                                <label htmlFor={`select-student-${index}`} className="sr-only">Select {student.name}</label>
                                                <input
                                                    id={`select-student-${index}`}
                                                    type="checkbox"
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={() => handleSelectOne(student.id)}
                                                    className="h-4 w-4 text-stoneridge-green border-gray-300 rounded focus:ring-stoneridge-gold"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.guardianName}</td>
                                            {aiSearchResults && <td className="px-6 py-4 whitespace-nowrap text-sm text-stoneridge-green italic">{student.matchReason}</td>}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={aiSearchResults ? 7 : 6} className="text-center py-10 text-gray-500">
                                            {isAiLoading ? 'AI is searching...' : (aiSearchResults && aiSearchResults.length === 0) ? 'AI found no matching students.' : students.length > 0 ? 'No students match your search.' : 'No students found.'}
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

export default StudentManager;
import React, { useState, useEffect } from 'react';
import type { AttendanceRecord, Student } from '../../types';
import { getAttendance, saveAttendance, getStudents } from '../../services/dataService';

const AttendanceManager: React.FC = () => {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('Year 7');
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setAttendance(getAttendance());
        setStudents(getStudents());
    }, []);

    const classList = [...new Set(students.map(s => s.class))];
    const studentsInClass = students.filter(s => s.class === selectedClass);

    const getAttendanceStatus = (studentId: string): AttendanceRecord['status'] | 'Not Marked' => {
        const record = attendance.find(a => a.studentId === studentId && a.date === today);
        return record ? record.status : 'Not Marked';
    };

    const handleMarkAttendance = (studentId: string, status: AttendanceRecord['status']) => {
        const existingRecordIndex = attendance.findIndex(a => a.studentId === studentId && a.date === today);
        let updatedAttendance;

        if (existingRecordIndex > -1) {
            updatedAttendance = attendance.map((rec, index) => index === existingRecordIndex ? { ...rec, status } : rec);
        } else {
            const newRecord: AttendanceRecord = { id: crypto.randomUUID(), studentId, date: today, status };
            updatedAttendance = [...attendance, newRecord];
        }
        setAttendance(updatedAttendance);
        saveAttendance(updatedAttendance);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Attendance ({today})</h3>
            <div className="mb-4">
                <label htmlFor="class-select" className="sr-only">Select Class</label>
                <select id="class-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-stoneridge-gold focus:ring-stoneridge-gold">
                    {classList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
             <ul className="bg-white divide-y divide-gray-200 rounded-lg border">
                {studentsInClass.map(student => {
                    const status = getAttendanceStatus(student.id);
                    return (
                        <li key={student.id} className="p-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{student.name}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleMarkAttendance(student.id, 'Present')} className={`px-3 py-1 text-sm rounded-full ${status === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Present</button>
                                <button onClick={() => handleMarkAttendance(student.id, 'Absent')} className={`px-3 py-1 text-sm rounded-full ${status === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Absent</button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AttendanceManager;
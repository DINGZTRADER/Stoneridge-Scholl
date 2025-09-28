
import React, { useMemo } from 'react';
import type { AttendanceRecord, Student } from '../../types';

interface AttendanceChartProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ students, attendance }) => {
  const data = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysAttendance = attendance.filter(a => a.date === today);
    
    const presentCount = todaysAttendance.filter(a => a.status === 'Present').length;
    const absentCount = todaysAttendance.filter(a => a.status === 'Absent').length;
    const totalStudents = students.length;
    const notMarkedCount = totalStudents > 0 ? totalStudents - presentCount - absentCount : 0;

    return {
      present: { count: presentCount, percentage: totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0 },
      absent: { count: absentCount, percentage: totalStudents > 0 ? (absentCount / totalStudents) * 100 : 0 },
      notMarked: { count: notMarkedCount, percentage: totalStudents > 0 ? (notMarkedCount / totalStudents) * 100 : 0 },
    };
  }, [students, attendance]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance Overview</h3>
      <div className="flex w-full h-8 rounded-full overflow-hidden">
         <div 
            className="bg-green-500" 
            style={{ width: `${data.present.percentage}%` }}
            title={`Present: ${data.present.count} (${data.present.percentage.toFixed(1)}%)`}
        />
         <div 
            className="bg-red-500" 
            style={{ width: `${data.absent.percentage}%` }}
            title={`Absent: ${data.absent.count} (${data.absent.percentage.toFixed(1)}%)`}
        />
         <div 
            className="bg-gray-300" 
            style={{ width: `${data.notMarked.percentage}%` }}
            title={`Not Marked: ${data.notMarked.count} (${data.notMarked.percentage.toFixed(1)}%)`}
        />
      </div>
      <div className="mt-4 flex justify-around text-sm">
        <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
            <span>Present ({data.present.count})</span>
        </div>
        <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
            <span>Absent ({data.absent.count})</span>
        </div>
        <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-gray-300 mr-2"></span>
            <span>Not Marked ({data.notMarked.count})</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;

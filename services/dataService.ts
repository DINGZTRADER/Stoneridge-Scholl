import type {
  Student,
  Teacher,
  Staff,
  Parent,
  Contractor,
  Application,
  Invoice,
  AttendanceRecord,
  TransportRoute,
  Broadcast,
} from '../types';
import { STORAGE_KEYS } from '../constants';

// Helper for localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item && item !== 'undefined') {
        return JSON.parse(item);
    }
    // If no item, set the default value in storage for next time
    saveToStorage(key, defaultValue);
    return defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

// Raw student data is now empty by default, to be populated by user import.
const rawStudentData: any[] = [];

// Transformer function to map raw data to the Student interface
export const transformStudentData = (rawData: any[]): Student[] => {
  return rawData.map(s => ({
    id: s.student_id || s.studentId,
    studentId: s.student_id || s.studentId,
    name: s.name,
    gender: s.gender,
    dateOfBirth: s.date_of_birth || s.dateOfBirth,
    class: s.class,
    stream: s.stream,
    admissionDate: s.admission_date || s.admissionDate,
    status: s.status,
    contacts: s.contacts,
    address: s.address,
    guardian: { parentId: s.guardian.parent_id || s.guardian.parentId },
    guardianName: s.guardianName || s.emergency_contacts?.[0]?.name || 'N/A',
    guardianContact: s.guardianContact || s.emergency_contacts?.[0]?.phone || 'N/A',
    medical: s.medical,
    emergencyContacts: s.emergency_contacts || s.emergencyContacts || [],
    fees: {
      balanceUgx: s.fees.balance_ugx || s.fees.balanceUgx,
      lastPaymentDate: s.fees.last_payment_date || s.fees.lastPaymentDate,
    },
    performance: {
      term: s.performance.term,
      year: s.performance.year,
      avgScore: s.performance.avg_score || s.performance.avgScore,
      rankStream: s.performance.rank_stream || s.performance.rankStream,
      comments: s.performance.comments,
    },
    subjectMarks: s.subject_marks || s.subjectMarks || {},
    attendance: {
      term: s.attendance.term,
      daysPresent: s.attendance.days_present || s.attendance.daysPresent,
      daysAbsent: s.attendance.days_absent || s.attendance.daysAbsent,
      lateCount: s.attendance.late_count || s.attendance.lateCount,
    },
    disciplineRecords: s.discipline_records || s.disciplineRecords || [],
    transport: s.transport,
    specialNeeds: s.special_needs || s.specialNeeds,
    clubs: s.clubs || [],
  }));
};

export const transformTeacherData = (rawData: any[]): Teacher[] => {
    return rawData.map(t => ({
        id: t.teacherId || t.teacher_id || crypto.randomUUID(),
        teacherId: t.teacherId || t.teacher_id,
        name: t.name,
        subject: t.subject,
        classAssigned: t.classAssigned || t.class_assigned,
        contact: t.contact,
    }));
};

export const transformStaffData = (rawData: any[]): Staff[] => {
    return rawData.map(s => ({
        id: s.staffId || s.staff_id || crypto.randomUUID(),
        staffId: s.staffId || s.staff_id,
        name: s.name,
        role: s.role,
        department: s.department,
        contact: s.contact,
    }));
};

export const transformParentData = (rawData: any[]): Parent[] => {
    return rawData.map(p => ({
        id: p.parentId || p.parent_id || crypto.randomUUID(),
        parentId: p.parentId || p.parent_id,
        name: p.name,
        childrenIds: p.childrenIds || p.children_ids || [],
        contact: p.contact,
    }));
};

export const transformContractorData = (rawData: any[]): Contractor[] => {
    return rawData.map(c => ({
        id: c.contractorId || c.contractor_id || crypto.randomUUID(),
        contractorId: c.contractorId || c.contractor_id,
        name: c.name,
        service: c.service,
        contact: c.contact,
    }));
};

const STUDENT_DATA = transformStudentData(rawStudentData);

// Mock Data Generators
const createApplications = (): Application[] => [
    { id: 'app1', applicantName: 'John Doe', applyingForClass: 'Year 7', guardianName: 'Jane Doe', guardianContact: '071-111-2222', status: 'Submitted' },
    { id: 'app2', applicantName: 'Emily White', applyingForClass: 'Year 7', guardianName: 'Mark White', guardianContact: '072-222-3333', status: 'In Review' },
    { id: 'app3', applicantName: 'Michael Green', applyingForClass: 'Year 8', guardianName: 'Sarah Green', guardianContact: '073-333-4444', status: 'Interview' },
    { id: 'app4', applicantName: 'Jessica Brown', applyingForClass: 'Year 8', guardianName: 'David Brown', guardianContact: '074-444-5555', status: 'Offered' },
    { id: 'app5', applicantName: 'Chris Black', applyingForClass: 'Year 9', guardianName: 'Laura Black', guardianContact: '075-555-6666', status: 'Enrolled' },
    { id: 'app6', applicantName: 'Olivia Grey', applyingForClass: 'Year 7', guardianName: 'Peter Grey', guardianContact: '076-666-7777', status: 'Rejected' },
];

const createInvoices = (): Invoice[] => [
    { id: 'inv1', studentId: 's1', studentName: 'Abebe Bikila', items: [{id: 'i1', description: 'Term 1 Fees', amount: 1500000}], totalAmount: 1500000, amountPaid: 1500000, dueDate: '2024-07-15', status: 'Paid', remindersSent: [] },
    { id: 'inv2', studentId: 's2', studentName: 'Fatuma Roba', items: [{id: 'i2', description: 'Term 1 Fees', amount: 1500000}], totalAmount: 1500000, amountPaid: 0, dueDate: '2024-08-30', status: 'Pending', remindersSent: [] },
    { id: 'inv3', studentId: 's3', studentName: 'Haile Gebrselassie', items: [{id: 'i3', description: 'Term 1 Fees', amount: 1600000}], totalAmount: 1600000, amountPaid: 800000, dueDate: '2024-06-30', status: 'Overdue', remindersSent: ['2024-07-05'] },
];

const createAttendance = (): AttendanceRecord[] => {
    const today = new Date().toISOString().split('T')[0];
    return [
        { id: 'att1', studentId: 'STU0001', date: today, status: 'Present' },
        { id: 'att2', studentId: 'STU0002', date: today, status: 'Absent' },
        { id: 'att3', studentId: 'STU0003', date: today, status: 'Present' },
        { id: 'att4', studentId: 'STU0004', date: today, status: 'Present' },
    ];
};

const createRoutes = (): TransportRoute[] => [
    { id: 'r1', routeName: 'Route A - Ggaba', driverName: 'James Okello', status: 'On Schedule', studentIds: ['STU0003', 'STU0009'] },
    { id: 'r2', routeName: 'Route B - Ntinda', driverName: 'Peter Mubiru', status: 'On Schedule', studentIds: ['STU0001', 'STU0002'] },
    { id: 'r3', routeName: 'Route C - Entebbe Rd', driverName: 'Maria Nakato', status: 'On Schedule', studentIds: ['STU0004', 'STU0006'] },
];

const createBroadcasts = (): Broadcast[] => [];

// Data Access Functions
export const getStudents = (): Student[] => getFromStorage(STORAGE_KEYS.STUDENTS, STUDENT_DATA);
export const saveStudents = (students: Student[]): void => saveToStorage(STORAGE_KEYS.STUDENTS, students);

export const getTeachers = (): Teacher[] => getFromStorage(STORAGE_KEYS.TEACHERS, []);
export const saveTeachers = (teachers: Teacher[]): void => saveToStorage(STORAGE_KEYS.TEACHERS, teachers);

export const getStaff = (): Staff[] => getFromStorage(STORAGE_KEYS.STAFF, []);
export const saveStaff = (staff: Staff[]): void => saveToStorage(STORAGE_KEYS.STAFF, staff);

export const getParents = (): Parent[] => getFromStorage(STORAGE_KEYS.PARENTS, []);
export const saveParents = (parents: Parent[]): void => saveToStorage(STORAGE_KEYS.PARENTS, parents);

export const getContractors = (): Contractor[] => getFromStorage(STORAGE_KEYS.CONTRACTORS, []);
export const saveContractors = (contractors: Contractor[]): void => saveToStorage(STORAGE_KEYS.CONTRACTORS, contractors);

export const getApplications = (): Application[] => getFromStorage(STORAGE_KEYS.APPLICATIONS, createApplications());
export const saveApplications = (applications: Application[]): void => saveToStorage(STORAGE_KEYS.APPLICATIONS, applications);

export const getInvoices = (): Invoice[] => getFromStorage(STORAGE_KEYS.INVOICES, createInvoices());
export const saveInvoices = (invoices: Invoice[]): void => saveToStorage(STORAGE_KEYS.INVOICES, invoices);

export const getAttendance = (): AttendanceRecord[] => getFromStorage(STORAGE_KEYS.ATTENDANCE, createAttendance());
export const saveAttendance = (attendance: AttendanceRecord[]): void => saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance);

export const getRoutes = (): TransportRoute[] => getFromStorage(STORAGE_KEYS.ROUTES, createRoutes());
export const saveRoutes = (routes: TransportRoute[]): void => saveToStorage(STORAGE_KEYS.ROUTES, routes);

export const getBroadcasts = (): Broadcast[] => getFromStorage(STORAGE_KEYS.BROADCASTS, createBroadcasts());
export const saveBroadcasts = (broadcasts: Broadcast[]): void => saveToStorage(STORAGE_KEYS.BROADCASTS, broadcasts);
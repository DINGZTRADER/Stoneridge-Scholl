// This file defines the core data structures and types for the application.

export enum Author {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  author: Author;
  text: string;
  isError?: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Student {
    id: string;
    studentId: string;
    name: string;
    gender: string;
    dateOfBirth: string;
    class: string;
    stream: string;
    admissionDate: string;
    status: 'Active' | 'Graduated' | 'Transferred';
    contacts: {
        phone: string;
        email: string;
    };
    address: {
        street: string;
        parish: string;
        division: string;
        city: string;
        country: string;
    };
    guardian: {
        parentId: string;
    };
    // Derived fields for UI convenience
    guardianName: string; 
    guardianContact: string;
    
    medical: {
        condition: string;
        notes: string;
        allergies: string;
    };
    emergencyContacts: {
        name: string;
        phone: string;
    }[];
    fees: {
        balanceUgx: number;
        lastPaymentDate: string;
    };
    performance: {
        term: string;
        year: number;
        avgScore: number;
        rankStream: number;
        comments: string;
    };
    subjectMarks: { [subject: string]: number };
    attendance: {
        term: string;
        daysPresent: number;
        daysAbsent: number;
        lateCount: number;
    };
    disciplineRecords: {
        date: string;
        issue: string;
        action: string;
    }[];
    transport: {
        route: string;
        pickupPoint?: string;
    };
    specialNeeds: string;
    clubs: string[];
    matchReason?: string;
}

export interface Teacher {
    id: string;
    teacherId: string;
    name: string;
    subject: string;
    classAssigned: string;
    contact: string;
}

export interface Staff {
    id: string;
    staffId: string;
    name: string;
    role: string;
    department: string;
    contact: string;
}

export interface Parent {
    id: string;
    parentId: string;
    name: string;
    childrenIds: string[];
    contact: string;
}

export interface Contractor {
    id: string;
    contractorId: string;
    name: string;
    service: string;
    contact: string;
}

export type ApplicationStatus = 'Submitted' | 'In Review' | 'Interview' | 'Offered' | 'Enrolled' | 'Rejected';
export const APPLICATION_STEPS: ApplicationStatus[] = ['Submitted', 'In Review', 'Interview', 'Offered', 'Enrolled'];

export interface Application {
    id: string;
    applicantName: string;
    applyingForClass: string;
    guardianName: string;
    guardianContact: string;
    status: ApplicationStatus;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface InvoiceItem {
    id: string;
    description: string;
    amount: number;
}

export interface Invoice {
    id: string;
    studentId: string;
    studentName: string;
    items: InvoiceItem[];
    totalAmount: number;
    amountPaid: number;
    dueDate: string;
    status: InvoiceStatus;
    remindersSent: string[]; // dates
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string;
    status: 'Present' | 'Absent';
}

export type RouteStatus = 'On Schedule' | 'Departed' | 'Arrived' | 'Delayed';

export interface TransportRoute {
    id: string;
    routeName: string;
    driverName: string;
    status: RouteStatus;
    studentIds: string[];
}

export type BroadcastTarget = 'All' | 'Pre-Primary' | 'P1-P4' | 'P5-P7' | string; // string for route names

export interface Broadcast {
    id: string;
    message: string;
    target: BroadcastTarget;
    sentDate: string;
}

// Generic types for reusable table sorting
export type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
    key: keyof T;
    direction: SortDirection;
}
import React, { useState, useMemo, useEffect } from 'react';
import type { Invoice, InvoiceStatus, Student, InvoiceItem } from '../../types';
import { getInvoices, saveInvoices, getStudents } from '../../services/dataService';

const InvoiceModal: React.FC<{ onSave: (invoice: Invoice) => void; onClose: () => void; }> = ({ onSave, onClose }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([{ description: '', amount: 0 }]);
    const [error, setError] = useState('');

    useEffect(() => {
        setStudents(getStudents());
    }, []);

    const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
        const newItems = [...items];
        const itemToUpdate = { ...newItems[index] };
        if (field === 'description') {
            itemToUpdate.description = value;
        } else if (field === 'amount') {
            itemToUpdate.amount = parseFloat(value) || 0;
        }
        newItems[index] = itemToUpdate;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { description: '', amount: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedStudentId || !dueDate || items.some(item => !item.description || item.amount <= 0)) {
            setError('Please select a student, set a due date, and ensure all items have a description and valid amount.');
            return;
        }
        const selectedStudent = students.find(s => s.id === selectedStudentId);
        if (!selectedStudent) {
            setError('Selected student not found.');
            return;
        }

        const newInvoice: Invoice = {
            id: crypto.randomUUID(),
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            items: items.map(item => ({ ...item, id: crypto.randomUUID() })),
            totalAmount,
            amountPaid: 0,
            dueDate,
            status: 'Pending',
            remindersSent: []
        };
        onSave(newInvoice);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Invoice</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student</label>
                            <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} required className="w-full p-2 border rounded mt-1 bg-white">
                                <option value="" disabled>Select a student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Due Date</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full p-2 border rounded mt-1"/>
                        </div>
                    </div>
                    
                    <hr/>

                    <h4 className="text-lg font-medium text-gray-700">Invoice Items</h4>
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" placeholder="Item Description (e.g., Tuition)" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} required className="w-2/3 p-2 border rounded" />
                                <input type="number" placeholder="Amount" value={item.amount || ''} onChange={e => handleItemChange(index, 'amount', e.target.value)} required className="w-1/3 p-2 border rounded" min="0" step="any" />
                                <button type="button" onClick={() => handleRemoveItem(index)} disabled={items.length <= 1} className="text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={handleAddItem} className="text-sm text-stoneridge-green font-medium">+ Add Item</button>
                    
                     <hr/>

                    <div className="text-right font-bold text-lg">Total: {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalAmount)}</div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-stoneridge-green text-white rounded">Save Invoice</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FeesManager: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<InvoiceStatus | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

    useEffect(() => {
        setInvoices(getInvoices());
    }, []);

    const filteredInvoices = useMemo(() => {
        const invoicesForTab = invoices.filter(inv => activeTab === 'All' || inv.status === activeTab);
        if (!searchTerm.trim()) {
            return invoicesForTab;
        }
        return invoicesForTab.filter(inv =>
            inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [invoices, searchTerm, activeTab]);

    const handleStatusChange = (id: string, newStatus: InvoiceStatus) => {
        const updatedInvoices = invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv);
        setInvoices(updatedInvoices);
        saveInvoices(updatedInvoices);
    };

    const handleSaveInvoice = (newInvoice: Invoice) => {
        const updatedInvoices = [newInvoice, ...invoices];
        setInvoices(updatedInvoices);
        saveInvoices(updatedInvoices);
        setIsModalOpen(false);
    };

    const toggleDetails = (invoiceId: string) => {
        setExpandedInvoiceId(prevId => (prevId === invoiceId ? null : invoiceId));
    };

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(amount);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <div className="sm:flex sm:items-center sm:justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Fee Management</h3>
                <button onClick={() => setIsModalOpen(true)} className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800">
                    Add New Invoice
                </button>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {(['All', 'Paid', 'Pending', 'Overdue'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`${ activeTab === tab ? 'border-stoneridge-gold text-stoneridge-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            <input type="text" placeholder="Search by student name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 my-6 border border-gray-300 rounded-md" />

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredInvoices.map(inv => (
                            <React.Fragment key={inv.id}>
                                <tr className="border-b border-gray-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{inv.studentName}</div>
                                        <div className="text-sm text-gray-500">{inv.studentId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div>{formatCurrency(inv.totalAmount - inv.amountPaid)}</div>
                                        <div className="text-xs text-gray-500">Total: {formatCurrency(inv.totalAmount)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.dueDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={inv.status}
                                            onChange={(e) => handleStatusChange(inv.id, e.target.value as InvoiceStatus)}
                                            className={`text-xs rounded border-gray-300 shadow-sm focus:border-stoneridge-gold focus:ring-stoneridge-gold ${getStatusColor(inv.status)}`}
                                        >
                                            <option value="Paid">Paid</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Overdue">Overdue</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => toggleDetails(inv.id)} className="text-stoneridge-gold hover:text-yellow-600 font-medium">
                                            {expandedInvoiceId === inv.id ? 'Hide' : 'View'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedInvoiceId === inv.id && (
                                    <tr className="border-b border-gray-200">
                                        <td colSpan={5} className="p-4 bg-gray-50">
                                            <div className="px-6">
                                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Invoice Items:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    {inv.items.map(item => (
                                                        <li key={item.id} className="flex justify-between">
                                                            <span>{item.description}</span>
                                                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <InvoiceModal onSave={handleSaveInvoice} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default FeesManager;
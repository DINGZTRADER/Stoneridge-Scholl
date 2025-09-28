import React, { useState, useEffect, useMemo } from 'react';
import { getStaff, saveStaff, transformStaffData } from '../services/dataService';
import type { Staff, SortConfig, SortDirection } from '../types';
import FileUpload from './shared/FileUpload';
import SortableTableHeader from './shared/SortableTableHeader';

type ImportStatus = { message: string; type: 'success' | 'error' };

const StaffManager: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<Staff> | null>({ key: 'name', direction: 'ascending' });
    
    useEffect(() => {
        setStaff(getStaff());
    }, []);

    const handleStaffImport = (data: any[]) => {
        setImportStatus(null);
        try {
            const newStaff = transformStaffData(data);
            const existingStaffIds = new Set(staff.map(s => s.id));
            const uniqueNewStaff = newStaff.filter(s => s.id && !existingStaffIds.has(s.id));
            
            const duplicates = newStaff.length - uniqueNewStaff.length;

            if (uniqueNewStaff.length > 0) {
                const updatedStaff = [...staff, ...uniqueNewStaff];
                setStaff(updatedStaff);
                saveStaff(updatedStaff);
                 setImportStatus({
                    message: `Successfully imported ${uniqueNewStaff.length} new staff members. ${duplicates > 0 ? `${duplicates} duplicate(s) were ignored.` : ''}`,
                    type: 'success'
                });
            } else {
                 setImportStatus({
                    message: `Import complete. No new staff members were added. Found ${duplicates} duplicate(s).`,
                    type: 'success'
                });
            }
        } catch (err) {
            handleImportError("The imported file structure is incorrect for staff data.");
        }
    };
    
    const handleImportError = (message: string) => {
        setImportStatus({ message, type: 'error' });
    };

    const handleSort = (key: keyof Staff) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredStaff = useMemo(() => {
        let filtered: Staff[] = [...staff];

        if (searchTerm.trim()) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = staff.filter(member => 
                Object.values(member).some(value => 
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
    }, [staff, searchTerm, sortConfig]);

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-stoneridge-green">Staff Management</h2>
                    <FileUpload label="Import Staff" onFileUpload={handleStaffImport} onError={handleImportError} />
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
                        placeholder="Search staff..."
                        className="w-full max-w-sm p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
                        aria-label="Search staff"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <SortableTableHeader<Staff> label="Staff ID" sortKey="staffId" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Staff> label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Staff> label="Role" sortKey="role" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Staff> label="Department" sortKey="department" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Staff> label="Contact" sortKey="contact" sortConfig={sortConfig} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedAndFilteredStaff.length > 0 ? (
                                    sortedAndFilteredStaff.map(member => (
                                        <tr key={member.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.staffId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.department}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.contact}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-gray-500">
                                            {staff.length > 0 ? 'No staff members match your search.' : 'No staff members found. Use the "Import Staff" button to add data.'}
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

export default StaffManager;
import React, { useState, useEffect, useMemo } from 'react';
import { getParents, saveParents, transformParentData } from '../services/dataService';
import type { Parent, SortConfig, SortDirection } from '../types';
import FileUpload from './shared/FileUpload';
import SortableTableHeader from './shared/SortableTableHeader';

type ImportStatus = { message: string; type: 'success' | 'error' };

const ParentManager: React.FC = () => {
    const [parents, setParents] = useState<Parent[]>([]);
    const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<Parent> | null>({ key: 'name', direction: 'ascending' });
    
    useEffect(() => {
        setParents(getParents());
    }, []);

    const handleParentImport = (data: any[]) => {
        setImportStatus(null);
        try {
            const newParents = transformParentData(data);
            const existingParentIds = new Set(parents.map(p => p.id));
            const uniqueNewParents = newParents.filter(p => p.id && !existingParentIds.has(p.id));
            
            const duplicates = newParents.length - uniqueNewParents.length;

            if (uniqueNewParents.length > 0) {
                const updatedParents = [...parents, ...uniqueNewParents];
                setParents(updatedParents);
                saveParents(updatedParents);
                 setImportStatus({
                    message: `Successfully imported ${uniqueNewParents.length} new parents. ${duplicates > 0 ? `${duplicates} duplicate(s) were ignored.` : ''}`,
                    type: 'success'
                });
            } else {
                 setImportStatus({
                    message: `Import complete. No new parents were added. Found ${duplicates} duplicate(s).`,
                    type: 'success'
                });
            }
        } catch (err) {
            handleImportError("The imported file structure is incorrect for parent data.");
        }
    };
    
    const handleImportError = (message: string) => {
        setImportStatus({ message, type: 'error' });
    };

    const handleSort = (key: keyof Parent) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredParents = useMemo(() => {
        let filtered: Parent[] = [...parents];

        if (searchTerm.trim()) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = parents.filter(parent => 
                Object.values(parent).some(value => 
                    String(value).toLowerCase().includes(lowercasedFilter)
                )
            );
        }

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (Array.isArray(aValue) && Array.isArray(bValue)) {
                     return sortConfig.direction === 'ascending' ? aValue.length - bValue.length : bValue.length - aValue.length;
                }
                
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        return filtered;
    }, [parents, searchTerm, sortConfig]);

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-stoneridge-green">Parent/Guardian Management</h2>
                    <FileUpload label="Import Parents" onFileUpload={handleParentImport} onError={handleImportError} />
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
                        placeholder="Search parents..."
                        className="w-full max-w-sm p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
                        aria-label="Search parents"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <SortableTableHeader<Parent> label="Parent ID" sortKey="parentId" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Parent> label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Parent> label="Children IDs" sortKey="childrenIds" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Parent> label="Contact" sortKey="contact" sortConfig={sortConfig} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedAndFilteredParents.length > 0 ? (
                                    sortedAndFilteredParents.map(parent => (
                                        <tr key={parent.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parent.parentId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{parent.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parent.childrenIds.join(', ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parent.contact}</td>
                                        </tr>
                                    ))
                                ) : (
                                     <tr>
                                        <td colSpan={4} className="text-center py-10 text-gray-500">
                                            {parents.length > 0 ? 'No parents match your search.' : 'No parents found. Use the "Import Parents" button to add data.'}
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

export default ParentManager;
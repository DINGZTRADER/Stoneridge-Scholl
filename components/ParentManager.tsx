import React, { useState, useEffect, useMemo } from 'react';
import { getParents, saveParents, transformParentData } from '../services/dataService';
import type { Parent, SortConfig, SortDirection } from '../types';
import ImportModal from './shared/FileUpload';
import SortableTableHeader from './shared/SortableTableHeader';

const ParentManager: React.FC = () => {
    const [parents, setParents] = useState<Parent[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<Parent> | null>({ key: 'name', direction: 'ascending' });
    
    useEffect(() => {
        setParents(getParents());
    }, []);

    const handleParentImport = (data: any[]) => {
        try {
            const newParents = transformParentData(data);
            const existingParentIds = new Set(parents.map(p => p.id));
            const uniqueNewParents = newParents.filter(p => p.id && !existingParentIds.has(p.id));

            if (uniqueNewParents.length > 0) {
                const updatedParents = [...parents, ...uniqueNewParents];
                setParents(updatedParents);
                saveParents(updatedParents);
            }
        } catch (err) {
            console.error("Failed to transform parent data:", err);
        }
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
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={handleParentImport}
                expectedStructure="array"
                title="Import Parent/Guardian Data"
                description={
                    <p>Upload a JSON file containing an array of parent records. The system will add new parents and ignore any duplicates.</p>
                }
            />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-stoneridge-green">Parent/Guardian Management</h2>
                    <button onClick={() => setIsImportModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800">
                       Import Parents
                    </button>
                </div>

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
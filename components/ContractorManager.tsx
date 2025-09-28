import React, { useState, useEffect, useMemo } from 'react';
import { getContractors, saveContractors, transformContractorData } from '../services/dataService';
import type { Contractor, SortConfig, SortDirection } from '../types';
import ImportModal from './shared/FileUpload';
import SortableTableHeader from './shared/SortableTableHeader';

const ContractorManager: React.FC = () => {
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<Contractor> | null>({ key: 'name', direction: 'ascending' });
    
    useEffect(() => {
        setContractors(getContractors());
    }, []);

    const handleContractorImport = (data: any[]) => {
        try {
            const newContractors = transformContractorData(data);
            const existingContractorIds = new Set(contractors.map(c => c.id));
            const uniqueNewContractors = newContractors.filter(c => c.id && !existingContractorIds.has(c.id));

            if (uniqueNewContractors.length > 0) {
                const updatedContractors = [...contractors, ...uniqueNewContractors];
                setContractors(updatedContractors);
                saveContractors(updatedContractors);
            }
        } catch (err) {
            console.error("Failed to transform contractor data:", err);
        }
    };
    
    const handleSort = (key: keyof Contractor) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredContractors = useMemo(() => {
        let filtered: Contractor[] = [...contractors];

        if (searchTerm.trim()) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = contractors.filter(contractor => 
                Object.values(contractor).some(value => 
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
    }, [contractors, searchTerm, sortConfig]);


    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={handleContractorImport}
                expectedStructure="array"
                title="Import Contractor Data"
                description={
                    <p>Upload a JSON file containing an array of contractor records. The system will add new contractors and ignore any duplicates.</p>
                }
            />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-stoneridge-green">Contractor Management</h2>
                    <button onClick={() => setIsImportModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800">
                       Import Contractors
                    </button>
                </div>
                
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search contractors..."
                        className="w-full max-w-sm p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
                        aria-label="Search contractors"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <SortableTableHeader<Contractor> label="Contractor ID" sortKey="contractorId" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Contractor> label="Company/Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Contractor> label="Service" sortKey="service" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableTableHeader<Contractor> label="Contact" sortKey="contact" sortConfig={sortConfig} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedAndFilteredContractors.length > 0 ? (
                                    sortedAndFilteredContractors.map(contractor => (
                                        <tr key={contractor.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contractor.contractorId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{contractor.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contractor.service}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contractor.contact}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-gray-500">
                                            {contractors.length > 0 ? 'No contractors match your search.' : 'No contractors found. Use the "Import Contractors" button to add data.'}
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

export default ContractorManager;
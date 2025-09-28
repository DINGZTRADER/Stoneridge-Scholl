import React, { useState, useCallback } from 'react';
import ImportModal from './shared/FileUpload';

const DATA_KEYS = [
    'stoneridge-students',
    'stoneridge-teachers',
    'stoneridge-staff',
    'stoneridge-parents',
    'stoneridge-contractors',
    'stoneridge-applications',
    'stoneridge-invoices',
    'stoneridge-attendance',
    'stoneridge-routes',
    'stoneridge-broadcasts',
    'stoneridge-tasks'
];

const DataImportManager: React.FC = () => {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const handleFullImport = useCallback((data: { [key: string]: any[] }) => {
        try {
            // Overwrite data for all keys present in the imported file
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
            }
            setStatusMessage({ type: 'success', message: 'Successfully imported data. The application will now reload to apply the changes.'});
            
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (e) {
            const storageError = e instanceof Error ? e.message : 'An unknown storage error occurred.';
            setStatusMessage({ type: 'error', message: `Data processed, but failed to save: ${storageError}. This is likely due to browser storage limits.`});
        }
    }, []);

    const handleExport = () => {
        setStatusMessage(null);
        try {
            const allData: { [key: string]: any } = {};
            let hasData = false;

            DATA_KEYS.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    allData[key] = JSON.parse(item);
                    hasData = true;
                }
            });
            
            if (!hasData) {
                setStatusMessage({ type: 'error', message: "No data found to export."});
                return;
            }

            const jsonString = JSON.stringify(allData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            const date = new Date().toISOString().split('T')[0];
            a.download = `stoneridge-backup-${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setStatusMessage({ type: 'success', message: "Data successfully exported."});
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setStatusMessage({ type: 'error', message: `Failed to export data. Error: ${errorMessage}`});
        }
    };


    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-100">
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={handleFullImport}
                expectedStructure="object_with_stoneridge_keys"
                title="Import Full Database Backup"
                description={
                    <>
                        <p>
                           Use this tool to restore the application from a full backup file (e.g., <code>stoneridge-backup-2024-08-15.json</code>).
                           This will overwrite all existing data for the tables found within the file.
                        </p>
                        <p className="mt-2 text-sm">
                           <span className="font-semibold">Note:</span> To import a single list (like only students), navigate to the specific management page (e.g., "Students" in the Directory) and use the "Import" button there.
                        </p>
                    </>
                }
                useWorker={true}
            />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-stoneridge-green mb-6">Import & Export Data</h2>
                
                {statusMessage && (
                    <div className={`p-4 mb-6 rounded-md text-sm ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {statusMessage.message}
                    </div>
                )}
                
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h3 className="text-xl font-bold text-stoneridge-green mb-4">Import Full Database Backup</h3>
                    <div className="space-y-4">
                         <p className="text-gray-600">
                            This powerful tool replaces all existing application data with the content from your backup file.
                            This is ideal for restoring the application to a previous state or setting it up on a new computer.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stoneridge-green"
                            >
                                Import from Backup...
                            </button>
                        </div>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-stoneridge-green mb-4">Export Full Database Backup</h3>
                    <div className="space-y-4">
                         <p className="text-gray-600">
                           Create a complete backup of all school data. This downloads a single JSON file containing students, staff, invoices, and all other records. It is highly recommended to perform regular backups and store the file safely.
                        </p>
                        <div className="flex justify-end">
                             <button
                                onClick={handleExport}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stoneridge-gold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stoneridge-gold"
                            >
                                Export All Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataImportManager;
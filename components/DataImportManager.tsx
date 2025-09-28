import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';
import Spinner from './shared/Spinner';

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
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const processFile = (selectedFile: File | null) => {
        setFile(null); // Reset previous file
        setError(null);
        setSuccess(null);
        setWarning(null);

        if (!selectedFile) return;

        if (selectedFile.type !== 'application/json') {
            setError('Invalid file type. Please upload a JSON file.');
            return;
        }

        // Add a friendly warning for large files, without blocking the upload
        if (selectedFile.size > 10 * 1024 * 1024) { // 10 MB warning threshold
            setWarning('Warning: This file is large. The import may take a moment and could fail if it exceeds browser storage limits (typically 5-10MB).');
        }

        setFile(selectedFile);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFile(e.target.files?.[0] || null);
        e.target.value = ''; // Allow re-selecting the same file
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        processFile(e.dataTransfer.files?.[0] || null);
    };

    const handleImport = useCallback(() => {
        if (!file) {
            setError('Please select a file to import.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Create a new worker to process the file off the main thread
        const worker = new Worker(new URL('../services/importWorker.ts', import.meta.url), { type: 'module' });

        worker.onmessage = (event: MessageEvent<{ success: boolean; data?: any; importedKeysCount?: number; error?: string }>) => {
            const { success, data, importedKeysCount, error } = event.data;
            if (success && data) {
                try {
                    // This part still runs on the main thread and can be slow for huge data, but parsing is done.
                    // The main risk here is exceeding localStorage quota.
                    for (const key in data) {
                        if (Object.prototype.hasOwnProperty.call(data, key)) {
                            localStorage.setItem(key, JSON.stringify(data[key]));
                        }
                    }
                    setSuccess(`Successfully imported data for ${importedKeysCount} table(s). The application will now reload to apply the changes.`);
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } catch (e) {
                    const storageError = e instanceof Error ? e.message : 'An unknown storage error occurred.';
                    setError(`Data processed, but failed to save: ${storageError}. This is likely due to browser storage limits.`);
                    setFile(null);
                }
            } else {
                setError(error || 'An unknown worker error occurred.');
                setFile(null);
            }
            setIsLoading(false);
            worker.terminate();
        };
        
        worker.onerror = (err) => {
            setError(`An unexpected worker error occurred: ${err.message}`);
            setIsLoading(false);
            worker.terminate();
        };

        // Send the file to the worker
        worker.postMessage(file);

    }, [file]);

    const handleExport = () => {
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
                setError("No data found to export.");
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
            setSuccess("Data successfully exported.");
        } catch (err) {
            setError(`Failed to export data. Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };


    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-100">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-stoneridge-green mb-6">Import & Export Data</h2>
                
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h3 className="text-xl font-bold text-stoneridge-green mb-4">Import Full Database Backup</h3>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                           Use this tool to restore the application from a full backup file (e.g., `stoneridge-backup-2024-08-15.json`). This will overwrite all existing data for the tables found within the file.
                           <br />
                           <span className="font-semibold text-sm">Note:</span> To import a single list (like only students), navigate to the specific management page (e.g., "Students" in the Directory) and use the "Import" button there.
                        </p>

                        <label 
                            className={`relative flex flex-col justify-center items-center w-full h-48 px-4 transition bg-white border-2 ${isDragging ? 'border-stoneridge-gold' : 'border-gray-300'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            htmlFor="file-upload"
                        >
                            <div className="text-center">
                                <UploadIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                                <p className="font-medium text-gray-600 mb-3">
                                    Drag & drop your backup file here, or click the button.
                                </p>
                                <div 
                                    className="inline-block px-4 py-2 bg-stoneridge-gold text-white rounded-md text-sm font-medium hover:bg-yellow-600"
                                >
                                    Select Backup File
                                </div>
                            </div>
                            <input id="file-upload" type="file" name="file_upload" className="hidden" accept="application/json" onChange={handleFileChange} />
                        </label>
                        
                        {file && (
                            <div className="mt-2">
                                <p className="font-medium text-gray-600 text-center">
                                    Selected File: <span className="text-stoneridge-green font-bold">{file.name}</span>
                                </p>
                            </div>
                        )}
                        
                        {warning && (
                            <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md text-sm" role="alert">
                                {warning}
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm" role="alert">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm" role="alert">
                                {success}
                            </div>
                        )}
                        
                        <div className="flex justify-end">
                            <button
                                onClick={handleImport}
                                disabled={!file || isLoading || !!success}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stoneridge-green disabled:bg-gray-400 min-w-[150px]"
                            >
                                {isLoading ? <Spinner /> : 'Import Data'}
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

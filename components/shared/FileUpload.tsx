import React, { useState, useCallback } from 'react';
import type { ExpectedStructure } from '../../services/importWorker';
import Spinner from './Spinner';
import UploadIcon from '../icons/UploadIcon';
import XIcon from '../icons/XIcon';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: (data: any) => void;
    expectedStructure: ExpectedStructure;
    title: string;
    description: React.ReactNode;
    useWorker?: boolean;
}

const ImportModal: React.FC<ImportModalProps> = ({
    isOpen,
    onClose,
    onImportSuccess,
    expectedStructure,
    title,
    description,
    useWorker = false,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setFile(null);
        setIsLoading(false);
        setError(null);
    }, []);

    const handleClose = useCallback(() => {
        resetState();
        onClose();
    }, [resetState, onClose]);

    const handleFileProcessing = useCallback((selectedFile: File) => {
        setError(null);
        if (selectedFile.type !== 'application/json') {
            setError('Invalid file type. Please upload a JSON file.');
            return;
        }
        setFile(selectedFile);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFileProcessing(e.target.files[0]);
        }
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileProcessing(e.dataTransfer.files[0]);
        }
    };

    const handleImport = useCallback(() => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        const worker = new Worker('/services/importWorker.ts', { type: 'module' });

        worker.onmessage = (event: MessageEvent<{ success: boolean; data?: any; error?: string }>) => {
            setIsLoading(false);
            if (event.data.success) {
                onImportSuccess(event.data.data);
                handleClose();
            } else {
                setError(event.data.error || 'An unknown worker error occurred.');
            }
            worker.terminate();
        };

        worker.onerror = (err) => {
            setIsLoading(false);
            setError(`An unexpected error occurred: ${err.message}`);
            worker.terminate();
        };

        worker.postMessage({ file, expectedStructure });

    }, [file, expectedStructure, onImportSuccess, handleClose]);


    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-stoneridge-green mb-2">{title}</h3>
                <div className="prose prose-sm max-w-none text-gray-600 mb-6">{description}</div>

                <label
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                    className={`relative flex flex-col justify-center items-center w-full h-48 px-4 transition bg-white border-2 ${isDragging ? 'border-stoneridge-gold' : 'border-gray-300'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
                    htmlFor="modal-file-upload"
                >
                    <div className="text-center">
                        <UploadIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                        <p className="font-medium text-gray-600">
                            {file ? `Selected: ${file.name}` : 'Drag & drop your JSON file here, or click to select'}
                        </p>
                    </div>
                    <input id="modal-file-upload" type="file" className="hidden" accept="application/json" onChange={handleFileChange} />
                </label>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm" role="alert">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={handleClose} type="button" className="px-5 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={handleImport} disabled={!file || isLoading} type="button" className="px-5 py-2 bg-stoneridge-green text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:bg-gray-400 min-w-[120px] flex justify-center">
                        {isLoading ? <Spinner /> : 'Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
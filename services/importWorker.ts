// This worker handles the parsing of large JSON files in a separate thread
// to avoid blocking the main UI thread and keeping the application responsive.

export type ExpectedStructure = 'array' | 'object_with_stoneridge_keys';

self.onmessage = (event: MessageEvent<{ file: File, expectedStructure: ExpectedStructure }>) => {
    const { file, expectedStructure } = event.data;

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                throw new Error('Could not read file content.');
            }
            const data = JSON.parse(text);

            // Dynamic validation based on the expected structure
            if (expectedStructure === 'array') {
                if (!Array.isArray(data)) {
                    throw new Error('Invalid JSON structure. Expected a file containing an array of records.');
                }
            } else if (expectedStructure === 'object_with_stoneridge_keys') {
                if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                     throw new Error('Invalid JSON structure. The backup file should contain an object with keys for each data table (e.g., "stoneridge-students").');
                }
                const validKeys = Object.keys(data).filter(key => key.startsWith('stoneridge-'));
                if (validKeys.length === 0) {
                     throw new Error('The JSON file does not contain any recognizable data tables. Keys must start with "stoneridge-".');
                }
            }
            
            postMessage({ success: true, data });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during parsing.';
            postMessage({ success: false, error: `Import failed: ${errorMessage}` });
        }
    };

    reader.onerror = () => {
        postMessage({ success: false, error: 'Failed to read the file.' });
    };

    reader.readAsText(file);
};

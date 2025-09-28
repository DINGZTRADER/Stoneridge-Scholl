// This worker handles the parsing of large JSON files in a separate thread
// to avoid blocking the main UI thread and keeping the application responsive.

self.onmessage = (event: MessageEvent<File>) => {
    const file = event.data;

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                throw new Error('Could not read file content.');
            }
            const data = JSON.parse(text);

            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                 throw new Error('Invalid JSON format. The file should contain an object with keys matching the data tables (e.g., "stoneridge-students").');
            }
            
            // A simple validation to see if it looks like our data
            const validKeys = Object.keys(data).filter(key => key.startsWith('stoneridge-'));
            if (validKeys.length === 0) {
                 throw new Error('The JSON file does not contain any recognizable data tables. Keys should start with "stoneridge-".');
            }
            
            // The worker's job is just to parse. The main thread will save.
            postMessage({ success: true, data: data, importedKeysCount: validKeys.length });

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
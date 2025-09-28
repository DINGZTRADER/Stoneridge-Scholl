import React from 'react';

const ManualSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-stoneridge-green mb-4 pb-2 border-b-2 border-stoneridge-gold">{title}</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
            {children}
        </div>
    </section>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
        <code>{children}</code>
    </pre>
);

const DeploymentGuide: React.FC = () => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-stoneridge-green">Installation Guide</h1>
                    <p className="text-lg text-gray-500 mt-2">Deploying the agent in your school environment.</p>
                </header>
                
                <ManualSection title="How to 'Install' the Application">
                    <p>
                        This is a modern, browser-based application. There is no complex installation process. "Installing" it simply means making the application files accessible to the right people.
                    </p>
                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Method A: For a Single Computer</h3>
                     <p>This is the simplest method, perfect for a single administrator (e.g., on the Head Teacher's office computer).</p>
                    <ol>
                        <li>Save the entire application folder (containing <strong>index.html</strong> and other files) to a location on the computer, like the Desktop or Documents folder.</li>
                        <li>To run the agent, simply open the folder and double-click the <strong>index.html</strong> file. It will open in your default web browser (like Chrome, Firefox, or Edge).</li>
                    </ol>
                     <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 mt-4">
                        <p className="font-bold">Important Data Note:</p>
                        <p>All data you import is stored directly within the browser on this specific computer. It is not stored online.</p>
                    </div>

                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Method B: For Multiple Users on a School Network</h3>
                    <p>To allow multiple staff members to access the agent from their own computers on the school's local network, your IT person can do the following:</p>
                     <ol>
                        <li>Place the entire application folder onto a shared school server.</li>
                        <li>Provide staff with a direct link to the <strong>index.html</strong> file on that server.</li>
                    </ol>
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 mt-4">
                        <p className="font-bold">Critical Limitation:</p>
                        <p>With this setup, each user's computer will store its own separate copy of the data. The data is <strong>not shared or synchronized</strong> between users. For a collaborative, multi-user experience, a dedicated backend server would be required.</p>
                    </div>
                </ManualSection>

                <ManualSection title="Step-by-Step: Integrating Your School Data">
                    <p>The agent's power comes from your data. You will need to convert your existing records (likely in spreadsheets) into the JSON format the application requires.</p>

                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Step 1: Prepare Your Spreadsheet</h3>
                    <p>Open your student data in a program like Microsoft Excel or Google Sheets. Ensure your column headers are simple and clear. For example:</p>
                    <img src="https://i.imgur.com/8Q1qK2w.png" alt="Sample spreadsheet layout" className="rounded-md border shadow-sm my-4" />


                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Step 2: Export as CSV</h3>
                     <p>The easiest way to convert to JSON is by first exporting your spreadsheet as a CSV (Comma-Separated Values) file. In Excel or Google Sheets, go to <strong>File &gt; Download &gt; Comma-separated values (.csv)</strong>.</p>
                    
                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Step 3: Convert CSV to JSON</h3>
                    <p>Use a free online tool to convert your CSV file into JSON. Search for "CSV to JSON converter" online. These tools will give you a "JSON Array" output.</p>
                    <p>After converting, the data from the spreadsheet above will look like this. This is the format you need to import into the application.</p>
                    <CodeBlock>{`[
  {
    "student_id": "STU0001",
    "name": "Abebe Bikila",
    "class": "Year 7",
    "gender": "Male",
    ...
  },
  {
    "student_id": "STU0002",
    "name": "Fatuma Roba",
    "class": "Year 8",
    "gender": "Female",
    ...
  }
]`}</CodeBlock>
                    <p className="mt-4">Save this output as a new file, for example, <code>students-to-import.json</code>.</p>


                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Step 4: Import into the Agent</h3>
                    <p>
                        Now you can import the JSON file you created. Navigate to the <strong>Students</strong> page in the agent and click the <strong>"Import Students"</strong> button to upload your file.
                    </p>
                    <p>
                        Repeat this process for your Teachers, Staff, Parents, and Contractors data. For details on the different import methods, please see the <strong>User Manual</strong>.
                    </p>
                </ManualSection>

                 <ManualSection title="Data Backup and Safety">
                    <p>Because all data is stored in your browser, it is <strong>critical</strong> that you perform regular backups.</p>
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 mt-4">
                        <p className="font-bold">Warning:</p>
                        <p>Clearing your browser's history, cache, or "site data" may permanently delete all the data you have imported into the agent. Backups are your only safeguard.</p>
                    </div>
                     <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">How to Back Up Your Data</h3>
                     <ol>
                        <li>Navigate to the <strong>"Data Import/Export"</strong> page from the sidebar.</li>
                        <li>Under the "Export Database" section, click the <strong>"Export All Data"</strong> button.</li>
                        <li>A file named <code>stoneridge-backup-[date].json</code> will be downloaded to your computer.</li>
                        <li>Store this file in a safe place. We recommend performing a backup at least once a week.</li>
                     </ol>
                      <p>This backup file can be used with the "Import Database" function on the same page to restore all your data if needed.</p>
                </ManualSection>
            </div>
        </div>
    );
};

export default DeploymentGuide;

import React from 'react';

const ManualSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-stoneridge-green mb-4 pb-2 border-b-2 border-stoneridge-gold">{title}</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
            {children}
        </div>
    </section>
);

const UserManual: React.FC = () => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-stoneridge-green">Administrative Agent User Manual</h1>
                    <p className="text-lg text-gray-500 mt-2">Your guide to managing The Stoneridge School's AI assistant.</p>
                </header>
                
                <ManualSection title="Welcome to the Administrative Agent">
                    <p>
                        This AI-powered agent is designed to streamline school administration. It can help you answer questions, draft communications, manage school operations, and analyze data. This manual will guide you through its key features.
                    </p>
                </ManualSection>

                <ManualSection title="Getting Started: Data Management">
                    <p>
                        The agent relies on school data to function effectively. The first and most important step is to import your data. The application starts with empty data tables for students, teachers, parents, etc., ready for you to populate.
                    </p>
                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Method 1: Importing Individual Lists</h3>
                    <p>
                        This is the best method for adding or updating a specific category of data, like a new list of teachers.
                    </p>
                    <ul>
                        <li>Navigate to the desired management page from the sidebar (e.g., "Students", "Teachers", "Staff").</li>
                        <li>Click the <strong>"Import [Category]"</strong> button at the top right (e.g., "Import Students").</li>
                        <li>Select a JSON file from your computer.</li>
                    </ul>
                    <p className="mt-4">
                        <strong>Required File Format:</strong> The JSON file for this method <strong>must</strong> be an array of objects. For example, a teacher import file should look like this:
                    </p>
                    <pre className="bg-gray-100 p-3 rounded-md text-sm"><code>{`[
  { "teacherId": "T001", "name": "John Doe", "subject": "Mathematics", ... },
  { "teacherId": "T002", "name": "Jane Smith", "subject": "English", ... }
]`}</code></pre>

                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Method 2: Importing a Full Backup</h3>
                     <p>
                        Use the <strong>"Data Import"</strong> page to upload a complete database backup. This is useful for restoring the application's state or migrating from another system. This will overwrite all data for the tables included in your file.
                    </p>
                    <p className="mt-4">
                        <strong>Required File Format:</strong> The JSON file for a full backup <strong>must</strong> be an object where each key corresponds to a data table.
                    </p>
                    <pre className="bg-gray-100 p-3 rounded-md text-sm"><code>{`{
  "stoneridge-students": [ { "studentId": "S001", ... }, ... ],
  "stoneridge-teachers": [ { "teacherId": "T001", ... }, ... ],
  "stoneridge-staff": [ { "staffId": "ST01", ... }, ... ],
  "stoneridge-parents": [ ... ],
  "stoneridge-contractors": [ ... ]
}`}</code></pre>
                </ManualSection>

                <ManualSection title="Core Features">
                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">Agent Chat</h3>
                    <p>The primary interface for asking questions. You can ask about school policies, student information (once imported), or general knowledge questions.</p>

                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">AI Tools</h3>
                    <p>These tools use AI to help you generate content:</p>
                    <ul>
                        <li><strong>Email Drafter:</strong> Draft professional emails for various school communications.</li>
                        <li><strong>Announcement Creator:</strong> Create engaging announcements for events and news.</li>
                        <li><strong>Activity Planner:</strong> Get creative ideas and structured plans for school activities.</li>
                    </ul>
                     
                    <h3 className="text-xl font-semibold text-stoneridge-green mt-6 mb-2">School Operations Dashboard</h3>
                    <p>Provides a high-level overview of key school metrics. You can manage admissions, fees, attendance, transport, and send WhatsApp broadcasts from this central hub.</p>
                </ManualSection>

                 <ManualSection title="Advanced Feature: AI Student Search">
                    <p>
                        On the "Students" management page, the search bar is powered by AI. Instead of just searching by name or ID, you can use natural language to make complex queries.
                    </p>
                    <p><strong>Examples of AI Search queries:</strong></p>
                    <ul>
                        <li>"Find students in Year 7 with a fee balance greater than 500,000 UGX"</li>
                        <li>"Show me students who are in the debate club and have an average score above 85"</li>
                        <li>"Which students have a medical condition of asthma?"</li>
                    </ul>
                </ManualSection>

            </div>
        </div>
    );
};

export default UserManual;

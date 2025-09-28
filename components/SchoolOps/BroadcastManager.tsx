import React, { useState } from 'react';
import type { BroadcastTarget } from '../../types';
import { getRoutes, saveBroadcasts, getBroadcasts } from '../../services/dataService';

const BroadcastManager: React.FC = () => {
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState<BroadcastTarget>('All');
    const [confirmation, setConfirmation] = useState('');

    const routes = getRoutes();

    const handleSend = () => {
        if (!message.trim()) return;

        const newBroadcast = {
            id: crypto.randomUUID(),
            message,
            target,
            sentDate: new Date().toISOString()
        };
        
        const existingBroadcasts = getBroadcasts();
        saveBroadcasts([newBroadcast, ...existingBroadcasts]);

        setConfirmation(`Message sent to "${target}" group!`);
        setMessage('');
        setTimeout(() => setConfirmation(''), 3000);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">WhatsApp Broadcast</h3>
            <div className="space-y-4">
                 <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Compose your announcement..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
                />
                <div className="flex items-center gap-4">
                    <label htmlFor="target-select" className="text-sm font-medium">Send to:</label>
                    <select id="target-select" value={target} onChange={e => setTarget(e.target.value as BroadcastTarget)} className="rounded-md border-gray-300 shadow-sm focus:border-stoneridge-gold focus:ring-stoneridge-gold">
                        <option value="All">All Parents</option>
                        <optgroup label="By Class">
                           <option value="Pre-Primary">Pre-Primary</option>
                           <option value="P1-P4">P1-P4</option>
                           <option value="P5-P7">P5-P7</option>
                        </optgroup>
                        <optgroup label="By Transport Route">
                            {routes.map(r => <option key={r.id} value={r.routeName}>{r.routeName}</option>)}
                        </optgroup>
                    </select>
                </div>
                <div className="text-right">
                    <button onClick={handleSend} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800 disabled:bg-gray-400" disabled={!message.trim()}>
                        Send Broadcast
                    </button>
                </div>
                {confirmation && <p className="text-sm text-green-600 text-center mt-2">{confirmation}</p>}
            </div>
        </div>
    );
};

export default BroadcastManager;
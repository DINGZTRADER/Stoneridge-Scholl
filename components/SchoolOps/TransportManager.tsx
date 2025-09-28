import React, { useState, useEffect } from 'react';
import type { TransportRoute, RouteStatus } from '../../types';
import { getRoutes, saveRoutes } from '../../services/dataService';

const TransportManager: React.FC = () => {
    const [routes, setRoutes] = useState<TransportRoute[]>([]);

    useEffect(() => {
        setRoutes(getRoutes());
    }, []);

    const handleStatusChange = (id: string, newStatus: RouteStatus) => {
        const updatedRoutes = routes.map(r => r.id === id ? { ...r, status: newStatus } : r);
        setRoutes(updatedRoutes);
        saveRoutes(updatedRoutes);
    };
    
    const getStatusColor = (status: RouteStatus) => {
        switch (status) {
            case 'Arrived': return 'bg-green-100 text-green-800';
            case 'Departed': return 'bg-blue-100 text-blue-800';
            case 'Delayed': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Transport Routes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routes.map(route => (
                    <div key={route.id} className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-900">{route.routeName}</p>
                                <p className="text-sm text-gray-500">Driver: {route.driverName}</p>
                            </div>
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(route.status)}`}>
                                {route.status}
                            </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                             <button onClick={() => handleStatusChange(route.id, 'Departed')} className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Depart</button>
                             <button onClick={() => handleStatusChange(route.id, 'Arrived')} className="text-sm px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Arrive</button>
                             <button onClick={() => handleStatusChange(route.id, 'Delayed')} className="text-sm px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Delay</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransportManager;
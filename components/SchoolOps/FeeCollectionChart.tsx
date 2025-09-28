
import React, { useMemo } from 'react';
import type { Invoice } from '../../types';

interface FeeCollectionChartProps {
  invoices: Invoice[];
}

const FeeCollectionChart: React.FC<FeeCollectionChartProps> = ({ invoices }) => {
  const data = useMemo(() => {
    let totalInvoiced = 0;
    let totalPaid = 0;
    let overdueAmount = 0;

    invoices.forEach(invoice => {
      totalInvoiced += invoice.totalAmount;
      totalPaid += invoice.amountPaid;
      if (invoice.status === 'Overdue') {
        overdueAmount += (invoice.totalAmount - invoice.amountPaid);
      }
    });

    const collectionPercentage = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;

    return { totalInvoiced, totalPaid, overdueAmount, collectionPercentage };
  }, [invoices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(amount);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Collection Progress</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-medium text-gray-700">Collected</span>
            <span className="text-gray-500">{formatCurrency(data.totalPaid)} / {formatCurrency(data.totalInvoiced)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${data.collectionPercentage}%` }}
              title={`${data.collectionPercentage.toFixed(1)}% Collected`}
            ></div>
          </div>
        </div>
        <div className="pt-2">
            <p className="text-sm text-gray-600">
                <span className="font-semibold">Total Overdue:</span> {formatCurrency(data.overdueAmount)}
            </p>
        </div>
      </div>
    </div>
  );
};

export default FeeCollectionChart;

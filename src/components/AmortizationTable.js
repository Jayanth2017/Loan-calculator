import React, { useState, useEffect, useRef } from 'react';
import './LoanCalculator.css';

function AmortizationTable({ schedule, currency, currencySymbols }) {
  const [sortedSchedule, setSortedSchedule] = useState([]);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    if (schedule && schedule.length > 0) {
      const sorted = [...schedule].sort((a, b) => b.interest - a.interest);
      setSortedSchedule(sorted);
    } else {
      setSortedSchedule([]);
    }
  }, [schedule]);

  if (!sortedSchedule || sortedSchedule.length === 0) {
    return <p>No amortization schedule to display.</p>;
  }

  const currentCurrencySymbol = currencySymbols[currency] || '';

  return (
    <div ref={tableContainerRef} className="amortization-table-container">
      <h2>Amortization Schedule ({currency}) - Sorted by Interest</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {sortedSchedule.map((payment) => (
            <tr key={payment.month}>
              <td>{payment.month}</td>
              <td>{currentCurrencySymbol}{payment.principal ? payment.principal.toFixed(2) : '0.00'}</td>
              <td>{currentCurrencySymbol}{payment.interest ? payment.interest.toFixed(2) : '0.00'}</td>
              <td>{currentCurrencySymbol}{payment.remainingBalance ? payment.remainingBalance.toFixed(2) : '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AmortizationTable;
import React, { useState, useEffect } from 'react';
import './ExchangeRates.css';

function ExchangeRates() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/3231d8a2b29ec783fa1917dd/latest/USD`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRates(data.conversion_rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const filteredRates = Object.entries(rates).filter(([currency]) => currency !== 'USD');
  const totalCurrencies = filteredRates.length;
  const totalPages = Math.ceil(totalCurrencies / rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  const paginatedRates = filteredRates
    .sort(([, rateA], [, rateB]) => rateA - rateB)
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (loading) {
    return <div>Loading exchange rates...</div>;
  }

  if (error) {
    return <div>Error loading exchange rates: {error}</div>;
  }

  return (
    <div className="exchange-rates-container">
      <h2>Live Exchange Rates (Base: USD)</h2>
      <table>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRates.map(([currency, rate]) => (
            <tr key={currency}>
              <td>{currency}</td>
              <td>{rate.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <label htmlFor="rowsPerPage">Rows per page:</label>
        <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>

        <p>
          {currentPage * rowsPerPage - rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, totalCurrencies)} of {totalCurrencies}
        </p>

        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          &lt;
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default ExchangeRates;
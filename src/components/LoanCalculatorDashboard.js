import React, { useState, useEffect } from 'react';
import './LoanCalculator.css';
import AmortizationTable from './AmortizationTable';

function LoanCalculatorDashboard() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [monthlyPaymentUSD, setMonthlyPaymentUSD] = useState(null); // Store in base currency (USD)
  const [amortizationScheduleUSD, setAmortizationScheduleUSD] = useState([]); // Store in base currency (USD)
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loadingRates, setLoadingRates] = useState(false);
  const [errorRates, setErrorRates] = useState(null);

  const currencies = ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AUD', 'CAD'];
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£',
    JPY: '¥',
    AUD: '$',
    CAD: '$',
  };

  useEffect(() => {
    const fetchRates = async () => {
      setLoadingRates(true);
      setErrorRates(null);
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/3231d8a2b29ec783fa1917dd/latest/USD`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExchangeRates(data.conversion_rates);
      } catch (error) {
        setErrorRates(error.message);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, []);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 1200;
    const time = parseInt(term) * 12;

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate < 0 || time <= 0) {
      setMonthlyPaymentUSD(null);
      setAmortizationScheduleUSD([]);
      alert('Please enter valid loan details.');
      return;
    }

    const monthlyPaymentValueUSD =
      (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    const roundedMonthlyPaymentUSD = monthlyPaymentValueUSD ? parseFloat(monthlyPaymentValueUSD.toFixed(2)) : null;
    setMonthlyPaymentUSD(roundedMonthlyPaymentUSD);

    const scheduleUSD = [];
    let remainingBalance = principal;
    for (let i = 1; i <= time; i++) {
      const interestPayment = remainingBalance * rate;
      const principalPayment = roundedMonthlyPaymentUSD - interestPayment;
      scheduleUSD.push({
        month: i,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: remainingBalance - principalPayment,
      });
      remainingBalance -= principalPayment;
    }

    if (scheduleUSD.length > 0) {
      const lastPayment = { ...scheduleUSD[scheduleUSD.length - 1] };
      lastPayment.principal += lastPayment.remainingBalance;
      lastPayment.remainingBalance = 0;
      scheduleUSD[scheduleUSD.length - 1] = lastPayment;
    }

    setAmortizationScheduleUSD(scheduleUSD);
  };

  const handleResetTable = () => {
    setAmortizationScheduleUSD([]);
  };

  const convertCurrency = (amount, targetCurrency) => {
    if (exchangeRates && exchangeRates[targetCurrency] && typeof amount === 'number') {
      return amount * exchangeRates[targetCurrency];
    }
    return amount; // Return original amount if rate not available
  };

  const convertedMonthlyPayment = convertCurrency(monthlyPaymentUSD, selectedCurrency);
  const convertedAmortizationSchedule = amortizationScheduleUSD.map(payment => ({
    ...payment,
    principal: convertCurrency(payment.principal, selectedCurrency),
    interest: convertCurrency(payment.interest, selectedCurrency),
    remainingBalance: convertCurrency(payment.remainingBalance, selectedCurrency),
  }));

  return (
    <div className="loan-calculator-dashboard">
      
      <form onSubmit={handleCalculate} className="loan-form">
        <div>
          <label htmlFor="loanAmount">Loan Amount (USD):</label>
          <input
            type="number"
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="interestRate">Interest Rate (%):</label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="term">Term (Years):</label>
          <input
            type="number"
            id="term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
          />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {loadingRates && <p>Loading exchange rates...</p>}
      {errorRates && <p>Error loading exchange rates: {errorRates}</p>}

      {convertedMonthlyPayment !== null && (
        <div className="monthly-payment">
          Monthly EMI: {currencySymbols[selectedCurrency]}
          {convertedMonthlyPayment.toFixed(2)}
          <div className="currency-selector">
            <label htmlFor="currency">Currency:</label>
            <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange}>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

{convertedAmortizationSchedule.length > 0 && (
    <>
      <button className="reset-table-button" onClick={handleResetTable}>
        Reset Table
      </button>
      <AmortizationTable
        schedule={convertedAmortizationSchedule}
        currency={selectedCurrency}
        currencySymbols={currencySymbols}
      />
    </>
  )}
    </div>
  );
}

export default LoanCalculatorDashboard;
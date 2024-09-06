import React, { useState, useEffect } from 'react';

function Billing() {
    const [payments, setPayments] = useState([]);

    const fetchPayments = async () => {
        const response = await fetch('http://localhost:3000/billing');
        const results = await response.json();

        if (!response.ok) {
            alert('Could not fetch payments');
        } else {
            setPayments(results);
        }
    }

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="container mt-4"> 
            <h2 className="mb-4 text-white">Payments</h2>
            <table className="table table-dark table-bordered">
                <thead>
                    <tr>
                        <th style={{backgroundColor: 'black'}}>From</th>
                        <th style={{backgroundColor: 'black'}}>To</th>
                        <th style={{backgroundColor: 'black'}}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index} style={{textDecoration: payment.cancel ? 'line-through': 'none', textDecorationThickness: '3px'}}>
                            <td>{payment.payfrom}</td>
                            <td>{payment.payto}</td>
                            <td>${payment.amount}.00</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Billing;
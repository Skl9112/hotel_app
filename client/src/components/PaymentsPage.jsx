import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentsPage.css';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newPayment, setNewPayment] = useState({
    booking_id: '',
    amount: '',
  });

  useEffect(() => {
    fetchPayments();
    fetchBookings();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке платежей:', error.message);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error.message);
    }
  };

  const addPayment = async () => {
    try {
      await axios.post('http://localhost:5000/payments', { booking_id: newPayment.booking_id });
      setNewPayment({ booking_id: '', amount: '' });
      fetchPayments();
    } catch (error) {
      console.error('Ошибка при добавлении платежа:', error.message);
    }
  };

  const deletePayment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/payments/${id}`);
      fetchPayments();
    } catch (error) {
      console.error('Ошибка при удалении платежа:', error.message);
    }
  };

  const handleBookingChange = (e) => {
    const selectedBooking = bookings.find((booking) => booking.id === parseInt(e.target.value));
    setNewPayment({
      booking_id: e.target.value,
      amount: selectedBooking ? selectedBooking.total_price : '',
    });
  };

  return (
    <div className="payments-container">
      <h1>Платежи</h1>
      <div className="payments-grid">
        {payments.map((payment) => (
          <div className="payment-card" key={payment.id}>
            <h3>Клиент: {payment.first_name} {payment.last_name}</h3>
            <p>Номер: {payment.comfort_level}</p>
            <p>Дата платежа: {payment.payment_date}</p>
            <p>Сумма: {payment.amount} руб.</p>
            <button onClick={() => deletePayment(payment.id)}>Удалить</button>
          </div>
        ))}
      </div>

      <div className="add-payment">
        <h2>Оформить платеж</h2>
        <select
          value={newPayment.booking_id}
          onChange={handleBookingChange}
        >
          <option value="">Выберите заявку</option>
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>
              {booking.first_name} {booking.last_name} - {booking.comfort_level}
            </option>
          ))}
        </select>
        <p>Сумма: {newPayment.amount} руб.</p>
        <button onClick={addPayment} disabled={!newPayment.booking_id}>
          Провести платеж
        </button>
      </div>
    </div>
  );
};

export default PaymentsPage;

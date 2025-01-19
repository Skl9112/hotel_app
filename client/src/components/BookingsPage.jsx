import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingsPage.css';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [newBooking, setNewBooking] = useState({
    room_id: '',
    client_id: '',
    check_in_date: '',
    check_out_date: '',
    has_children: false,
  });

  useEffect(() => {
    fetchBookings();
    fetchRooms();
    fetchClients();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error.message);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке номеров:', error.message);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке клиентов:', error.message);
    }
  };

  const addBooking = async () => {
    try {
      await axios.post('http://localhost:5000/bookings', newBooking);
      setNewBooking({
        room_id: '',
        client_id: '',
        check_in_date: '',
        check_out_date: '',
        has_children: false,
      });
      fetchBookings();
    } catch (error) {
      console.error('Ошибка при добавлении бронирования:', error.message);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error('Ошибка при удалении бронирования:', error.message);
    }
  };

  return (
    <div className="bookings-container">
      <h1>Бронирования</h1>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking.id}>
            <h3>Клиент: {booking.first_name} {booking.last_name}</h3>
            <p>Номер: {booking.comfort_level}</p>
            <p>Дата заезда: {booking.check_in_date}</p>
            <p>Дата выезда: {booking.check_out_date}</p>
            <p>Цена: {booking.total_price} руб.</p>
            <p>Дети: {booking.has_children ? 'Да' : 'Нет'}</p>
            <button onClick={() => deleteBooking(booking.id)}>Удалить</button>
          </div>
        ))}
      </div>

      <div className="add-booking">
        <h2>Оформить бронирование</h2>
        <select
          value={newBooking.room_id}
          onChange={(e) => setNewBooking({ ...newBooking, room_id: e.target.value })}
        >
          <option value="">Выберите номер</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.comfort_level}
            </option>
          ))}
        </select>
        <select
          value={newBooking.client_id}
          onChange={(e) => setNewBooking({ ...newBooking, client_id: e.target.value })}
        >
          <option value="">Выберите клиента</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.first_name} {client.last_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Дата заезда"
          value={newBooking.check_in_date}
          onChange={(e) => setNewBooking({ ...newBooking, check_in_date: e.target.value })}
        />
        <input
          type="date"
          placeholder="Дата выезда"
          value={newBooking.check_out_date}
          onChange={(e) => setNewBooking({ ...newBooking, check_out_date: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newBooking.has_children}
            onChange={(e) =>
              setNewBooking({ ...newBooking, has_children: e.target.checked })
            }
          />
          Дети
        </label>
        <button onClick={addBooking}>Оформить</button>
      </div>
    </div>
  );
};

export default BookingsPage;

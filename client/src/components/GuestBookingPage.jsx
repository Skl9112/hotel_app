import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuestBookingPage.css';

const GuestBookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    room_id: '',
    check_in_date: '',
    check_out_date: '',
  });
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке номеров:', error.message);
    }
  };

  const handleBooking = async () => {
    try {
      // Создаем клиента
      const clientResponse = await axios.post('http://localhost:5000/clients', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email,
      });

      // Создаем бронь
      const bookingResponse = await axios.post('http://localhost:5000/bookings', {
        client_id: clientResponse.data.id,
        room_id: formData.room_id,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        has_children: false,
      });

      setBookingInfo(bookingResponse.data);
    } catch (error) {
      console.error('Ошибка при оформлении брони:', error.message);
    }
  };

  return (
    <div className="guest-booking-container">
      <h1>Оформить бронирование</h1>
      {!bookingInfo ? (
        <div className="booking-form">
          <input
            type="text"
            placeholder="Имя"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Телефон"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <select
            value={formData.room_id}
            onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
          >
            <option value="">Выберите номер</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.comfort_level} - {room.price} руб./ночь
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.check_in_date}
            onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
          />
          <input
            type="date"
            value={formData.check_out_date}
            onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
          />
          <button onClick={handleBooking}>Оформить</button>
        </div>
      ) : (
        <div className="booking-info">
          <h2>Ваше бронирование успешно оформлено!</h2>
          <p>
            <strong>Имя:</strong> {formData.first_name} {formData.last_name}
          </p>
          <p>
            <strong>Номер:</strong> {rooms.find((room) => room.id === formData.room_id)?.comfort_level}
          </p>
          <p>
            <strong>Дата заезда:</strong> {formData.check_in_date}
          </p>
          <p>
            <strong>Дата выезда:</strong> {formData.check_out_date}
          </p>
        </div>
      )}
    </div>
  );
};

export default GuestBookingPage;

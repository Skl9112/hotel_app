import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoomsPage.css';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]); // Для загрузки категорий
  const [newRoom, setNewRoom] = useState({
    category_id: '',
    capacity: '',
    comfort_level: '',
    price: '',
    photo_url: '',
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const role = localStorage.getItem('role'); // Получаем роль пользователя

  useEffect(() => {
    fetchRooms();
    fetchCategories(); // Загружаем категории
  }, []);

  // Получение списка номеров
  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке номеров:', error.message);
    }
  };

  // Получение списка категорий
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error.message);
    }
  };

  // Добавление нового номера
  const addRoom = async () => {
    try {
      await axios.post('http://localhost:5000/rooms', newRoom);
      setNewRoom({
        category_id: '',
        capacity: '',
        comfort_level: '',
        price: '',
        photo_url: '',
      });
      fetchRooms();
    } catch (error) {
      console.error('Ошибка при добавлении номера:', error.message);
    }
  };

  // Обновление номера
  const updateRoom = async (id) => {
    try {
      await axios.put(`http://localhost:5000/rooms/${id}`, editingRoom);
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error('Ошибка при обновлении номера:', error.message);
    }
  };

  // Удаление номера
  const deleteRoom = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      console.error('Ошибка при удалении номера:', error.message);
    }
  };

  // Установка номера в режим редактирования
  const handleEdit = (room) => {
    setEditingRoom({ ...room }); // Создаем копию данных номера для редактирования
  };

  return (
    <div className="rooms-container">
      <h1>Список номеров</h1>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room.id}>
            {editingRoom && editingRoom.id === room.id ? (
              <>
                <select
                  value={editingRoom.category_id}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, category_id: e.target.value })
                  }
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editingRoom.capacity}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, capacity: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editingRoom.comfort_level}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, comfort_level: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editingRoom.price}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, price: parseFloat(e.target.value) })
                  }
                />
                <input
                  type="text"
                  value={editingRoom.photo_url}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, photo_url: e.target.value })
                  }
                />
                <button onClick={() => updateRoom(room.id)}>Сохранить</button>
                <button onClick={() => setEditingRoom(null)}>Отмена</button>
              </>
            ) : (
              <>
                <img
                  src={room.photo_url}
                  alt={room.comfort_level}
                  className="room-image"
                />
                <h3>{room.comfort_level}</h3>
                <p>Категория: {room.category_name}</p>
                <p>Вместимость: {room.capacity} человек</p>
                <p>Цена: {room.price} руб./ночь</p>
                {role === 'admin' && ( // Только админ видит кнопки редактирования и удаления
                  <div className="card-actions">
                    <button onClick={() => handleEdit(room)}>Редактировать</button>
                    <button onClick={() => deleteRoom(room.id)}>Удалить</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {role === 'admin' && ( // Только админ видит форму добавления номеров
        <div className="add-room">
          <h2>Добавить номер</h2>
          <select
            value={newRoom.category_id}
            onChange={(e) => setNewRoom({ ...newRoom, category_id: e.target.value })}
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Вместимость"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
          />
          <input
            type="text"
            placeholder="Уровень комфорта"
            value={newRoom.comfort_level}
            onChange={(e) => setNewRoom({ ...newRoom, comfort_level: e.target.value })}
          />
          <input
            type="number"
            placeholder="Цена"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ссылка на фото"
            value={newRoom.photo_url}
            onChange={(e) => setNewRoom({ ...newRoom, photo_url: e.target.value })}
          />
          <button onClick={addRoom}>Добавить</button>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

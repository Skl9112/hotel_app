import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Получаем роль

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    localStorage.removeItem('role');  // Удаляем роль из localStorage
    navigate('/');
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <h1>Гостиница "Золотая Подкова"</h1>
        <p>Ваш комфорт - наша забота</p>
      </header>
      <nav className="main-menu">
        <ul>
          <li><button onClick={() => navigate('/rooms')}>Список номеров</button></li>
          {role === 'admin' && (
            <>
              <li><button onClick={() => navigate('/categories')}>Категории номеров</button></li>
              <li><button onClick={() => navigate('/clients')}>Клиенты</button></li>
              <li><button onClick={() => navigate('/bookings')}>Бронирования</button></li>
              <li><button onClick={() => navigate('/payments')}>Платежи</button></li>
            </>
          )}
          {role === 'guest' && (
            <li><button onClick={() => navigate('/guest-booking')}>Оформить бронь</button></li>
          )}
        </ul>
      </nav>
      <footer className="main-footer">
        <button className="logout-btn" onClick={handleLogout}>Выйти</button>
      </footer>
    </div>
  );
};

export default MainPage;

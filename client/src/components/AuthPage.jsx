import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Для работы с запросами
import './AuthPage.css';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const { token } = response.data;

      // Сохраняем токен и роль в localStorage
      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Декодируем токен
      localStorage.setItem('role', decodedToken.role); // Сохраняем роль ('admin' или 'guest')

      // Перенаправляем в зависимости от роли
      if (decodedToken.role === 'admin') {
        navigate('/main');
      } else {
        navigate('/rooms'); // Например, для гостя отображаем только список номеров
      }
    } catch (error) {
      setError('Неверные учетные данные!');
      console.error('Ошибка при авторизации:', error.message);
    }
  };

const handleGuestLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/guest');
    const { token } = response.data;

    // Сохраняем токен и роль в localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'guest');

    // Перенаправляем гостя на главную
    navigate('/main');
  } catch (error) {
    setError('Ошибка при входе как гость!');
    console.error('Ошибка при гостевом входе:', error.message);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Добро пожаловать в гостиницу "Золотая Подкова"</h1>
        <p>Насладитесь уютом и комфортом, забронируйте номер прямо сейчас!</p>
      </div>
      <div className="auth-box">
        <h2>Авторизация</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Войти</button>
        <button className="guest-btn" onClick={handleGuestLogin}>
          Войти как гость
        </button>
      </div>
      <div className="auth-footer">
        <p>Не зарегистрированы? Свяжитесь с нашей администрацией для получения учетных данных.</p>
      </div>
    </div>
  );
};

export default AuthPage;

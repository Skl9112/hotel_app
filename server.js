const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

const users = [
  { username: 'admin', password: bcrypt.hashSync('12345', 10) }, // Зашифрованный пароль
];

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'HotelsDB',
  password: '1234',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Эндпоинт для авторизации

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username, role: 'admin' }, 'secret_key', { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Неверные учетные данные' });
  }
});

// Эндпоинт для гостевого входа
app.post('/guest', (req, res) => {
  const token = jwt.sign({ username: 'guest', role: 'guest' }, 'secret_key', { expiresIn: '1h' });
  return res.json({ token });
});




// Получение всех категорий
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Categories');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление новой категории
app.post('/categories', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление категории
app.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление категории
app.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Categories WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение всех номеров
app.get('/rooms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.capacity, r.comfort_level, r.price, r.photo_url, c.name AS category_name
      FROM Rooms r
      JOIN Categories c ON r.category_id = c.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении номеров:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Добавление нового номера
app.post('/rooms', async (req, res) => {
  const { category_id, capacity, comfort_level, price, photo_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Rooms (category_id, capacity, comfort_level, price, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [category_id, capacity, comfort_level, price, photo_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при добавлении номера:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Обновление номера
app.put('/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const { category_id, capacity, comfort_level, price, photo_url } = req.body;

  try {
    const result = await pool.query(
      'UPDATE Rooms SET category_id = $1, capacity = $2, comfort_level = $3, price = $4, photo_url = $5 WHERE id = $6 RETURNING *',
      [category_id, capacity, comfort_level, price, photo_url, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении номера:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Удаление номера
app.delete('/rooms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Rooms WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении номера:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Получение всех клиентов
app.get('/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Clients');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при загрузке клиентов:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Добавление нового клиента
app.post('/clients', async (req, res) => {
  const { first_name, last_name, phone, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Clients (first_name, last_name, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, phone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при добавлении клиента:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Обновление клиента
app.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Clients SET first_name = $1, last_name = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
      [first_name, last_name, phone, email, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении клиента:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Удаление клиента
app.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Clients WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении клиента:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Получение всех бронирований
app.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.check_in_date, b.check_out_date, b.total_price, b.has_children, 
             r.id AS room_id, r.comfort_level, c.id AS client_id, c.first_name, c.last_name
      FROM Bookings b
      JOIN Rooms r ON b.room_id = r.id
      JOIN Clients c ON b.client_id = c.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при загрузке бронирований:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Добавление нового бронирования
app.post('/bookings', async (req, res) => {
  const { room_id, client_id, check_in_date, check_out_date, has_children } = req.body;

  try {
    // Получаем цену номера
    const roomResult = await pool.query('SELECT price FROM Rooms WHERE id = $1', [room_id]);
    if (roomResult.rows.length === 0) {
      return res.status(400).json({ error: 'Номер не найден' });
    }
    const roomPrice = roomResult.rows[0].price;

    // Рассчитываем цену за период
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = roomPrice * days;

    // Вставляем бронирование
    const result = await pool.query(
      'INSERT INTO Bookings (room_id, client_id, check_in_date, check_out_date, total_price, has_children) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [room_id, client_id, check_in_date, check_out_date, totalPrice, has_children]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при добавлении бронирования:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Удаление бронирования
app.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Bookings WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении бронирования:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Получение всех платежей
app.get('/payments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.payment_date, p.amount, 
             b.id AS booking_id, b.total_price, c.first_name, c.last_name, r.comfort_level
      FROM Payments p
      JOIN Bookings b ON p.booking_id = b.id
      JOIN Clients c ON b.client_id = c.id
      JOIN Rooms r ON b.room_id = r.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при загрузке платежей:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Добавление нового платежа
app.post('/payments', async (req, res) => {
  const { booking_id } = req.body;
  try {
    // Получаем сумму из бронирования
    const bookingResult = await pool.query('SELECT total_price FROM Bookings WHERE id = $1', [booking_id]);
    if (bookingResult.rows.length === 0) {
      return res.status(400).json({ error: 'Бронирование не найдено' });
    }
    const amount = bookingResult.rows[0].total_price;

    // Вставляем платеж с текущей датой
    const result = await pool.query(
      'INSERT INTO Payments (booking_id, payment_date, amount) VALUES ($1, CURRENT_DATE, $2) RETURNING *',
      [booking_id, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при добавлении платежа:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Удаление платежа
app.delete('/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Payments WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении платежа:', error.message);
    res.status(500).json({ error: error.message });
  }
});



// Запуск сервера
app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));

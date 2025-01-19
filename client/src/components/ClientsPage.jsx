import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientsPage.css';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  });
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке клиентов:', error.message);
    }
  };

  const addClient = async () => {
    try {
      await axios.post('http://localhost:5000/clients', newClient);
      setNewClient({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
      });
      fetchClients();
    } catch (error) {
      console.error('Ошибка при добавлении клиента:', error.message);
    }
  };

  const updateClient = async (id) => {
    try {
      await axios.put(`http://localhost:5000/clients/${id}`, editingClient);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Ошибка при обновлении клиента:', error.message);
    }
  };

  const deleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error.message);
    }
  };

  return (
    <div className="clients-container">
      <h1>Управление клиентами</h1>
      <div className="clients-grid">
        {clients.map((client) => (
          <div className="client-card" key={client.id}>
            {editingClient && editingClient.id === client.id ? (
              <>
                <input
                  type="text"
                  defaultValue={client.first_name}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, first_name: e.target.value })
                  }
                />
                <input
                  type="text"
                  defaultValue={client.last_name}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, last_name: e.target.value })
                  }
                />
                <input
                  type="text"
                  defaultValue={client.phone}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, phone: e.target.value })
                  }
                />
                <input
                  type="email"
                  defaultValue={client.email}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, email: e.target.value })
                  }
                />
                <button onClick={() => updateClient(client.id)}>Сохранить</button>
                <button onClick={() => setEditingClient(null)}>Отмена</button>
              </>
            ) : (
              <>
                <h3>{client.first_name} {client.last_name}</h3>
                <p>Телефон: {client.phone}</p>
                <p>Email: {client.email}</p>
                <div className="card-actions">
                  <button onClick={() => setEditingClient(client)}>Редактировать</button>
                  <button onClick={() => deleteClient(client.id)}>Удалить</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="add-client">
        <h2>Добавить клиента</h2>
        <input
          type="text"
          placeholder="Имя"
          value={newClient.first_name}
          onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={newClient.last_name}
          onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Телефон"
          value={newClient.phone}
          onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newClient.email}
          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
        />
        <button onClick={addClient}>Добавить</button>
      </div>
    </div>
  );
};

export default ClientsPage;

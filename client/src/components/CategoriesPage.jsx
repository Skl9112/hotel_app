import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  const addCategory = async () => {
    try {
      await axios.post('http://localhost:5000/categories', newCategory);
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Ошибка при добавлении категории:', error);
    }
  };

  const updateCategory = async (id) => {
    try {
      await axios.put(`http://localhost:5000/categories/${id}`, editingCategory);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
    }
  };

  return (
    <div className="categories-container">
      <header className="categories-header">
        <h1>Категории номеров</h1>
        <p>Управляйте категориями номеров вашей гостиницы</p>
      </header>
      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>
                {editingCategory?.id === category.id ? (
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editingCategory?.id === category.id ? (
                  <input
                    type="text"
                    value={editingCategory.description}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, description: e.target.value })
                    }
                  />
                ) : (
                  category.description
                )}
              </td>
              <td>
                {editingCategory?.id === category.id ? (
                  <button onClick={() => updateCategory(category.id)}>Сохранить</button>
                ) : (
                  <button onClick={() => setEditingCategory(category)}>Редактировать</button>
                )}
                <button onClick={() => deleteCategory(category.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-category">
        <h2>Добавить категорию</h2>
        <input
          type="text"
          placeholder="Название"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <textarea
          placeholder="Описание"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        ></textarea>
        <button onClick={addCategory}>Добавить</button>
      </div>
    </div>
  );
};

export default CategoriesPage;


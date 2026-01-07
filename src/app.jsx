import React, { useState, useEffect } from 'react' // in earlier class we learn how to fetch api and delete that field  but today(15-12-25) we are learning search functionality and edit
import axios from 'axios'

const App = () => {
  const [data, setData] = useState([]);
  const [inputName, setInputName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editErrors, setEditErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = 'https://69396001c8d59937aa0787c8.mockapi.io/form';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } 
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!inputName.trim()) newErrors.name = 'Name is required'; // this .name is created automatically if we use errors.name to show error message 
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Valid email required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        name: inputName,
        email: email,
        password: password,
      });
      setData(prev => [response.data, ...prev]);
      setInputName('');
      setEmail('');
      setPassword('');
      setErrors({});
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editName.trim()) newErrors.name = 'Name is required';
    if (!editEmail || !/^\S+@\S+\.\S+$/.test(editEmail)) newErrors.email = 'Valid email required';
    if (!editPassword || editPassword.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditEmail(item.email);
    setEditPassword(item.password);
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditPassword('');
    setEditErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateEditForm();
    
    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${editingId}`, {
        name: editName,
        email: editEmail,
        password: editPassword,
      });
      setData(prev => prev.map(item => item.id === editingId ? response.data : item));
      handleCancelEdit();
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const filteredData = data.filter(({ name = '', email: itemEmail = '' }) => {
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || itemEmail.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mb-8 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-5 py-4 rounded-full shadow-md">
          <h1 className="text-3xl ml-4 font-bold text-gray-800">Search</h1>
          <div className="flex w-full sm:w-auto items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 sm:w-72 p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button" 
              onClick={() => setSearchQuery('')}
              className="px-4 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input type="text" placeholder="Name"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
            </div>
            <div>
              <input type="email" placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
            </div>
            <div>
              <input type="password" placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.password && <span className="text-red-600 text-sm">{errors.password}</span>}
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
            Add Item
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Items List</h2>
          
          {filteredData.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No items found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map(item => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {editingId === item.id ? (
                    <form onSubmit={handleUpdateSubmit} className="space-y-3">
                      <h3 className="font-bold text-lg text-gray-800 mb-3">Edit Item</h3>
                      <div>
                        <input type="text" placeholder="Name" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full p-2 border rounded text-sm ${editErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {editErrors.name && <span className="text-red-600 text-xs">{editErrors.name}</span>}
                      </div>
                      <div>
                        <input type="email" placeholder="Email" 
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className={`w-full p-2 border rounded text-sm ${editErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {editErrors.email && <span className="text-red-600 text-xs">{editErrors.email}</span>}
                      </div>
                      <div>
                        <input type="password" placeholder="Password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className={`w-full p-2 border rounded text-sm ${editErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {editErrors.password && <span className="text-red-600 text-xs">{editErrors.password}</span>}
                      </div>
                      <div className="flex gap-2">
                        <button type="submit"
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm"
                        >
                          Save
                        </button>
                        <button type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-1"><span className="font-semibold">Email:</span> {item.email}</p>
                      <p className="text-gray-600 mb-4"><span className="font-semibold">Password:</span> {item.password}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>  
  );
};

export { App };
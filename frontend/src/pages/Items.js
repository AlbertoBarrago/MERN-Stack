import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Items() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ text: '', category: 'General', price: 0 });
    const [editingItem, setEditingItem] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    // we use useCallback to avoid unnecessary re-renders of the fetchItems function
    const fetchItems = useCallback(async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/items`, config);
            setItems(response.data.items);
        } catch (error) {
            toast.error('Errore nel caricamento degli items');
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchItems();
    }, [token, navigate, fetchItems]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Create item object with proper fields matching the backend model
            const itemData = {
                name: newItem.text,
                description: newItem.text, // Using the same value for simplicity
                category: newItem.category,
                price: parseFloat(newItem.price),
                quantity: 1 // Default quantity
            };

            if (editingItem) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/items/${editingItem._id}`,
                    itemData,
                    config
                );
                toast.success('Item aggiornato con successo');
                setEditingItem(null);
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/items`,
                    itemData,
                    config
                );
                toast.success('Item creato con successo');
            }

            setNewItem({ text: '', category: 'General', price: 0 });
            fetchItems();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Errore durante il salvataggio');
        }
    };

    const handleDelete = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`${process.env.REACT_APP_API_URL}/items/${id}`, config);
            toast.success('Item eliminato con successo');
            fetchItems();
        } catch (error) {
            toast.error('Errore durante l\'eliminazione');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setNewItem({
            text: item.name,
            category: item.category,
            price: item.price
        });
    };

    return (
        <div className="items-container">
            <h2>Gestione Items</h2>

            <form onSubmit={handleSubmit} className="item-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={newItem.text}
                        onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                        placeholder="Inserisci un nuovo item"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="Categoria"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                        placeholder="Prezzo"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Aggiorna' : 'Aggiungi'}
                </button>
            </form>

            <div className="items-list">
                {items.map((item) => (
                    <div key={item._id} className="item-card">
                        <p><strong>{item.name}</strong></p>
                        <p>{item.description}</p>
                        <p>Category: {item.category}</p>
                        <p>Price: ${item.price}</p>
                        <div className="item-actions">
                            <button
                                onClick={() => handleEdit(item)}
                                className="btn btn-edit"
                            >
                                Modifica
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="btn btn-delete"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Items;
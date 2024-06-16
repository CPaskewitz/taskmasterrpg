import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import './Shop.scss';

interface Equipment {
    _id: string;
    name: string;
    type: string;
    damageBoost: number;
    cost: number;
    requiredLevel: number;
}

interface ShopProps {
    onPurchase: () => void;
}

const Shop: React.FC<ShopProps> = ({ onPurchase }) => {
    const [equipmentItems, setEquipmentItems] = useState<Equipment[]>([]);
    const [characterEquipment, setCharacterEquipment] = useState<Equipment[]>([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await axios.get('/api/shop/equipment', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEquipmentItems(response.data);  // Corrected to set the state directly from response.data

                const characterResponse = await axios.get('/api/users/character', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCharacterEquipment(characterResponse.data.equipment);
            } catch (error: any) {
                console.error('Error fetching equipment:', error.response?.data || error.message);
                alert('Failed to fetch equipment');
            }
        };

        fetchEquipment();
    }, [token]);

    const handlePurchase = async (equipmentId: string) => {
        try {
            await axios.post('/api/shop/purchase', { equipmentId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Equipment purchased successfully');
            onPurchase();

            const purchasedItem = equipmentItems.find(item => item._id === equipmentId);
            if (purchasedItem) {
                setCharacterEquipment(prevEquipment => [...prevEquipment, purchasedItem]);
            }
        } catch (error: any) {
            console.error('Error purchasing equipment:', error.response?.data || error.message);
            alert(error.response?.data || 'Failed to purchase equipment');
        }
    };

    const isEquipmentOwned = (equipmentId: string) => {
        return characterEquipment.some(item => item._id === equipmentId);
    };

    return (
        <div className="shop">
            <h2 className="shop__header">Shop</h2>
            <ul className="shop__list">
                {equipmentItems && equipmentItems.length > 0 ? (
                    equipmentItems.map(item => (
                        <li key={item._id} className="shop__item">
                            <span className="shop__item-name">{item.name}</span>
                            <span className="shop__item-cost">Cost: {item.cost} Gold</span>
                            <span className="shop__item-damage">Attack Damage: {item.damageBoost}</span>
                            <button
                                className="shop__item-button"
                                onClick={() => handlePurchase(item._id)}
                                disabled={isEquipmentOwned(item._id)}
                            >
                                {isEquipmentOwned(item._id) ? 'Owned' : 'Buy'}
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="shop__item">No equipment available</li>
                )}
            </ul>
        </div>
    );
};

export default Shop;
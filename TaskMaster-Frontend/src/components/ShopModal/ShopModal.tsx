import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import './ShopModal.scss';

interface Equipment {
    _id: string;
    name: string;
    type: string;
    damageBoost: number;
    cost: number;
    requiredLevel: number;
}

interface ShopModalProps {
    onClose: () => void;
    onPurchase: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ onClose, onPurchase }) => {
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
                setEquipmentItems(response.data);

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
            onClose();

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
        <div className="shop-modal__overlay">
            <div className="shop-modal">
                <button className="shop-modal__close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="shop-modal__header">Shop</h2>
                <ul className="shop-modal__list">
                    {equipmentItems && equipmentItems.length > 0 ? (
                        equipmentItems.map(item => (
                            <li key={item._id} className="shop-modal__item">
                                <span className="shop-modal__item-name">{item.name}</span>
                                <span className="shop-modal__item-cost">Cost: {item.cost} Gold</span>
                                <span className="shop-modal__item-damage">Attack Damage +{item.damageBoost}</span>
                                <button
                                    className="shop-modal__item-button"
                                    onClick={() => handlePurchase(item._id)}
                                    disabled={isEquipmentOwned(item._id)}
                                >
                                    {isEquipmentOwned(item._id) ? 'Owned' : 'Buy'}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="shop-modal__item">No equipment available</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ShopModal;
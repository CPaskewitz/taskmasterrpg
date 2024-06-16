import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import './Shop.scss';

interface Equipment {
    _id: string;
    name: string;
    type: string;
    attackPower: number;
    cost: number;
    requiredLevel: number;
}

interface ShopProps {
    refreshStats: () => void;
}

const Shop: React.FC<ShopProps> = ({ refreshStats }) => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await axios.get('/api/shop/equipment', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEquipment(response.data);
            } catch (error: any) {
                console.error('Error fetching equipment:', error.response?.data || error.message);
                alert('Failed to fetch equipment');
            }
        };

        fetchEquipment();
    }, [token]);

    const handlePurchase = async (id: string) => {
        try {
            await axios.post('/api/shop/purchase', { equipmentId: id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            refreshStats();
            alert('Equipment purchased successfully');
        } catch (error: any) {
            console.error('Error purchasing equipment:', error.response?.data || error.message);
            alert('Failed to purchase equipment');
        }
    };

    return (
        <div className="shop">
            <h2 className="shop__header">Shop</h2>
            <ul className="shop__list">
                {equipment.map((item) => (
                    <li key={item._id} className="shop__item">
                        <span className="shop__item-name">{item.name}</span>
                        <span className="shop__item-cost">Cost: {item.cost} gold</span>
                        <button className="shop__item-button" onClick={() => handlePurchase(item._id)}>Buy</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Shop;
'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { getOrderById } from '@/lib/api/orders';
import { getOrdersByUser } from '@/lib/api/orders';
import { useUserId } from '@/hooks/use-user-id';

export function CartButton() {
    const [itemCount, setItemCount] = useState<number>(0);
    const userId = useUserId();

    useEffect(() => {
        // Obtener el ID de la orden desde sessionStorage
        const orderId = sessionStorage.getItem('orderId');
        
        // Si existe un ID de orden, obtener los detalles de la orden
        if (orderId) {
            getOrderById(orderId)
                .then((orderData) => {
                    const distinctItemCount = Object.keys(orderData.products).length;
                    setItemCount(distinctItemCount);
                })
                .catch((error) => {
                    console.error('Error fetching order details:', error);
                });
        } else{
            if (userId) {
                getOrdersByUser(userId).then((orders) => {
                    const activeOrder = orders.find((order) => order.status === 'in_progress');
                    if (activeOrder) {
                        sessionStorage.setItem('orderId', activeOrder.id);
                        window.location.reload();
                    }
                });
            } else {
                console.error('User ID is null');
            }
        }
    }, [userId]);

    function goToCart(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        window.location.href = '/cart';
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button variant="ghost" size="icon" onClick={goToCart}>
                <ShoppingCart size={20} />
            </Button>
            {itemCount > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}>
                    {itemCount}
                </span>
            )}
        </div>
    );
}

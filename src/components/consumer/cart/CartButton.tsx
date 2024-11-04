'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export function CartButton() {  
    function goToCart(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        // Assuming you have a router to navigate to the cart page
        window.location.href = '/cart';
    }

    return (
        <Button variant="ghost" size="icon" onClick={goToCart}>
            <ShoppingCart size={20} />
        </Button>
    )
  }
  
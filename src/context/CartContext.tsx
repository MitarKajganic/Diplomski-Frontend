import React, { createContext, useContext, useState, ReactNode, useEffect  } from 'react';
import { MenuItemDto } from '../types/Interfaces';

export interface CartItem extends MenuItemDto {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: MenuItemDto) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    updateItemQuantity: (itemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: MenuItemDto) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(ci => ci.id === item.id);
            if (existingItem) {
                return prevItems.map(ci =>
                    ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(ci => ci.id !== itemId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const updateItemQuantity = (itemId: string, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(ci =>
                ci.id === itemId ? { ...ci, quantity: quantity } : ci
            ).filter(ci => ci.quantity > 0)
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                getTotalItems,
                getTotalPrice,
                updateItemQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

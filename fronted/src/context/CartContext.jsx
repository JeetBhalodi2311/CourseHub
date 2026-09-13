import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const isInitialized = useRef(false);

    // Get user-specific cart key
    const getCartKey = () => {
        return user ? `cart_${user.id}` : 'cart_guest';
    };

    // Load cart from local storage on init and when user changes
    useEffect(() => {
        const cartKey = getCartKey();
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
        isInitialized.current = true;
    }, [user]);

    // Save cart to local storage whenever it changes (only after init)
    useEffect(() => {
        if (!isInitialized.current) return;
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (course) => {
        setCartItems(prevItems => {
            if (prevItems.some(item => item.id === course.id)) return prevItems;
            return [...prevItems, course];
        });
    };

    const removeFromCart = (courseId) => {
        setCartItems(cartItems.filter(item => item.id !== courseId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const isInCart = (courseId) => {
        return cartItems.some(item => item.id === courseId);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isInCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

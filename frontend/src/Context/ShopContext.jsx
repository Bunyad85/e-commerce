import React, { createContext, useEffect, useState } from "react";

// Kontekst yaradılır
export const ShopContext = createContext(null);

// Səbətin default vəziyyəti
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 300; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    // Bütün məhsulları və istifadəçi səbətini çək
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Məhsulları çək
                const productRes = await fetch('http://localhost:4000/allproducts');
                const productData = await productRes.json();
                setAll_Product(productData);

                // Səbəti çək (əgər token varsa)
                const token = localStorage.getItem('auth-token');
                if (token) {
                    const cartRes = await fetch('http://localhost:4000/getcart', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'auth-token': token,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    });
                    const cartData = await cartRes.json();
                    setCartItems(cartData);
                }
            } catch (err) {
                console.error("Məlumatlar alınmadı:", err);
            }
        };

        fetchData();
    }, []);

    // Səbətə əlavə et
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

        const token = localStorage.getItem('auth-token');
        if (token) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((res) => res.json())
                .then((data) => console.log("Əlavə olundu:", data))
                .catch((err) => console.error("Əlavə olunmadı:", err));
        }
    };

    // Səbətdən sil
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        const token = localStorage.getItem('auth-token');
        if (token) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((res) => res.json())
                .then((data) => console.log("Silindi:", data))
                .catch((err) => console.error("Silinmədi:", err));
        }
    };

    // Ümumi məbləği hesabla
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = all_product.find(
                    (product) => product.id === Number(item)
                );
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // Ümumi məhsul sayı
    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    // Səbəti sıfırla
    const clearCart = () => {
        setCartItems(getDefaultCart());
    };

    // Context dəyərləri
    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        clearCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;

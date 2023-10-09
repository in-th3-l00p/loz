import React, { useState } from "react";
import { getCart, CartItem, removeFromCart } from "../utils/cart";

const Cart = () => {
    const [cart, setCart] = useState<CartItem[]>(getCart());

    return (
        <section className="px-4 md:px-10 lg:px-32">
            <h2 className={"text-3xl font-bold py-10"}>Cos de cumparaturi</h2>
            {cart.map((item: CartItem, index: number) => (
                <div key={index} className="flex items-center justify-between p-3">
                    <p className="text-lg mb-3">
                        Id harta: {item.mapId}, Id locatie: {item.locationId}
                    </p>
                    <button 
                        type="button" 
                        className="button"
                        title="Sterge"
                        onClick={() => {
                            removeFromCart(item);
                            setCart(getCart());
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            ))}
            {cart.length === 0 && <h3 className="text-xl text-center">Nu ai niciun loz in cos</h3>}
            <button 
                type="button" 
                className="button block mx-auto mt-10"
            >
                Cumpara
            </button>
        </section>
    );
}

export default Cart;
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";

const CART_KEY = "cart";
export interface CartItem {
    mapId: number;
    locationId: number;
}

export function addToCart(mapId: number, locationId: number) {
    let cart: CartItem[] = localStorage.getItem(CART_KEY) ? 
        JSON.parse(localStorage.getItem(CART_KEY)!) :
        [];
    if (cart.find(item => item.mapId === mapId && item.locationId === locationId))
        return;
    cart.push({ mapId, locationId });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(item: CartItem) {
    let cart: CartItem[] = localStorage.getItem(CART_KEY) ? 
        JSON.parse(localStorage.getItem(CART_KEY)!) :
        [];
    localStorage.setItem(CART_KEY, JSON.stringify(
        cart.filter((currentItem: CartItem) => 
            item.locationId !== currentItem.locationId || 
            item.mapId !== currentItem.mapId
        )
    ));
}

export function getCart(): CartItem[] {
    return localStorage.getItem(CART_KEY) ?
        JSON.parse(localStorage.getItem("cart")!) :
        [];
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    pfp_path: string;
    admin: boolean;
}

export interface Location {
    id: number;
    map_id: number;
    points: [number, number][];
    status: string;
    price?: number;
    image_path?: string;
    winner_text?: string;
    claimed_by?: number;
    claimed_at?: string;
}

export interface AdminLocation {
    id: number;
    points: [number, number][];
    available: boolean;
    winner: boolean;
    price: number;
    image_path: string;
    winner_text: string;
    claimed_by: number;
    claimed_at: string;
}

export interface Map {
    id: number;
    name: string;
    locations?: Location[];
}

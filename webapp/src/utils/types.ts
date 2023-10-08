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
    points: [number, number][];
    status: string;
    price?: number;
    image_path?: string;
    winner_text?: string;
    claimed_by?: number;
    claimed_at?: Date;
}

export interface Map {
    id: number;
    name: string;
    locations?: Location[];
}

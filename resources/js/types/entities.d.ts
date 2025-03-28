export interface Practice {
    id: number;
    name: string;
    logo: string;
    phone: string;
    address_id: string;
}

export interface Address {
    id: number;
    address_line: string;
    city: string;
    country: string;
}

export interface Patient {
    id: number;
    name: string;
    phone: string;
    sex: string;
    dni: string;
    dob: string;
}

export type Children = {
    children : React.ReactNode;
}

export interface User{
    id: String,
    name: String|null,
    email: String|null,
    image: String|null,
    birthDate: Date|null,
    address: String|null,
    locality: String|null,
    zip: number|null,
    campus: String|null,
    role: userRole
}

export enum userRole{
    ADMIN = 'admin',
    USER = 'user',
    BANNED = 'banned'
}
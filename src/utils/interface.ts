import { AnchorHTMLAttributes, ButtonHTMLAttributes, ChangeEvent } from "react";

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

export type ButtonProps = {
    href?: string;
    children: React.ReactNode;
  } & ButtonHTMLAttributes<HTMLButtonElement> &
    AnchorHTMLAttributes<HTMLAnchorElement>;

export interface InputProps {
        label: string;
        type: string;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
        classInput?: string;
      }
import { Request } from "express";

export interface IUser {
    id: number;
    fullName: string;
    email: string;
    password: string;
}

export interface IRequest extends Request {
    user: IUser
}
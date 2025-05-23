import axios from "axios";
import { IUsuario } from "../types";

export const api = axios.create({
    baseURL: "http://localhost:5000"
})

export const obterUsuario = async (): Promise<IUsuario[]> => {
 const { data } = await api.get<IUsuario[]>("/usuarios")
 return data
}
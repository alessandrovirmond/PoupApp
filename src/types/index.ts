export interface IUsuario{
    id: number;
    mome: string;
    renda: number
}

export interface ITransacao {
    id: number;
    nome: string;
    valor: number;
    tipo: "receita" | "despesa";
    categoria: string;
    data: string;
}
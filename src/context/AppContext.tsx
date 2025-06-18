import React, { createContext, useContext, useEffect, useState } from 'react'
import { ITransacao, IUsuario } from '../types';
import { criarTransacao, criarUsuario, obterTransacoes, obterUsuario } from '../api';

interface AppContextType {
  usuario: IUsuario | null;
  criaUsuario: (usuario: Omit<IUsuario, "id" | "orcamentoDiario">) => Promise<void>
  transacoes: ITransacao[];
  criaTransacao: (novaTransacao: Omit<ITransacao, "id" | "userId">) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const AppProvider = ({ children }: { children: React.ReactNode }) => {

  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [transacoes, setTransacoes] = useState<ITransacao[]>([])

  const carregaDadosUsuario = async () => {
    try {
      const usuarios = await obterUsuario();
      const transacoes = await obterTransacoes()
      if (usuarios.length > 0) {
        setUsuario(usuarios[0])
        setTransacoes(transacoes)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    carregaDadosUsuario();
  });

  const criaUsuario = async (usuario: Omit<IUsuario, "id" | "orcamentoDiario">) => {
    try {
      const novoUsuario = await criarUsuario(usuario)
      setUsuario(novoUsuario)
    } catch (e) {
      console.log(e)
    }
  }
 
  const criaTransacao = async (novaTransacao: Omit<ITransacao, "id" | "userId">) => {
    try{
      if(!usuario){
        throw new Error("Não podemos criar transacoes sem um usuario associado")
      }
      const {transacao, novoOrcamentoDiario} = await criarTransacao(novaTransacao, usuario)
      setTransacoes((prev) => [...prev, transacao])
      setUsuario((prev) => prev? {...prev, orcamentoDiario: novoOrcamentoDiario } : null) 
    }catch(e) {
      console.log(e)
    }
  }

  return (
    <AppContext.Provider value={{ usuario, criaUsuario, transacoes, criaTransacao }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContex = () => {
  const context = useContext(AppContext)

  if(!context ){
    throw new Error("UseAppContext deve ser usado dentro de um Provider")
  }

  return context;
}


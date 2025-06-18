import { useMemo } from "react";
import { useAppContex } from "../context/AppContext";

const useGatosPorCategoria = () => {
    const { transacoes } = useAppContex();

    const gastosPorCategoria = useMemo(() => {
        return transacoes
            .filter((transacao) => transacao.tipo === "despesa")
            .reduce<Record<string, number>>(
                (total, transacao) => {
                    total[transacao.categoria] =
                        (total[transacao.categoria] || 0) + transacao.valor;
                        return total
                }, {}
            );
    }, [transacoes]);

    return gastosPorCategoria;
};

export default useGatosPorCategoria;

import { createContext, useEffect, useState  } from "react";
import axios from "axios";

interface ContextTypes{
    tarefas: TarefasTypes[];
    AddTarefa: (titulo: string, dataLimite: string, custo: string) => void;
    EditTarefa: (titulo: string, dataLimite: string, custo: string, id: number) => void;
    DeletarTarefa: (id: number) => void;
    DeletarTudo: () => void;
}

interface TarefasTypes{
    id: number;
    titulo: string;
    custo: string;
    dataLimite: string;
    ordem: number;
}

interface DefaultTypes{
    children: JSX.Element
}

export const context = createContext({} as ContextTypes);

const api = "http://localhost:8000";

export default function Context({children}: DefaultTypes){
    
    const [tarefas, setTarefas] = useState<TarefasTypes[]>([]);

    const DeletarTudo = () => {
        axios.delete(`${api}/limpar`)
        .then(() => console.log('Tudo Limpo'))
        .catch((error) => console.log(error))
    }
    
    const DeletarTarefa = async (id: number) => {
        await axios.delete(`${api}/tarefas/${id}`)
        .catch((error) => console.log(error))
    }
   
    const EditTarefa = async (titulo: string, dataLimite: string, custo: string, id: number) => {
        await axios.patch(`${api}/tarefas/${id}`, { 
            id: id,
            titulo: titulo,
            dataLimite: new Date(dataLimite).toISOString(),
            custo: custo
        })
        .catch((error) => console.log(error))
    }

    const AddTarefa = async (titulo: string, dataLimite: string, custo: string) => {
        await axios.post(`${api}/tarefas`, {
          titulo: titulo,
          dataLimite:new Date(dataLimite).toISOString(),
          custo: custo
        })
        .catch((error) => console.log(error))
    }
    
    useEffect(() => {
        axios.get(`${api}/tarefas`)
        .then((response) => {
            setTarefas(response.data);
        })
        .catch((error) => console.log(error))
    },[tarefas, AddTarefa, EditTarefa, DeletarTarefa, DeletarTudo])

    return(
        <context.Provider value={{tarefas, AddTarefa, EditTarefa, DeletarTarefa, DeletarTudo }}>
            {children}
        </context.Provider>
    )
}
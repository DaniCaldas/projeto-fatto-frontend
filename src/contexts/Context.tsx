import { createContext, useEffect, useState  } from "react";
import axios from "axios";

interface ContextTypes{
    tarefas: TarefasTypes[];
    status: number;
    AddTarefa: (titulo: string, descricao: string) => void;
    EditTarefa: (titulo: string, descricao: string, id: number) => void;
    DeletarTarefa: (id: number) => void;
    DeletarTudo: () => void;
    MudarEstadoTarefa: (status: string, id: number) => void
}

interface TarefasTypes{
    id: number;
    titulo: string;
    descricao: string;
    status: string;
}

interface DefaultTypes{
    children: JSX.Element
}

export const context = createContext({} as ContextTypes);

const api = "https://deplou-crud-springboot.onrender.com/lista";

export default function Context({children}: DefaultTypes){
    
    const [tarefas, setTarefas] = useState<TarefasTypes[]>([]);
    const [status, setStatus] = useState(Number);

    const DeletarTudo = () => {
        axios.delete(`${api}/DeletarTudo`)
        .then(() => console.log('Tudo Limpo'))
        .catch((error) => console.log(error))
    }
    
    const DeletarTarefa = async (id: number) => {
        await axios.delete(`${api}/deletar`,{
            data:{
                id: id
            }
        })
        .catch((error) => console.log(error))
    }
   
    const EditTarefa = async (titulo: string, descricao: string, id: number) => {
        await axios.put(`${api}`, {
            id: id,
            titulo: titulo,
            descricao: descricao
        })
        .catch((error) => console.log(error))
    }

    const MudarEstadoTarefa = async (status: string, id: number) => {
        await axios.put(api, {
            id: id,
            status: status
        })
        .catch((error) => console.log(error))
    }   

    const AddTarefa = async (titulo: string, descricao: string) => {
        await axios.post(`${api}/tarefas`, {
          titulo: titulo,
          descricao: descricao,
          status: "PENDENTE"
        })
        .catch((error) => console.log(error))
    }
    
    useEffect(() => {
        axios.get(`${api}/tarefas`)
        .then((response) => {
            setTarefas(response.data);
            setStatus(response.status);
        })
        .catch((error) => console.log(error))
    },[tarefas, AddTarefa, EditTarefa, DeletarTarefa, DeletarTudo, MudarEstadoTarefa ])

    return(
        <context.Provider value={{tarefas, status, AddTarefa, EditTarefa, DeletarTarefa, DeletarTudo, MudarEstadoTarefa}}>
            {children}
        </context.Provider>
    )
}
import { ReactElement, useContext, useState, useCallback, useEffect } from "react";
import { ChakraProvider, Input, Box, Button, Alert, AlertIcon, AlertDescription, Text, Heading, Spinner } from '@chakra-ui/react';
import axios from "axios";
import TarefaItem from "./components/TarefaItem";
import { context } from "./contexts/Context";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

axios.defaults.withCredentials = true;

function App() {
  const [titulo, setTitulo] = useState("");
  const [custo, setCusto] = useState("");
  const [dataLimite, setDatalimite] = useState("");
  const [alert, setAlert] = useState<ReactElement | null>();
  const { tarefas, AddTarefa, DeletarTudo} = useContext(context);
  const [tarefasOrdenadas, setTarefasOrdenadas] = useState(tarefas);

  const moveTarefa = useCallback((fromIndex: number, toIndex: number) => {
    const updatedTarefas = [...tarefasOrdenadas];
    const [movedItem] = updatedTarefas.splice(fromIndex, 1);
    updatedTarefas.splice(toIndex, 0, movedItem);
    setTarefasOrdenadas(updatedTarefas);
  }, [tarefas]);  

  useEffect(() => {
    setTarefasOrdenadas(tarefas);
  }, [tarefas.length]); 
  
  return (
    <ChakraProvider>
      <Box justifyContent="center" display="flex" flexDirection="column" alignItems="center" rowGap={5} marginTop={25}>
        <Box w="40%" m={[0, "auto"]} display="flex" flexDirection="column" rowGap={5}>
          <Heading as='h2' size='2xl'>To do List</Heading>
          <Input required value={titulo} placeholder='Titulo da Tarefa' size='lg' variant='outline' onChange={(e) => setTitulo(e.target.value)} />
          <Input required type="number" value={custo} placeholder='Custo da Tarefa' size='lg' variant='outline' onChange={(e) => setCusto(e.target.value)} />
          <Input required type="datetime-local" value={dataLimite} placeholder='Data de finalização da Tarefa' size='lg' variant='outline' onChange={(e) => setDatalimite(e.target.value)} />

          {alert}

          <Button colorScheme='teal' size='lg' onClick={() => {
            if (titulo === "" || custo === "" || dataLimite === "") {
              setAlert(
                <Alert status='error'>
                  <AlertIcon />
                  <AlertDescription>Há campos vazios que precisam ser preenchidos!</AlertDescription>
                </Alert>
              );
              setTimeout(() => setAlert(null), 4000);
            } else {
              AddTarefa(titulo, dataLimite, custo);
              setTitulo("");
              setCusto("");
              setDatalimite("");
              setAlert(
                <Alert status='success'>
                  <AlertIcon />
                  <AlertDescription>Tarefa adicionada com sucesso!</AlertDescription>
                </Alert>
              );
              setTimeout(() => setAlert(null), 4000);
            }
          }}>
            Adicionar
          </Button>
        </Box>

          <Box justifyContent="center" alignItems="center" flexDirection="column" marginTop={25}>
          <Heading paddingBottom={8} textAlign="center">Tarefas</Heading>
          <Text textAlign="center" color="#ef233c" onClick={DeletarTudo} cursor="pointer">Limpar Tudo</Text>
          <Text paddingTop={7}>Tarefas: {tarefasOrdenadas.length}</Text>
          </Box>
          <DndProvider backend={HTML5Backend}> 
                <Box display="flex" flexDirection="column">
                  {
                    tarefasOrdenadas.map((tarefa, index) => {
                      return (
                          <TarefaItem key={tarefa.id} moveTarefa={moveTarefa} index={index} titulo={tarefa.titulo} id={tarefa.id} custo={tarefa.custo} dataLimite={tarefa.dataLimite} ordem={tarefa.ordem}/>
                        )}
                    )
                  }
                </Box>
        </DndProvider>
      </Box>
    </ChakraProvider>
  );
}

export default App;

import { useContext, useState } from "react";
import {
    Input, Box, Button, Textarea, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Text, Icon, Spinner
} from '@chakra-ui/react'
import { CloseIcon, EditIcon, CheckIcon, RepeatIcon } from '@chakra-ui/icons'
import { context } from "../contexts/Context";

interface TarefasTypes {
    id: number;
    titulo: string;
    descricao: string;
    status: string;
}

const StatusText = ({ status }: { status: string }) => {
    let statusColor;
    switch (status) {
        case "PENDENTE":
            statusColor = "red.500";
            break;
        case "EM_ANDAMENTO":
            statusColor = "blue.500";
            break;
        case "CONCLUIDO":
            statusColor = "green.500";
            break;
        default:
            statusColor = "gray.500";
    }

    return <Text color={statusColor} fontSize="sm">{status}</Text>
}


const TarefaItem = (tarefas: TarefasTypes[]) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { EditTarefa, DeletarTarefa, MudarEstadoTarefa, status } = useContext(context)
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    const handleEditClick = (tarefa: TarefasTypes) => {
        setTitulo(tarefa.titulo)
        setDescricao(tarefa.descricao)
        onOpen()
    }

    const handleEditTarefa = (id: number) => {
        EditTarefa(titulo, descricao, id);
        onClose();
    }

    return (
        <Box alignItems="center" display="inline-flex" flexDirection="column">
            {
                tarefas.length > 0 ?
                    tarefas.map
                        ((tarefa) => (
                            <Box width={60} border="" borderRadius={5} padding={4} textAlign="center" columnGap={7} display="inline-flex" flexDirection="row" marginBottom={5} boxShadow=" rgba(0, 0, 0, 0.24) 0px 3px 8px;" key={tarefa.id}>
                                <Box flexDirection="column" display="inline-flex" justifyContent="center" rowGap={4} borderRight="1px" paddingRight={3}>
                                    <Icon as={CloseIcon} cursor="pointer" color='red.500' onClick={() => DeletarTarefa(tarefa.id)} />
                                    <Icon as={CheckIcon} cursor="pointer" color='green.500' onClick={() => MudarEstadoTarefa("CONCLUIDO", tarefa.id)} />
                                    <Icon as={RepeatIcon} cursor="pointer" color='black.500' onClick={() => MudarEstadoTarefa("EM_ANDAMENTO", tarefa.id)} />
                                    <Icon as={EditIcon} cursor="pointer" color='blue.500'
                                        onClick={() => {
                                            handleEditClick(tarefa)
                                        }} />
                                </Box>
                                <Box flexDirection="column" rowGap={4} display="flex" textAlign="left">
                                    <Text fontSize="lg" as="u">{tarefa.titulo}</Text>
                                    <Text color="#212529" fontSize="md">{tarefa.descricao}</Text>
                                    <StatusText status={tarefa.status} />
                                </Box>

                                <Box marginTop={3} gap={5} flexDirection="row" display="inline-flex">
                                    {/* MODAL */}
                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Alterar Tarefa</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody gap={5} flexDirection="column" display="flex">
                                                <Input size='md' variant='outline' value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                                                <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button colorScheme='blue' mr={3} onClick={() => {
                                                    handleEditTarefa(tarefa.id)
                                                }}>
                                                    Editar
                                                </Button>
                                                <Button variant='ghost' onClick={onClose}>Fechar</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </Box>
                            </Box>
                        ))
                    : status === 0 ? (
                        <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                        padding={5}
                        />
                    ) :
                    <Text>
                        Nenhuma Tarefa Adicionada!
                    </Text>
            }
            <Text paddingTop={7}>Tarefas: {tarefas.length}</Text>
        </Box>
    );
}

export default TarefaItem;
import { useContext, useState } from "react"; 
import {
    Input, Box, Button, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Icon, useDisclosure
} from '@chakra-ui/react';
import { CloseIcon, EditIcon, CheckIcon, RepeatIcon } from '@chakra-ui/icons';
import { context } from "../contexts/Context";
import { useDrag, useDrop } from 'react-dnd';

interface TarefasTypes {
    id: number;
    titulo: string;
    dataLimite: string;
    custo: string;
    ordem: number;
    moveTarefa: (fromIndex: number, toIndex: number) => void;
    index: number;
}

const TarefaItem = ({id, titulo, custo, dataLimite, ordem, index, moveTarefa}: TarefasTypes) => {
    const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
    var cor = "";
    Number(custo) >= 1000 ? cor = "red" : cor = "black"
    const { EditTarefa, DeletarTarefa } = useContext(context);
    const [tituloEdit, setTitulo] = useState("");
    const [dataLimiteEdit, setDataLimite] = useState(new Date().toISOString().slice(0, 16));
    const [custoEdit, setCusto] = useState("");
    
    // UseDisclosure para os dois modais
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

    const handleEditClick = () => {
        setTitulo(titulo);
        setDataLimite(dataLimite);
        setCusto(custo);
        onOpenEdit(); // Abrir o modal de edição
    }

    const handleExcluirClick = (id: number) => {
        onOpenDelete(); // Abrir o modal de exclusão
    }

    const handleEditTarefa = (id: number) => {
        EditTarefa(tituloEdit, dataLimiteEdit, custoEdit, id);
        onCloseEdit(); // Fechar o modal de edição após salvar
    }

    const handleExcluirTarefa = (id: number) => {
        DeletarTarefa(id);
        onCloseDelete(); // Fechar o modal de exclusão após excluir
    }

    const [, dragRef] = useDrag({
        type: 'TAREFA',
        item: { id, index }
    });

    const [, dropRef] = useDrop({
        accept: 'TAREFA',
        hover: (draggedItem: { id: number; index: number }) => {
            if (draggedItem.index !== index) {
                moveTarefa(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <Box
            width={80}
            padding={4}
            textAlign="center"
            columnGap={7}
            display="inline-flex"
            flexDirection="row"
            marginBottom={5}
            boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
            ref={(node) => dragRef(dropRef(node))}
        >
            <Box flexDirection="column" display="inline-flex" justifyContent="center" rowGap={4} borderRight="1px" paddingRight={3}>
                <Icon as={CloseIcon} cursor="pointer" color='red.500' onClick={() => handleExcluirClick(id)} />
                <Icon as={EditIcon} cursor="pointer" color='blue.500' onClick={handleEditClick} />
            </Box>
            <Box flexDirection="column" rowGap={4} display="flex" textAlign="left">
                <Text fontSize="lg" as="u">{titulo}</Text>
                <Text fontSize="lg" as="u">{new Date(dataLimite).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                })}</Text>
                <Text fontSize="lg" color={cor} as="u">{formatador.format(Number(custo))}</Text>
            </Box>

            {/* Modal de Edição */}
            <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Alterar Tarefa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody gap={5} flexDirection="column" display="flex">
                        <Input size='md' variant='outline' value={tituloEdit} onChange={(e) => setTitulo(e.target.value)} />
                        <Input size='md' variant='outline' value={custoEdit} onChange={(e) => setCusto(e.target.value)} />
                        <Input
                            size='md'
                            type="datetime-local"
                            variant='outline'
                            value={new Date(dataLimiteEdit).toISOString().slice(0, 16)}
                            onChange={(e) => setDataLimite(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => handleEditTarefa(id)}>
                            Editar
                        </Button>
                        <Button variant='ghost' onClick={onCloseEdit}>Fechar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal de Exclusão */}
            <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Excluir Tarefa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody gap={5} flexDirection="column" display="flex">
                        <Text>Deseja excluir esta tarefa?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleExcluirTarefa(id)}>
                            Excluir
                        </Button>
                        <Button variant='ghost' onClick={onCloseDelete}>Fechar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default TarefaItem;

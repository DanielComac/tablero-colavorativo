import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import SimpleModal from '../components/SimpleModal';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function SpaceDetails() {
    const { id } = useParams();
    const token = useAuthStore(state => state.token);
    const [spaceDetails, setSpaceDetails] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [editCardId, setEditCardId] = useState(null); 
    const [isCopied, setIsCopied] = useState({});

    const fetchSpaceDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/spaces/${id}/cards`, {
                headers: { "token": token }
            });
            setSpaceDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching space details:', error);
            setSpaceDetails([]);
        }
    };

    useEffect(() => {
        fetchSpaceDetails();
    }, [id, token]);

    if (!spaceDetails) return <div>Loading...</div>

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("title", title);
        formData.append("description", description);
        if (file) {
            formData.append('file', file);
        }

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'token': token,
            },
        };
        try {
            await axios.post(`http://localhost:5000/api/spaces/${id}/cards`, formData, config);
            setModalOpen(false);
            fetchSpaceDetails();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const openFile = async (cardId: any) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/card/${cardId}/file`, {
                responseType: 'blob', // Important to get the file as a Blob
                // headers: { "token": token }
            });

            const contentType = response.headers['content-type'];

            const file = new Blob([response.data], { type: contentType });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error('Error opening file:', error);
        }
    };

    const copyLinkToClipboard = async (cardId: any) => {
        try {
            const url = `http://localhost:5173/card/${cardId}/share`;
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 800);
        } catch (error) {
            console.error('Error copying link to clipboard:', error);
        }
    };

    const handleEditClick = (cardId: any) => {
        // Cuando se hace clic en "Editar", establece el ID de la tarjeta que se está editando y abre el modal de edición
        setEditCardId(cardId);
        setModalOpen(true);
    };

    const handleDeleteClick = async (cardId: any) => {
        try {
            await axios.delete(`http://localhost:5000/api/spaces/${id}/cards/${cardId}`, {
                headers: {
                    'token': token,
                },
            });
            // Elimina la tarjeta del estado después de eliminarla en el servidor
            setSpaceDetails(prevSpaceDetails => prevSpaceDetails.filter((detail: any) => detail.id !== cardId));
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    return (
        <>
            <div className='flex flex-row items-center gap-5'>
                <p className='text-2xl font-bold'>Informacion</p>
                <button onClick={() => setModalOpen(true)} className="text-white bg-emerald-600 hover:bg-emerald-500 p-2 rounded-md mt-2">Agregar</button>
            </div>

             {/* CARDS */}
             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {spaceDetails.map((detail: any) => (
                    <div key={detail.id} className="max-w-80 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5 relative">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{detail.title}</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{detail.description}</p>
                        
                        {/* @ts-ignore */}
                        <Tooltip title={isCopied[detail.id] ? "Enlace copiado" : "Copiar enlace"} className='cursor-pointer'>
                            {/* @ts-ignore */}
                            <button onClick={() => copyLinkToClipboard(detail.id)} className='text-white absolute top-4 right-4'>{isCopied[detail.id] ? <AssignmentTurnedInIcon /> : <ContentPasteIcon />}</button>
                        </Tooltip>
                        
                        <button onClick={() => openFile(detail.id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Ver documento

                        </button>

                        <div className="absolute bottom-2 right-2 flex gap-2">
                        <button onClick={() => handleEditClick(detail.id)} className="text-white bg-yellow-500 p-2 mb-4 mr-0.3 rounded-md hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                                <EditIcon />
                            </button>
                            <button onClick={() => handleDeleteClick(detail.id)} className="text-white bg-red-500 p-2 mb-4 rounded-md hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300">
                                <DeleteIcon />
                            </button>
                            
                        </div>
                    </div>
                ))}
            </div>

            <SimpleModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold mb-4 text-white">{editCardId ? "Editar detalles" : "Agregar nuevos detalles"}</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-white">Titulo</label>
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-white dark:border-emerald-600 dark:placeholder-emerald-400 dark:text-black dark:focus:ring-emerald-500 dark:focus:border-emerald-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">Descripcion</label>
                        <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="textarea bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-white dark:border-emerald-600 dark:placeholder-emerald-400 dark:text-black dark:focus:ring-emerald-500 dark:focus:border-emerald-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="file" className="block mb-2 text-sm font-medium text-white">Documento</label>
                        <input id="file" type="file" accept="image/*, video/*, application/pdf" onChange={(e: any) => setFile(e?.target?.files[0])} required className='text-white' />
                    </div>

                    <button type="submit" className="text-white mt-2 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm w-full p-2 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">{editCardId ? "Guardar cambios" : "Subir"}</button>
                </form>
            </SimpleModal>
        </>
    )
}

export default SpaceDetails;

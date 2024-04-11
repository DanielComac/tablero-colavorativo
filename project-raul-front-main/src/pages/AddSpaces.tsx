import { useState } from 'react'
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

function AddSpaces() {
    const [name, setName] = useState("");
    const userId = useAuthStore(state => state.userId);
    const token = useAuthStore(state => state.token);
    const fetchSpaces = useAuthStore(state => state.fetchSpaces);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const requestBody = {
                userId: userId,
                name: name
            }
            const config = {
                headers: { "token": token }
            }
            await axios.post('http://localhost:5000/api/spaces', requestBody, config);
            alert("Espacio agregado")
            fetchSpaces();
        } catch (error) {
            //@ts-ignore
            if (error.response) {
                console.log(error);
                //@ts-ignore
            } else if (error.request) {
                console.log(error);
            }
            console.error("Login error:", error);
        }
    }
    
    return (
        <div className="flex justify-center items-center h-[60vh]">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col w-full">
                <p className="text-center text-3xl font-bold mb-5">Agregar nuevo espacio</p>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-emerald-900">Nombre:</label>
                    <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-white-700 dark:border-emerald-600 dark:placeholder-emerald-400 dark:text-emerald dark:focus:ring-emerald-500 dark:focus:border-emerald-500" placeholder="Nombre del espacio" required />
                </div>
                <button type="submit" className="bg-transparent hover:bg-emerald-500 text-emerald-700 font-semibold hover:text-white py-2 px-4 border border-emerald-500 hover:border-transparent rounded">Agregar</button>
            </form>
        </div>
    )
}

export default AddSpaces
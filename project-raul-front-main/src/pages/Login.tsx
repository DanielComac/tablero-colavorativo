import axios from "axios";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

function Login() {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const setToken = useAuthStore((state) => state.setToken);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/user/auth', { nombre, password });
            if (response.data.token) {
                setToken(response.data.token, response.data.result[0].id);
                setError("");
            }
        } catch (error) {
            //@ts-ignore
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError("Credenciales incorrectas"); // Set error message
                //@ts-ignore
            } else if (error.request) {
                // The request was made but no response was received
                setError("The server did not respond. Please try again later.");
            } else {
                // Something happened in setting up the request that triggered an Error
                setError("An error occurred. Please try again.");
            }
            console.error("Login error:", error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="">
            <img className="w-30 h-20 mb-10" src="https://i0.wp.com/utd.edu.mx/wp-content/uploads/2022/07/LOGO-UTD-NUEVO-2022_solo-01.png?fit=1024%2C387&ssl=1"/>

                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email</label>
                    <input id="name" value={nombre} onChange={(e) => setNombre(e.target.value)} className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  dark:border-emerald-600 dark:placeholder-emerald-400 dark:text-black dark:focus:ring-emerald-500 dark:focus:border-emerald-500" placeholder="Tu correo electrónico" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5  dark:border-emerald-600 dark:placeholder-emerald-400 dark:text-black dark:focus:ring-emerald-500 dark:focus:border-emerald-500" placeholder="Tu contraseña" required />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Iniciar</button>
            </form>
        </div>
    )
}

export default Login
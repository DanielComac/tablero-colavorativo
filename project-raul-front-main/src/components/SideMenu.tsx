import { useEffect, useState } from "react"
import { useAuthStore } from "../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";

function SideMenu({ children }: { children: any }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    // const [spaces, setSpaces] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const logout = useAuthStore(state => state.logout);
    // const token = useAuthStore(state => state.token);
    const fetchSpaces = useAuthStore(state => state.fetchSpaces);
    const spaces = useAuthStore(state => state.spaces);

    const handleLogout = () => {
        logout();
    };

    // async function getSpaces() {
    //     try {
    //         const data = await axios.get("http://localhost:5000/api/spaces", { headers: { "token": token } });
    //         setSpaces(data.data.data);
    //     } catch (error) {
    //         console.error(error)
    //         alert({
    //             header: 'There was an error',
    //             message: 'Please try again later'
    //         })
    //         setSpaces([]);
    //     }
    // }

    useEffect(() => {
        fetchSpaces();
    }, [fetchSpaces]);
    
    const handleSpaceClick = (spaceId: any) => {
        navigate(`/spaces/${spaceId}/cards`);
    };

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-emerald-200 bg-emerald-700 dark:border-emerald-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                        <img className="w-10 h-10" src="https://i0.wp.com/utd.edu.mx/wp-content/uploads/2022/07/LOGO-UTD-NUEVO-2022_solo-01.png?fit=1024%2C387&ssl=1" />
                            <a className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Tableros</span>
                            </a>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3 flex-col">
                                <div>
                                    <button type="button" onClick={toggleDropdown} className="flex text-sm bg-emerald-800 rounded-full focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-8 h-8 rounded-full" src="https://picsum.photos/200" alt="user photo" />
                                    </button>
                                </div>
                                <div className={`z-50 ${isDropdownOpen ? 'flex absolute mt-10 mr-1' : 'hidden'} my-4 text-base list-none bg-white divide-y divide-emerald-100 rounded shadow dark:bg-emerald-700 dark:divide-emerald-600`} id="dropdown-user">
                                    <ul className="py-1" role="none">
                                        <li>
                                            <button onClick={handleLogout} className="block px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white">Logout</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 p-3 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-emerald-200 sm:translate-x-0 bg-emerald-700 dark:border-emerald-700" aria-label="Sidebar">
                <div className="px-3 pb-4 overflow-y-auto bg-white bg-emerald-700 h-auto max-h-[55vh] relative">
                    <ul className="space-y-2 font-medium">
                        {spaces.map((space: any) => (
                            <li key={space.id} onClick={() => handleSpaceClick(space.id)}>
                                <p className={`flex items-center p-2 text-white hover:bg-emerald-600 rounded-lg ms-3 cursor-pointer ${location.pathname === `/spaces/${space.id}/cards` ? 'bg-emerald-800' : ''}`}>{space.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-center mt-8">
                    <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full mt-80" onClick={() => navigate("/add-spaces")}>Crear tablero</button>
                </div>
            </aside>

            <main className="mt-16 ml-72">
                {children}
            </main>
        </>
    )
}

export default SideMenu
import React, {ReactElement, useContext} from "react";
import api from "../utils/api";
import AuthContext from "../hooks/Auth";

interface LayoutProps {
    children: ReactElement | ReactElement[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const auth = useContext(AuthContext);

    return (
        <>
            <header className={"w-full bg-indigo-950 py-3 px-20 flex justify-between items-center"}>
                <h1 className={"text-2xl font-bold"}>tarantula</h1>
                {auth.user !== null ? (
                    <div className="flex gap-5">
                        {!auth.user.admin && (
                            <a
                                href="/cart"
                                className={"text-center p-2 bg-space rounded-lg hover:bg-federal"}
                                title={"Cos de cumparaturi"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </a>
                        )}
                        <button
                            className={"p-2 bg-space rounded-lg hover:bg-federal"}
                            title={"Logout"}
                            onClick={() =>
                                api.get("/sanctum/csrf-cookie")
                                    .then(() => api.post("/logout"))
                                    .then(() => window.location.href = "/login")
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <span className="flex gap-5">
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </span>
                )}
            </header>
            {children}
        </>
    );
}

export default Layout;

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
                {auth.user !== null && (
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
                )}
            </header>
            {children}
        </>
    );
}

export default Layout;

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import Layout from "./components/Layout";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import Login from "./routes/Login";
import {User} from "./utils/types";
import AuthContext from "./hooks/Auth";
import api from "./utils/api";
import Home from "./routes/Home";
import MapCreate from "./routes/maps/MapCreate";
import MapDisplay from './routes/maps/Map';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/maps/create",
        element: <MapCreate />
    },
    {
        path: "/maps/:id",
        element: <MapDisplay />
    }
]);

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get("/api/user")
            .then(resp => {
                resp.data.admin = !!resp.data.admin;
                setUser(resp.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return <p>Loading...</p>
    return (
        <AuthContext.Provider value={{ user }}>
            <Layout>
                <RouterProvider router={router} />
            </Layout>
        </AuthContext.Provider>
    );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

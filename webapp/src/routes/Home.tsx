import React, {useContext, useEffect, useState} from "react";
import { Map } from "../utils/types";
import api from "../utils/api";

import "./../styles/home.css";
import AuthContext from "../hooks/Auth";
import {Link} from "react-router-dom";

const MapDisplay: React.FC<{ map: Map }> = ({ map }) => {
    return (
        <Link to={"/maps/" + map.id} className={"map-display"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-36 h-36">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            <h3 className={"text-2xl"}>{map.name}</h3>
        </Link>
    );
}

const Home = () => {
    const auth = useContext(AuthContext);
    const [maps, setMaps] = useState<Map[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get("/api/maps")
            .then(resp => setMaps(resp.data["data"]))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return <p>loading...</p>
    return (
        <section className={"p-10 flex flex-wrap gap-10"}>
            {maps.map((map, index) =>
                <MapDisplay key={index} map={map} />
            )}
            {auth.user?.admin && (
                <Link to={"/maps/create"} className={"map-display justify-center"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-36 h-36">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </Link>
            )}
        </section>
    );
}

export default Home;

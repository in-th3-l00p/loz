import React, {useContext, useEffect, useRef, useState} from "react";
import { Location, Map } from "../utils/types";
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

const LocationDisplay: React.FC<{ location: Location }> = ({ location }) => {
    const fileInput = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-indigo-950 p-10 rounded-md shadow-2xl">
            <h2 className="text-3xl mb-5">Locatie #{location.id}</h2>
            <p className="mb-5">Id harta: <a href={`/maps/${location.map_id}`}>{location.map_id}</a></p>
            {location.image_path && (
                <>
                    <p>Imagine:</p>
                    <img 
                        src={"http://localhost:8000" + location.image_path} 
                        alt="location" 
                        className="w-32 h-32 m-5" 
                    />
                </>
            )}

            <span className="flex gap-5">
                <a className="button" href={`/maps/${location.map_id}/locations/${location.id}/redeem`}>
                    Razuire
                </a>

                <input 
                    ref={fileInput} type="file" accept="image/png" className="hidden" 
                    onChange={(e) => {
                        if (e.currentTarget.files?.length !== 1)
                            return;
                        const formData = new FormData();
                        formData.append("image", e.currentTarget.files.item(0)!);
                        api.post(
                            `/api/maps/${location.map_id}/locations/${location.id}/image`, 
                            formData
                        )
                            .then(() => window.location.reload());
                    }}
                />
                <button 
                    type="button" className="button"
                    onClick={() => {
                        if (fileInput.current)
                            fileInput.current.click();
                    }}
                >
                    Incarca imagine
                </button>
            </span>
        </div>
    );
}

const Home = () => {
    const auth = useContext(AuthContext);
    const [maps, setMaps] = useState<Map[]>([]);
    const [locations, setLocations] = useState<Location[]>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get("/api/maps")
            .then(resp => setMaps(resp.data["data"]))
            .finally(() => setLoading(false));
        if (auth.user && !auth.user?.admin) {
            api.get("/api/locations")
                .then(resp => setLocations(resp.data["data"]))
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading)
        return <p>loading...</p>
    return (
        <div>
            {auth.user && !auth.user.admin && (
                <section className="p-10">
                    <h2 className="text-xl mb-5">Locatiile mele:</h2>
                    <div className="flex flex-col flex-wrap gap-10">
                        {locations && locations?.map((location, index) => (
                            <LocationDisplay key={index} location={location} />
                        ))}
                    </div>
                </section>
            )}
            <section className={"p-10"}>
                <h2 className="text-xl mb-5">Harti</h2>
                <div className="flex flex-wrap gap-10">
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
                </div>
            </section>
        </div>
    );
}

export default Home;

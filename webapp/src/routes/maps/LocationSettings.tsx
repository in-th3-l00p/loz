import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { Location } from "../../utils/types";

const LocationSettings = () => {
    const { mapId, locationId } = useParams();
    const [location, setLocation] = useState<Location>();
    const [loading, setLoading] = useState(true);

    const [available, setAvailable] = useState(false);

    useEffect(() => {
        api.get(`/api/maps/${mapId}/locations/${locationId}`)
            .then(resp => {
                setLocation(() => resp.data["data"]);
                setAvailable(() => location?.status! === "available");
            })
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        if (
            location && 
            location.status !== "unavailable" && 
            location.status === "available"
        )
            window.location.href = "/maps/" + mapId;
    }, [location])

    if (loading)
        return <p>loading...</p>
    return (
        <section className="px-4 md:px-10 lg:px-32">
            <h2 className={"text-3xl font-bold py-10"}>Loz: {location?.id}</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                api.put(
                    `/api/admin/maps/${mapId}/locations/${locationId}/status`,
                    { available }
                )
                    .then(() => window.location.href = "/maps/" + mapId);
            }}>
                <div className="flex gap-5 mb-5">
                    <label className="form-label" htmlFor="available">Avabila:</label>
                    <input 
                        type="checkbox" 
                        name="available" 
                        id="available"
                        onChange={(e) => setAvailable(e.target.checked)}
                    ></input>
                </div>
                <div className="flex gap-5">
                    <button type="submit" className="button">Salveaza</button>
                    <a href={`/maps/${mapId}`} className="button">Anuleaza</a>
                </div>
            </form>
        </ section>
    );
}

export default LocationSettings;
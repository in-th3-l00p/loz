import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import { Location } from "../../../utils/types";

const LocationSettings = () => {
    const { mapId, locationId } = useParams();
    const [location, setLocation] = useState<Location>();
    const [loading, setLoading] = useState(true);

    const [available, setAvailable] = useState(false);
    const [winner, setWinner] = useState(false);

    useEffect(() => {
        api.get(`/api/maps/${mapId}/locations/${locationId}`)
            .then(resp => {
                setLocation(() => resp.data["data"]);
                setAvailable(() => location?.status! === "available");
            })
            .finally(() => setLoading(false))
    }, []);

    if (loading)
        return <p>loading...</p>
    return (
        <section className="px-4 md:px-10 lg:px-32">
            <h2 className={"text-3xl font-bold py-10"}>Loz: {location?.id}</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                if (data.has("winner")) {
                    api.put(
                        `/api/admin/maps/${mapId}/locations/${locationId}`,
                        { 
                            available, 
                            winner: data.get("winner") === "true" ? true : false,
                            winner_text: data.get("winner_text")
                        }
                    )
                        .then(() => window.location.href = "/maps/" + mapId);
                    return;
                }

                api.put(
                    `/api/admin/maps/${mapId}/locations/${locationId}`,
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
                    />
                </div>
                {available && (
                    <div className="flex gap-5 mb-5">
                        <label htmlFor="winner" className="form-label">Status</label>
                        <select 
                            name="winner" 
                            id="winner" 
                            className="text-black text-xl"
                            onChange={(e) => setWinner(e.target.value === "true" ? true : false)}
                        >
                            <option value="false" className="text-xl">Pierzator</option>
                            <option value="true" className="text-xl">Castigator</option>
                        </select>
                    </div>
                )}
                {(available && winner) && (
                    <div className="flex items-center gap-5 mb-5">
                        <label htmlFor="winner_text" className="form-label">Text</label>
                        <input type="text" name="winner_text" id="winner_text" className="form-input" />
                    </div>
                )}
                <div className="flex gap-5">
                    <button type="submit" className="button">Salveaza</button>
                    <a href={`/maps/${mapId}`} className="button">Anuleaza</a>
                </div>
            </form>
        </ section>
    );
}

export default LocationSettings;
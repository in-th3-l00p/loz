import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import { Location } from "../../../utils/types";

const LocationRedeem = () => {
    const { mapId, locationId } = useParams();
    const [location, setLocation] = useState<Location>();

    useEffect(() => {
        api.get(`/api/maps/${mapId}/locations/${locationId}`)
            .then(resp => {
                setLocation(() => resp.data["data"]);
                console.log(resp.data["data"]);
            })
            .catch(() => window.location.href = "/");
    }, []);

    if (!location)
        return <p>loading...</p>
    return (
        <section className="px-4 md:px-10 lg:px-32">
            <h2 className={"text-3xl font-bold py-10"}>Locatie: {location.id}</h2>
            {location.status === "claimed" && (
                <>
                    <p className="mb-3">Lozul nu a fost razuit</p>
                    <button 
                        type="button" className="button"
                        onClick={() => {
                            api.put(`/api/maps/${location.map_id}/locations/${location.id}/scratch`)
                                .then(() => window.location.reload());
                        }}
                    >
                        Razuieste
                    </button>
                </>
            )}
            {location.status === "winner" && (
                <p>Lozul este castigator. Mesajul este: <i>"{location.winner_text}"</i></p>
            )}
            {location.status === "not winner" && (
                <p>Lozul este necastigator.</p>
            )}
       </section>
    );
}

export default LocationRedeem;
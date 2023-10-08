import React, {useState} from "react";
import api from "../../utils/api";

const MapCreate = () => {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    if (loading)
        return <p>loading...</p>
    return (
        <form
            className={"flex flex-col justify-center pt-10"}
            onSubmit={e => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                setLoading(true);
                api.post("/api/maps", {
                    "name": data.get("name"),
                    "rectangles": data.get("rectangles")
                })
                    .then(() => window.location.href = "/")
                    .catch(err => {
                        if (err.response.data?.message)
                            setError(err.response.data.message)
                        else
                            setError("Server error");
                    })
                    .finally(() => setLoading(true));
            }}
        >
            <h1 className={"text-center text-5xl mb-10 font-bold"}>Create map</h1>
            {error && <p className={"text-center text-xl mb-5 text-red-300"}>{error}</p>}
            <div className={"form-group"}>
                <label htmlFor="name" className={"form-label"}>Name</label>
                <input type="text" id={"name"} name={"name"} className={"form-input"} />
            </div>
            <div className={"form-group"}>
                <label htmlFor="rectangles" className={"form-label"}>Rectangles</label>
                <input type="number" id={"rectangles"} name={"rectangles"} className={"form-input"} />
            </div>
            <button type={"submit"} className={"button mx-auto"}>Create</button>
        </form>
    );
}

export default MapCreate;

import React, {useState} from "react";
import {Link} from "react-router-dom";
import api from "../utils/api";

const Login = () => {
    const [error, setError] = useState<string>();

    return (
        <form
            className={"flex flex-col justify-center pt-10"}
            onSubmit={e => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                api.get("/sanctum/csrf-cookie")
                    .then(() =>
                        api.post("/login", {
                            email: data.get("email"),
                            password: data.get("password")
                        })
                            .then(() => window.location.href = "/")
                            .catch(() => setError("Email or password are invalid"))
                    )
            }}
        >
            <h1 className={"text-center text-5xl mb-10 font-bold"}>Login</h1>
            {error && <p className={"text-center text-xl mb-5 text-red-300"}>{error}</p>}
            <div className={"form-group"}>
                <label htmlFor="email" className={"form-label"}>Email</label>
                <input type="email" id={"email"} name={"email"} className={"form-input"} />
            </div>
            <div className={"form-group"}>
                <label htmlFor="password" className={"form-label"}>Password</label>
                <input type="password" id={"password"} name={"password"} className={"form-input"} />
            </div>
            <div className={"flex justify-center gap-8"}>
                <button type={"submit"} className={"button"}>Login</button>
                <Link
                    className={"button text-center"}
                    to={"/register"}
                >
                    Register
                </Link>
            </div>
        </form>
    );
}

export default Login;

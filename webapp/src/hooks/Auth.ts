import {createContext} from "react";
import {User} from "../utils/types";

export interface AuthContextProps {
    user: User | null;
}

const AuthContext = createContext<AuthContextProps>(
    { user: null }
);

export default AuthContext;

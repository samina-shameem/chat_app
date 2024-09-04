import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth hook must be used within an AuthProvider");
    }
    const { auth, login, logout } = context;
    if (auth === null || login === null || logout === null) {
        throw new Error("AuthContext is incomplete");
    }
    return context;
}


export default useAuth;
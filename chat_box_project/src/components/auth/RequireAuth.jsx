import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    console.debug('RequireAuth', { auth, location });

    return (
        auth?.username
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}


export default RequireAuth;

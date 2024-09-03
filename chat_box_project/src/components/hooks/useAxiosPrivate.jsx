import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const [csrfToken, setcsrfToken] = useState({});

  // List of endpoints that require CSRF token
  const csrfEndpoints = ["/auth/register", "/auth/token"];

  // List of endpoints that require JWT
  const jwtEndpoints = ["/messages", "/users", "/user"];

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // Add JWT to the Authorization header if required
        if (jwtEndpoints.some((endpoint) => config.url.includes(endpoint))) {
          if (!config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
          }
        }

        // Add CSRF token to the request body if required
    if (csrfEndpoints.some(endpoint => config.url.includes(endpoint))) {        
        if (!csrfToken) {            
            setcsrfToken(await fetchCsrfToken());
        }
        config.data = {
            ...config.data,
            csrfToken: csrfToken,
        };
    }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await generateToken();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;

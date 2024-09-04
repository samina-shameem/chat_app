import { axiosPrivate } from "../api/axios";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { fetchCsrfToken, generateToken } from "../../services/apiService";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);

  // List of endpoints that require CSRF token
  const csrfEndpoints = ["/auth/register", "/auth/token"];

  // List of endpoints that require JWT
  const jwtEndpoints = ["/messages", "/users", "/user"];

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        // Add JWT to the Authorization header if required
        if (jwtEndpoints.some((endpoint) => config.url.includes(endpoint))) {
          if (auth?.accessToken && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
          }
        }

        // Add CSRF token to the request body if required
        if (csrfEndpoints.some((endpoint) => config.url.includes(endpoint))) {
          if (!csrfToken) {
            try {
              const token = await fetchCsrfToken();              
              setCsrfToken(token);
              config.data = {
                ...config.data,
                csrfToken: token,
              };
            } catch (error) {
              console.error("Failed to fetch CSRF token:", error);
              return Promise.reject(error);
            }
          } else {
            config.data = {
              ...config.data,
              csrfToken: csrfToken,
            };
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // Check for 403 Forbidden errors and handle JWT refresh
        if (error?.response?.status === 403 && !prevRequest?.sent && jwtEndpoints.some((endpoint) => prevRequest.url.includes(endpoint))) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await generateToken();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (tokenError) {
            console.error("Failed to refresh token:", tokenError);
            return Promise.reject(tokenError);
          }
        }

        // Check for 401 Unauthorized errors and handle CSRF token refresh
        if (error?.response?.status === 401 && !prevRequest?.sent && csrfEndpoints.some((endpoint) => prevRequest.url.includes(endpoint))) {
          prevRequest.sent = true;
          try {
            const newCsrfToken = await fetchCsrfToken();
            setCsrfToken(newCsrfToken);
            prevRequest.data = {
              ...prevRequest.data,
              csrfToken: newCsrfToken,
            };
            return axiosPrivate(prevRequest);
          } catch (csrfError) {
            console.error("Failed to refresh CSRF token:", csrfError);
            return Promise.reject(csrfError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, csrfToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;

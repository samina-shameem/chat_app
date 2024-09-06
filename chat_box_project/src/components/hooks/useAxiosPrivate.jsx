import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const fetchCsrfToken = async (axiosInstance) => {
  try {
    const response = await axiosInstance.patch("/csrf");
    console.debug("Fetched CSRF token");
    return response.data?.csrfToken; // Return null if response.data is null
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
};

const generateToken = async (axiosInstance, auth) => {
  if (!auth || !auth.username || !auth.password) {
    throw new Error("No username or password found for token generation");
  }

  const loginData = { username: auth.username, password: auth.password };
  try {
    const response = await axiosInstance.post("/auth/token", loginData);
    const { token } = response.data;
    console.info("Generated new token");
    return token;
  } catch (error) {
    console.error("Error refreshing auth token:", error);
    throw error;
  }
};

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);

  // List of endpoints that require CSRF token
  const csrfEndpoints = ["/auth/register", "/auth/token"];
  // List of endpoints that require JWT
  const jwtEndpoints = ["/messages", "/users", "/user", "/conversations"];
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        console.info("request intercepted====>");
        console.info("url:", config.url);
        // Add JWT to the Authorization header if required
        if (jwtEndpoints.some((endpoint) => config.url.includes(endpoint))) {
          console.info("JWT endpoint found");
          console.info(auth);
          if (auth?.accessToken && !config.headers?.["Authorization"]) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${auth.accessToken}`,
            };
          }
        }

        // Add CSRF token to the request body if required
        if (csrfEndpoints.some((endpoint) => config.url.includes(endpoint))) {
          console.info("CSRF endpoint found");
          if (!csrfToken) {
            console.info("No csrf token");
            try {
              const token = await fetchCsrfToken(axiosPrivate);
              console.info("Fetched new csrf token");
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
        console.info("=====request intercepted finished");
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        console.info("response error intercepted=====>");
        if (!prevRequest || !prevRequest.url) {
          console.error("Config or config.url is null");
          return Promise.reject(new Error("Config or config.url is null"));
        }

        // Check for 403 Forbidden errors and handle JWT refresh
        if (
          error?.response?.status === 403 &&
          !prevRequest?.sent &&
          jwtEndpoints.some((endpoint) => prevRequest.url.includes(endpoint))
        ) {
          console.info("jwt end point error, trying to get new token");
          prevRequest.sent = true;
          try {
            const newAccessToken = await generateToken(axiosPrivate, auth);
            prevRequest.headers = {
              ...prevRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
            console.info("updated new token");
            return axiosPrivate(prevRequest);
          } catch (tokenError) {
            console.error("Failed to refresh token:", tokenError);
            return Promise.reject(tokenError);
          }
        }

        // Check for 401 Unauthorized errors and handle CSRF token refresh
        if (
          error?.response?.status === 401 &&
          !prevRequest?.sent &&
          csrfEndpoints.some((endpoint) => prevRequest.url.includes(endpoint))
        ) {
          console.info("csrf end point error, trying to get new csrf");
          prevRequest.sent = true;
          try {
            const newCsrfToken = await fetchCsrfToken(axiosPrivate);
            setCsrfToken(newCsrfToken);
            prevRequest.data = {
              ...prevRequest.data,
              csrfToken: newCsrfToken,
            };
            console.info("updated new csrf token");
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

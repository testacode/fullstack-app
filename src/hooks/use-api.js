import { logger } from "../utils/logger";
import { useState, useCallback } from "react";
import axios from "axios";

const isProd =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
const host = isProd
  ? "https://testacode.github.io/fullstack-app"
  : "http://localhost";

const api = axios.create({
  baseURL: `${host}:3000`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(async (request) => {
    setLoading(true);
    setError(null);

    try {
      logger.debug("Making API request", { request });
      const response = await request();
      logger.info("API request successful", {
        endpoint: request.url,
        status: response.status,
      });
      return response.data;
    } catch (err) {
      let errorMessage = "An unexpected error occurred";

      if (err.response) {
        // Server responded with error
        errorMessage =
          err.response.data?.error || `Server error: ${err.response.status}`;
        logger.error("API request failed with response", {
          status: err.response.status,
          data: err.response.data,
          endpoint: err.config.url,
        });
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Unable to reach the server";
        logger.error("API request failed with no response", {
          request: err.request,
          endpoint: err.config.url,
        });
      } else {
        // Request setup error
        errorMessage = err.message;
        logger.error("API request setup failed", {
          message: err.message,
          endpoint: err.config?.url,
        });
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getData = useCallback(
    (endpoint) => {
      return handleRequest(() => api.get(endpoint));
    },
    [handleRequest]
  );

  return {
    getData,
    loading,
    error,
  };
};

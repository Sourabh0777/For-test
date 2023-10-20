/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState();
  const activeHttpRequest = useRef([]);
  const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
    console.log("🚀 ~ file: http-hook.js:9 ~ sendRequest ~ url:", url);
    console.log("🚀 ~ file: http-hook.js:9 ~ sendRequest ~ body:", body);
    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequest.current.push(httpAbortCtrl);
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal,
      });
      const responseData = await response.json();
      activeHttpRequest.current = activeHttpRequest.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);
      return responseData;
    } catch (error) {
      seterror(error.message);
      console.log("error hook", error);
      setIsLoading(false);
      throw error;
    }
  }, []);
  const clearError = () => {
    seterror(null);
  };
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};

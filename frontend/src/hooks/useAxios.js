import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, params = {}) => {
    return request({ method: 'GET', url, params });
  }, [request]);

  const post = useCallback((url, data = {}) => {
    return request({ method: 'POST', url, data });
  }, [request]);

  const put = useCallback((url, data = {}) => {
    return request({ method: 'PUT', url, data });
  }, [request]);

  const patch = useCallback((url, data = {}) => {
    return request({ method: 'PATCH', url, data });
  }, [request]);

  const del = useCallback((url) => {
    return request({ method: 'DELETE', url });
  }, [request]);

  return { loading, error, get, post, put, patch, delete: del };
};

// Hook for data fetching with automatic refetch
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get } = useAxios();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(url, options.params);
      setData(response);
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options.params)]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options.enabled]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for mutations (POST, PUT, DELETE)
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { post, put, patch, delete: del } = useAxios();

  const mutate = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (method) {
        case 'POST':
          response = await post(url, data);
          break;
        case 'PUT':
          response = await put(url, data);
          break;
        case 'PATCH':
          response = await patch(url, data);
          break;
        case 'DELETE':
          response = await del(url);
          break;
        default:
          throw new Error('Invalid method');
      }
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [post, put, patch, del]);

  return { mutate, loading, error };
};
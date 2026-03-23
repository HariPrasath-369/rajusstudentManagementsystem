import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = useCallback((message, duration = 3000) => {
    toast.success(message, { duration });
  }, []);

  const showError = useCallback((message, duration = 4000) => {
    toast.error(message, { duration });
  }, []);

  const showInfo = useCallback((message, duration = 3000) => {
    toast(message, {
      duration,
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  }, []);

  const showWarning = useCallback((message, duration = 4000) => {
    toast(message, {
      duration,
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
    });
  }, []);

  const showLoading = useCallback((message = 'Loading...') => {
    return toast.loading(message);
  }, []);

  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  const promise = useCallback(async (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    });
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    dismissAll,
    promise,
  };
};
import { useState, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isOpen) setData(null);
  }, [isOpen]);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
};

// Hook for confirmation modal
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
  });

  const confirm = useCallback((options) => {
    setConfig(prev => ({ ...prev, ...options }));
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    setIsOpen(false);
  }, [config]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    config,
    confirm,
    handleConfirm,
    handleCancel,
  };
};
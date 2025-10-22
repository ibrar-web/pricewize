"use client";

import { useState, useCallback, useEffect } from "react";

export interface CompareDevice {
  id: string;
  name: string;
  brand: string;
  modelSlug: string;
  category: string;
  image?: string;
  lowestPrice?: number;
}

export interface UseCompareReturn {
  devices: CompareDevice[];
  addDevice: (device: CompareDevice) => void;
  removeDevice: (deviceId: string) => void;
  clearAll: () => void;
  isComparing: (deviceId: string) => boolean;
  canCompare: boolean;
}

const STORAGE_KEY = "pricewize_compare_devices";
const MAX_COMPARE_DEVICES = 5;

/**
 * Custom hook for managing device comparison
 * Uses localStorage to persist compared devices
 */
export function useCompare(): UseCompareReturn {
  const [devices, setDevices] = useState<CompareDevice[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDevices(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Failed to load compare devices from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever devices change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
      } catch (error) {
        console.error("Failed to save compare devices to localStorage:", error);
      }
    }
  }, [devices, isHydrated]);

  const addDevice = useCallback(
    (device: CompareDevice) => {
      setDevices((prev) => {
        // Check if device already exists
        if (prev.some((d) => d.id === device.id)) {
          return prev;
        }

        // Check if max devices reached
        if (prev.length >= MAX_COMPARE_DEVICES) {
          console.warn(`Cannot add more than ${MAX_COMPARE_DEVICES} devices to compare`);
          return prev;
        }

        return [...prev, device];
      });
    },
    []
  );

  const removeDevice = useCallback((deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  }, []);

  const clearAll = useCallback(() => {
    setDevices([]);
  }, []);

  const isComparing = useCallback(
    (deviceId: string) => {
      return devices.some((d) => d.id === deviceId);
    },
    [devices]
  );

  const canCompare = devices.length >= 2;

  return {
    devices,
    addDevice,
    removeDevice,
    clearAll,
    isComparing,
    canCompare,
  };
}


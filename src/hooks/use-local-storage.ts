'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { createContextLogger } from '@/lib/monitoring/logger';

const storageLogger = createContextLogger('LocalStorage');

/**
 * useLocalStorage Hook
 *
 * A custom hook for persisting state in localStorage with runtime type safety.
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value if no value exists in localStorage
 * @param schema - Optional Zod schema for runtime validation (recommended for type safety)
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize on mount
  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return;
      }

      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or return initialValue
      if (item) {
        const parsed = JSON.parse(item);
        // Validate with schema if provided
        const value = schema ? schema.parse(parsed) : parsed;
        setStoredValue(value);
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      // If error, use initial value
      storageLogger.error(`Error reading localStorage key "${key}"`, error instanceof Error ? error : undefined, { key });
      setStoredValue(initialValue);
    }
  }, [key, initialValue, schema]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Log errors
      storageLogger.error(`Error setting localStorage key "${key}"`, error instanceof Error ? error : undefined, { key });
    }
  };

  return [storedValue, setValue];
}

/**
 * useSessionStorage Hook
 *
 * Similar to useLocalStorage but uses sessionStorage instead.
 *
 * @param key - The sessionStorage key
 * @param initialValue - The initial value if no value exists in sessionStorage
 * @param schema - Optional Zod schema for runtime validation (recommended for type safety)
 * @returns A stateful value and a function to update it
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize on mount
  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return;
      }

      // Get from session storage by key
      const item = window.sessionStorage.getItem(key);

      // Parse stored json or return initialValue
      if (item) {
        const parsed = JSON.parse(item);
        // Validate with schema if provided
        const value = schema ? schema.parse(parsed) : parsed;
        setStoredValue(value);
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      // If error, use initial value
      storageLogger.error(`Error reading sessionStorage key "${key}"`, error instanceof Error ? error : undefined, { key });
      setStoredValue(initialValue);
    }
  }, [key, initialValue, schema]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to sessionStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to session storage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Log errors
      storageLogger.error(`Error setting sessionStorage key "${key}"`, error instanceof Error ? error : undefined, { key });
    }
  };

  return [storedValue, setValue];
}
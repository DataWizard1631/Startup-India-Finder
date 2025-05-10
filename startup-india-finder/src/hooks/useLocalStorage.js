"use client"

import { useState, useEffect } from "react"

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Use a function in useState to only initialize once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Update stored value if key changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          setStoredValue(JSON.parse(item));
        } catch (error) {
          console.error("Error parsing localStorage item:", error);
        }
      }
    }
  }, [key]); // Only re-run if key changes, not initialValue

  return [storedValue, setValue];
}

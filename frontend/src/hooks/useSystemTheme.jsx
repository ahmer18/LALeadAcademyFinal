import { useState, useEffect } from "react";

export const useSystemTheme = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setIsLight(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e) => {
      setIsLight(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isLight;
};

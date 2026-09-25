import { createContext, useEffect, useState } from "react";
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const temaSalvo = localStorage.getItem('app-theme');
    return temaSalvo ? temaSalvo : 'light';
  });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);

        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');

        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
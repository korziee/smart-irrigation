import React, { useEffect, useMemo, useState, useContext } from "react";
import { createContext } from "react";

export type NavBarContextType = {
  title: string;
  setTitle(title: string): void;
};

export const NavBarContext = createContext<NavBarContextType>({
  title: "",
  setTitle: () => {},
});

export const NavBarProvider: React.FC = ({ children }) => {
  const [title, setTitle] = useState("");

  const value = useMemo(() => ({ title, setTitle }), [title]);

  return (
    <NavBarContext.Provider value={value}>{children}</NavBarContext.Provider>
  );
};

export function useSetTitle(title?: string) {
  const { setTitle } = useContext(NavBarContext);

  useEffect(() => {
    if (title) {
      setTitle(title);
    }

    return () => {
      setTitle("");
    };
  }, [title, setTitle]);
}

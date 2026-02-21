"use client";

import css from "./Header.module.css";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>
      <div className={css.navContainer}>
        <nav aria-label="Main Navigation">
          <ul className={css.navigation}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/notes/filter/all">Notes</Link>
            </li>
            {mounted && (
              <li>
                <button
                  className={css.themeToggle}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </li>
            )}
            {!mounted && (
               <li>
               <div className={css.themeTogglePlaceholder} />
             </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;

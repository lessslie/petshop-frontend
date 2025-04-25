'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Link from 'next/link';
import { JSX } from 'react';

export default function Header()  : JSX.Element {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isLoggedIn, logout } = useUser();

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl tracking-wide flex items-center gap-2">
          <span role="img" aria-label="huella">🐾</span> Pelu PetShop
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/" className="hover:text-pink-400 transition hover:scale-105">Inicio</Link>
          {!isLoggedIn && (
            <>
              <Link href="/login" className="hover:text-teal-400 transition hover:scale-105">Login</Link>
              <Link href="/register" className="hover:text-teal-400 transition hover:scale-105">Registro</Link>
            </>
          )} {isLoggedIn && (
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-semibold shadow transition"
            >
              Cerrar sesión
            </button>
          )}
        </nav>
       
        <button
          ref={buttonRef}
          className="md:hidden text-3xl"
          aria-label="Abrir menú"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        {open && (
          <nav
            ref={menuRef}
            className="absolute top-20 right-6 bg-slate-900 bg-opacity-45 backdrop-blur rounded-xl shadow-lg flex flex-col gap-4 p-5 z-50 w-48 animate-fade-in"
          >
            <Link
              href="/"
              className="hover:text-pink-400 transition hover:scale-105"
              onClick={() => setOpen(false)}
            >
              Inicio
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="hover:text-teal-400 transition hover:scale-105"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hover:text-teal-400 transition hover:scale-105"
                  onClick={() => setOpen(false)}
                >
                  Registro
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-semibold shadow transition"
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        )}
      </header>
      <style>{`
        @media (max-width: 700px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
        @media (min-width: 701px) {
          .nav-mobile-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}

// const navLinkStyle = {
//   color: '#fff',
//   textDecoration: 'none',
//   fontWeight: 500,
//   fontSize: 18,
//   padding: '6px 12px',
//   borderRadius: 6,
//   transition: 'background 0.2s',
//   background: 'none'
// };
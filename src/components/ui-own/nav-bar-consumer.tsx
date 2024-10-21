'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bell, User } from 'lucide-react';  // Importar iconos desde lucide-react

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20"> {/* Aumentamos la altura para acomodar el banner más grande */}
          {/* Banner */}
          <div className="flex items-center">
            <Image
              src="/all-connected-banner.png"
              alt="AllConnected Logo"
              width={150}  // Aumentamos el ancho del banner
              height={60}  // Aumentamos la altura del banner
            />
          </div>

          {/* Links de navegación */}
          <div className="hidden sm:flex sm:space-x-8">
            <Link
              href="/comprar"
              className="text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 border-blue-700 text-sm font-medium leading-5"
            >
              Comprar
            </Link>
            <Link
              href="/tiquetera"
              className="text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 hover:text-blue-700 hover:border-blue-700"
            >
              Tiquetera
            </Link>
            <Link
              href="/contacto"
              className="text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 hover:text-blue-700 hover:border-blue-700"
            >
              Contacto
            </Link>
          </div>

          {/* Iconos de notificación y usuario */}
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full border border-gray-300">
              <Bell size={24} className="text-gray-600" />
            </div>
            <div className="p-2 rounded-full border border-gray-300">
              <User size={24} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

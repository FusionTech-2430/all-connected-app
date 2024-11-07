import Image from 'next/image';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';  // Mantiene consistencia con el proyecto
import UserAvatar from '@/components/account/profile/UserAvatar';  // Componente de avatar
import NotificationIcon from '../layout/NotificationIcon';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Banner */}
          <div className="flex items-center">
            <Image
              src="/all-connected-banner.png"
              alt="AllConnected Banner"
              width={150}  // Tamaño más grande del banner
              height={60}
            />
          </div>

          {/* Links de navegación */}
          <div className="hidden sm:flex sm:space-x-8">
          <Link
              href="/home"
              className="text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 hover:text-[#0C4A6E] hover:border-[#0C4A6E]"
            >
              Home
            </Link>
            <Link
              href="/tiquetera"
              className="text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 hover:text-[#0C4A6E] hover:border-[#0C4A6E]"
            >
              Tiquetera
            </Link>
            <Link
              href="/contacto"
              className="text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 hover:text-[#0C4A6E] hover:border-[#0C4A6E]"
            >
              Contacto
            </Link>
          </div>

          {/* Iconos de notificación y usuario */}
          <div className="flex items-center space-x-4">
            <NotificationIcon />
            <UserAvatar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

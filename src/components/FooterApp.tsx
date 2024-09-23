"use-client"

import React from 'react';

const Footer = () => {
  return (
    <footer className="flex justify-between items-center px-6 py-4 bg-white text-gray-500 text-sm">
      <p>© 2024, <span className="text-[#075985] font-bold">AllConnected</span>. Todos los derechos reservados by <span className="text-[#075985] font-bold">FussionTech</span></p>
      <div className="flex space-x-4">
        <a href="#" className="hover:text-blue-600">Términos de servicios</a>
        <a href="#" className="hover:text-blue-600">Privacidad</a>
      </div>
    </footer>
  );
};

export default Footer;

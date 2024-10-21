import React, { useState } from 'react';
import NavBar from '@/components/ui-own/nav-bar-consumer'; 

// Página de productos
const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { name: 'Cannondale Trail Neo Orange E-bike', price: '$600.000', image: '/bike.png', rating: 5 },
    { name: 'Saco en tejido fino rayas', price: '$55.000', image: '/sweater.png', rating: 4.5 },
    { name: 'Nevera No Frost 422 Lts. Brutos Black', price: '$800.000', image: '/fridge.png', rating: 4.8 },
    { name: 'iPhone 13 pro 256GB', price: '$3.000.000', image: '/iphone.png', rating: 5 },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavBar />

      <section className="bg-[#0C4A6E] text-white py-20 mt-10">
        <h1 className="text-4xl font-bold text-center">Productos</h1>
      </section>

      <div className="flex mt-5">

        <aside className="w-1/5 p-5">
        <h3 className="font-bold mb-4 text-[#0C4A6E]">Filtro de productos</h3>
            <div className="space-y-2">
            <label className="block"><input type="checkbox" className="mr-2" /> Comida</label>
            <label className="block"><input type="checkbox" className="mr-2" /> Tecnología</label>
            <label className="block"><input type="checkbox" className="mr-2" /> Moda</label>
            <label className="block"><input type="checkbox" className="mr-2" /> Hogar y decoración</label>
            <label className="block"><input type="checkbox" className="mr-2" /> Salud</label>
            <label className="block"><input type="checkbox" className="mr-2" /> Deportes y ocio</label>
            <label className="block"><input type="checkbox" className="mr-2" /> Libros</label>
          </div>
        </aside>

        <section className="w-4/5 p-5">
        <div className="flex justify-between items-center mb-4">
            <p>Mostrando 1-24 de {filteredProducts.length} resultados</p>
            <input
            type="text"
            placeholder="Buscar productos..."
            className="p-2 border rounded w-1/3" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <div key={index} className="border p-4 text-center">
                <img src={product.image} alt={product.name} className="w-full h-auto mb-4" />
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-lg">{product.price}</p>
                <div>{'⭐'.repeat(Math.floor(product.rating))}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;

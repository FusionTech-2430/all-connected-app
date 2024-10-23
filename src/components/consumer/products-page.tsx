import NavBar from '@/components/ui-own/nav-bar-consumer'
import ProductList from './product-list'

// Página de productos
const ProductsPage = () => {

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
            <label className="block">
              <input type="checkbox" className="mr-2" /> Comida
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Tecnología
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Moda
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Hogar y decoración
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Salud
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Deportes y ocio
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Libros
            </label>
          </div>
        </aside>

        <ProductList />
      </div>
    </div>
  )
}

export default ProductsPage

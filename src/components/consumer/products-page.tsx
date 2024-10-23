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


        <ProductList />
      </div>
    </div>
  )
}

export default ProductsPage

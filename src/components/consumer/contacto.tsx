import NavBar from '@/components/ui-own/nav-bar-consumer'; 

const ContactPage = () => {
  return (
    <div>
      <NavBar />

      <section className="bg-[#0C4A6E] text-white py-20 mt-10">
        <h1 className="text-4xl font-bold text-center">Contacto</h1>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <section className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Envíanos un mensaje</h2>

          <form action="#" method="POST" className="space-y-6">

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#0C4A6E] text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;

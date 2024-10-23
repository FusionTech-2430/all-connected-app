import NavBar from '@/components/ui-own/nav-bar-consumer'
import Image from 'next/image'

const TiqueteraPage = () => {
    // Datos de eventos (esto es un ejemplo, puedes cargar estos datos dinámicamente)
    const events = [
      {
        title: 'Festival Ostara',
        location: 'Parque el Nogal',
        imgSrc: '/ostara.png'
      },
      {
        title: 'The Beatles Symphonic',
        location: 'Movistar Arena',
        imgSrc: '/beatles-symphonic.png'
      },
      {
        title: 'Concierto Puerto Candelaria',
        location: 'Teatro Julio Mario',
        imgSrc: '/puerto-candelaria.png'
      },
      {
        title: 'Obra de teatro La Culpa',
        location: 'Teatro Gaitán',
        imgSrc: '/la-culpa.png'
      },
      
    ];
  
    return (
      <div>
        <NavBar />

        <section className="bg-[#0C4A6E] text-white py-20 mt-10">
        <h1 className="text-4xl font-bold text-center">Tiquetera AllConnected</h1>
      </section>
  
  
        <main className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <section className="my-8">
            <input
              type="text"
              placeholder="Buscar eventos ..."
              className="w-full max-w-lg p-3 border rounded-md shadow-sm"
            />
          </section>
  
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
                <Image src={event.imgSrc} alt={event.title} width={400} height={300} />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="text-gray-500">{event.location}</p>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    );
  };

  export default TiqueteraPage
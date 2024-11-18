import Footer from '@/components/ui-own/footer'
import { PublicHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col h-dvh">
      <PublicHeader />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="flex flex-col items-center min-h-full bg-primary-50">
      <div className="flex flex-col items-center pt-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary">
          Conecta con el mundo
        </h1>
        <p className="text-primary text-lg md:text-xl mb-8">
          AllConnected es la plataforma que te permite conectar con personas,
          negocios y oportunidades de una manera fácil y eficiente.
        </p>
        <Button className="bg-blue-500 hover:bg-blue-600 text-lg px-6 py-3 md:px-8 md:py-4">
          Empezar ahora
        </Button>
      </div>
      <div className="flex flex-col items-center justify-end  w-full h-full self-center place-self-end">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/allconnected-p.appspot.com/o/static_images%2Fplaceholder.png?alt=media"
          width={1203}
          height={518}
          alt="Dashboard"
          className="rounded-lg shadow-2xl"
        />
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      title: 'Crea comunidad',
      description:
        'Conecta y crea comunidad con otros usuarios de tu organización.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-500" />,
      title: 'Gestiona tu emprendimiento',
      description: 'Controla tus ventas, contactos y finanzas.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-blue-500" />,
      title: 'Anuncia tus eventos',
      description: 'Publica y gestiona tus eventos y seminarios fácilmente.'
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-blue-500" />,
      title: 'Potencia tus ventas',
      description:
        'Aumenta tus oportunidades comerciales con nuestras herramientas.'
    },
    {
      icon: <Target className="h-10 w-10 text-blue-500" />,
      title: 'Segmenta tu mercado',
      description:
        'Haga análisis detallados con estrategias de geolocalización.'
    }
  ]

  return (
    <section
      id="features"
      className="py-12 md:py-20 bg-primary-800 min-h-screen"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Descubre las principales funcionalidades de AllConnected
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const benefits = [
    {
      title: 'Eficiencia',
      description: 'Ahorra tiempo y recursos con una interfaz fácil y amigable.'
    },
    {
      title: 'Seguridad',
      description:
        'Protege tus datos con nuestras funciones de seguridad robustas.'
    },
    {
      title: 'Crecimiento',
      description: 'Expande y potencia tu negocio con nuestras herramientas.'
    },
    {
      title: 'Satisfacción',
      description:
        'Consigue los mejores productos y servicios en pocos minutos.'
    }
  ]

  return (
    <section
      id="benefits"
      className="py-12 md:py-20 bg-primary-200 min-h-screen"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Descubre los beneficios de usar AllConnected
            </h2>
            <p className="text-lg mb-4">
              AllConnected te ayuda a conectar con personas, negocios y
              oportunidades de una manera más eficiente y segura.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-blue-600">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: 'Básico',
      price: '$35 / mes',
      features: [
        'Funcionalidades del Plan Gratuito',
        'Acceso ilimitado a la plataforma',
        'Soporte por correo electrónico'
      ]
    },
    {
      name: 'Pro',
      price: '$40 / mes',
      features: [
        'Todas las características del Plan Básico',
        'Funcionalidades avanzadas',
        'Soporte prioritario',
        'Acceso a seminarios exclusivos'
      ]
    },
    {
      name: 'Empresa',
      price: '$50 / mes',
      features: [
        'Todas las características del Plan Pro',
        'Integración con otras plataformas',
        'Soporte 24/7',
        'Personalización avanzada'
      ]
    }
  ]

  return (
    <section id="pricing" className="py-12 md:py-20 bg-primary-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          ¡Escoge el plan perfecto para ti!
        </h2>
        <p className="text-center mb-8 md:mb-12">
          Selecciona entre los mejores planes, asegurando una coincidencia
          perfecta. ¡Necesitas más o menos? ¡Personaliza tu suscripción para un
          ajuste perfecto!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`text-center ${index === 1 ? 'border-blue-500 border-2' : ''}`}
            >
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {plan.name}
                </CardTitle>
                <p className="text-2xl md:text-3xl font-bold">{plan.price}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full">Comprar</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Juan Pérez',
      comment:
        'AllConnected ha sido una herramienta fundamental para el crecimiento de mi negocio. La interfaz es intuitiva y las funcionalidades son exactamente lo que necesitaba.'
    },
    {
      name: 'María González',
      comment:
        'Gracias a AllConnected, he podido expandir mi red de contactos y encontrar nuevas oportunidades de negocio. ¡Lo recomiendo totalmente!'
    }
  ]

  return (
    <section
      id="contact-us"
      className="py-12 md:py-20 bg-primary-800 text-white"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-blue-800">
              <CardContent className="pt-6">
                <p className="mb-4">&quot;{testimonial.comment}&quot;</p>
                <p className="font-bold">- {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

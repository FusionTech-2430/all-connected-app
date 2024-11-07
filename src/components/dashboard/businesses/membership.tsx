'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import { ConfirmacionInicialModal } from "@/components/dashboard/businesses/modals/ConfirmacionInicialModal"
import { ConfirmacionCompraModal } from "@/components/dashboard/businesses/modals/buyModal"

const plans = [
  {
    name: "Explorer",
    price: 50,
    description: "Crea y gestiona tus conexiones de una manera fácil y eficiente.",
    features: [
      "Comunicación directa y fluida con los consumidores",
      "Acceso a herramientas básicas de gestión de inventario y servicios.",
      "Publicidad en tres zonas locales y comunidades específicas."
    ]
  },
  {
    name: "Embasser",
    price: 35,
    description: "Crea y gestiona tus conexiones de una manera fácil y eficiente.",
    features: [
      "Funcionalidades del Plan Powerful",
      "Análisis de mercado y tendencias de ventas actualizadas en tiempo real",
      "Publicidad dirigida a segmentos específicos de mercado ilimitados",
      "Quince difusiones de contenido gratis anual"
    ]
  },
  {
    name: "Powerful",
    price: 40,
    description: "Crea y gestiona tus conexiones de una manera fácil y eficiente.",
    features: [
      "Funcionalidades del Plan Explorer",
      "Gestión avanzada del flujo de caja, incluyendo análisis detallado de gastos, ingresos, deudas e inversión",
      "Publicidad dirigida a cinco segmentos específicos de mercado.",
      "Cinco difusiones de contenido gratis en semestre"
    ]
  }
]

export default function Component() {
  const [selectedPlan, setSelectedPlan] = useState("Powerful")
  const [isConfirmacionInicialOpen, setIsConfirmacionInicialOpen] = useState(false)
  const [isConfirmacionCompraOpen, setIsConfirmacionCompraOpen] = useState(false)

  const handlePurchase = () => {
    setIsConfirmacionInicialOpen(true)
  }

  const handleConfirmPurchase = () => {
    setIsConfirmacionInicialOpen(false)
    setIsConfirmacionCompraOpen(true)
  }

  const handleFinalPurchase = () => {
    // Aquí iría la lógica para procesar la compra
    console.log(`Compra confirmada para el plan ${selectedPlan}`)
    setIsConfirmacionCompraOpen(false)
    alert('¡Compra realizada con éxito!')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Cambia a un plan superior para disfrutar de todo
        </h1>
        <p className="text-muted-foreground">
          Ahora estás usando el <span className="text-primary">Plan Gratuito</span> para siempre para tu entorno de trabajo.
          Has utilizado 0.59/100 MB.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`flex flex-col cursor-pointer transition-colors duration-300 ${
              selectedPlan === plan.name ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => setSelectedPlan(plan.name)}
          >
            <CardHeader>
              <div className={`px-4 py-1 ${
                selectedPlan === plan.name ? "bg-primary-foreground text-primary" : "bg-primary/10 text-primary"
              } w-fit rounded-full mb-4`}>
                {plan.name}
              </div>
              <div className="mb-4">
                <p className={selectedPlan === plan.name ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  {plan.description}
                </p>
              </div>
              <div className="text-3xl font-bold">${plan.price} / mes</div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`h-5 w-5 ${
                      selectedPlan === plan.name ? "text-primary-foreground" : "text-primary"
                    } shrink-0 mt-0.5`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                variant={selectedPlan === plan.name ? "secondary" : "default"}
                onClick={handlePurchase}
              >
                Comprar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ConfirmacionInicialModal
        isOpen={isConfirmacionInicialOpen}
        onClose={() => setIsConfirmacionInicialOpen(false)}
        onConfirm={handleConfirmPurchase}
        planName={selectedPlan}
      />

      <ConfirmacionCompraModal
        isOpen={isConfirmacionCompraOpen}
        onClose={() => setIsConfirmacionCompraOpen(false)}
        onSubmit={handleFinalPurchase}
      />
    </div>
  )
}
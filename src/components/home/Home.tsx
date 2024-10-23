'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomeContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">Bienvenido a AllConnected</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Ver Landing Page</CardTitle>
            <CardDescription>Explora nuestros productos, servicios y eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground">
              Descubre cómo AllConnected puede ayudarte a conectar con personas, negocios y oportunidades de una manera fácil y eficiente.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/consumer" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Ir a Landing Page
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Mis Emprendimientos</CardTitle>
            <CardDescription>Gestiona tus negocios y proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground">
              Accede a tu dashboard para ver y administrar tus emprendimientos actuales o iniciar uno nuevo. Mantén el control de tus negocios en un solo lugar.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/businesses" passHref>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Ir a Mis Emprendimientos
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
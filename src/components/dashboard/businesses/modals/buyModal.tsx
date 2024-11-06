import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, User, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ConfirmacionCompraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function ConfirmacionCompraModal({ isOpen, onClose, onSubmit }: ConfirmacionCompraModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular proceso de compra
    setTimeout(() => {
      setIsLoading(false)
      onSubmit()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Confirmar Compra</CardTitle>
              <CardDescription className="text-center">Por favor, complete los detalles para finalizar su compra</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Número de Tarjeta
                    </Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expDate">Fecha de Expiración</Label>
                      <Input id="expDate" placeholder="MM/AA" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nombre Completo
                    </Label>
                    <Input id="name" placeholder="Juan Pérez" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="juan@ejemplo.com" required />
                  </div>
                </div>
                <CardFooter className="flex justify-center mt-6 p-0">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                      </motion.div>
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Procesando...' : 'Comprar Ahora'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Combobox } from "../shared/combobox";


const owners = [
  {
    key: "id1",
    value: "carlos rojas",
    label: "Carlos Rojas",
  },
  {
    key: "id2",
    value: "stiven ortiz",
    label: "Stiven Ortíz",
  },
  {
    key: "id3",
    value: "jhonatan sanchez",
    label: "Jhonatan Sánchez",
  },
  {
    key: "id4",
    value: "john doe",
    label: "John Doe",
  },
  {
    key: "id5",
    value: "jane doe",
    label: "Jane Doe",
  },
]

export function CreateBusinessButton() {

      const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

    return (
        <>
        <Button onClick={() => handleOpenDialog()}>Añadir</Button>
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
                Crea un nuevo emprendimiento
            </DialogTitle>
            <DialogDescription>
              Llena el formulario con la información del emprendimiento
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Nombre del emprendimiento" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Dueño</Label>
              <Combobox items={owners} placeholder="Selecciona el dueño" emptyMessage="No se encontraron dueños." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Organización</Label>
              <Combobox items={owners} placeholder="Selecciona la organización" emptyMessage="No se encontraron organizaciones." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture">Logo</Label>
              <Input id="picture" type="file" />
            </div>
            <Button type="submit" className="w-full">Crear emprendimiento</Button>
          </form>
        </DialogContent>
      </Dialog>
        </>
    )
    
}
// create-business-button.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Combobox } from "../shared/combobox";
import { getOrganizations } from "@/lib/api/organizations";
import { createBusiness } from "@/lib/api/business";
import { Organizations } from "@/types/organizations";
import type { CreateBusinessData } from "@/types/business";

export function CreateBusinessButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [organizations, setOrganizations] = useState<{ key: string, value: string, label: string }[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await getOrganizations();
      const formattedOrgs = orgs.map((org: Organizations) => ({
        key: org.id_organization,
        value: org.id_organization,
        label: org.name
      }));
      setOrganizations(formattedOrgs);
    };
    fetchOrganizations();
  }, []);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    
    const businessData: CreateBusinessData = {
      name: formData.get('name')?.toString() || '',
      owner_id: formData.get('owner_id')?.toString() || '',
      logo_url: '',
      organization: selectedOrganization || ''
    };

    try {
      await createBusiness(businessData);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating business:', error);
    }
  };

  return (
    <>
      <Button onClick={handleOpenDialog}>Añadir</Button>
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Nombre del emprendimiento" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner_id">Dueño</Label>
              <Input id="owner_id" name="owner_id" placeholder="ID del dueño" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organización</Label>
              <Combobox 
                items={organizations} 
                placeholder="Selecciona la organización" 
                emptyMessage="No se encontraron organizaciones." 
                onChange={(value: string | null) => setSelectedOrganization(value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture">Logo</Label>
              <Input id="picture" name="picture" type="file" accept="image/*" />
            </div>
            <Button type="submit" className="w-full">Crear emprendimiento</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
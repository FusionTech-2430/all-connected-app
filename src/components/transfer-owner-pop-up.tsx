'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Partner {
  id: string;
  name: string;
}

const partners: Partner[] = [
  { id: '1', name: 'Camilo Nossa' },
  { id: '2', name: 'Juan Ramírez' },
  { id: '3', name: 'Esteban Salazar' },
  { id: '4', name: 'Diego Pardo' },
  { id: '5', name: 'Valentina Sierra' },
  { id: '6', name: 'Carlos Rojas' },
];

interface OwnershipTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnershipTransferModal({ isOpen, onClose }: OwnershipTransferModalProps) {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  const handleSaveChanges = () => {
    // Implement the logic to save the ownership transfer
    console.log('Transferring ownership to:', selectedPartner);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ceder título de propietario</DialogTitle>
          <DialogDescription>
            Selecciona a alguno de tus aliados para cederle el título de propietario
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedPartner} value={selectedPartner || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el nuevo propietario" />
            </SelectTrigger>
            <SelectContent>
              {partners.map((partner) => (
                <SelectItem key={partner.id} value={partner.id}>
                  {partner.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={!selectedPartner}>
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
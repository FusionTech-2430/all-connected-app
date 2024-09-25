'use client';

import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import OwnershipTransferModal from '@/components/transfer-owner-pop-up';
import AddAllyPopUp from '@/components/add-ally-pop-up';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const partners = [
  { id: 'CN', name: 'Camilo Nossa', email: 'camilonossa@fusiontech.com', role: 'Vendedor', status: 'Vacaciones' },
  { id: 'VE', name: 'Valentina Escobar', email: 'valen_e@fusiontech.com', role: 'Contador', status: 'Vacaciones' },
  { id: 'DP', name: 'Diego Pardo', email: 'pardiego@fusiontech.com', role: 'Vendedor', status: 'Activo' },
  { id: 'CR', name: 'Carlos Rojas', email: 'carlosroj@fusiontech.com', role: 'Marketing', status: 'Inactivo' },
  { id: 'ES', name: 'Esteban Salazar', email: 'estebans@fusiontech.com', role: 'Vendedor', status: 'Activo' },
];

export default function MyBusiness() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isAddAllyModalOpen, setIsAddAllyModalOpen] = useState(false); // State to control add ally modal visibility

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openAddAllyModal = () => setIsAddAllyModalOpen(true);
  const closeAddAllyModel = () => setIsAddAllyModalOpen(false);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Emprendimiento</h1>

      <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <img src="/placeholder.svg?height=48&width=48" alt="Pontigomitas logo" />
          </Avatar>
          <div>
            <h2 className="font-semibold">Pontigomitas</h2>
            <p className="text-sm text-gray-500">Dueña</p>
          </div>
        </div>
        <Button variant="outline" onClick={openModal}> {/* Open the modal on button click */}
          Ceder título propietario
        </Button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Gestión de aliados</h3>

      <div className="flex space-x-4 mb-4">
        <Input 
          className="flex-grow"
          placeholder="Buscar por nombre o rol..."
        />
        <Select defaultValue="all-status">
          <option value="all-status">Todos los estados</option>
        </Select>
        <Select defaultValue="all-teams">
          <option value="all-teams">Todos los equipos</option>
        </Select>
        <Button onClick={openAddAllyModal}>Añadir Aliado</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    {partner.id}
                  </Avatar>
                  <div>
                    <p>{partner.name}</p>
                    <p className="text-sm text-gray-500">{partner.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{partner.role}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  partner.status === 'Activo' ? 'bg-green-100 text-green-800' :
                  partner.status === 'Inactivo' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {partner.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Modificar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Total: 10 aliados.</p>
        <div className="flex items-center space-x-2">
          <p className="text-sm">Página 1 de 2</p>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon"><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Ownership Transfer Modal */}
      <OwnershipTransferModal isOpen={isModalOpen} onClose={closeModal} />
          
      {/* Add Ally Modal */}
      <AddAllyPopUp isOpen={isAddAllyModalOpen} onClose={closeAddAllyModel} />
    </div>
  );
}

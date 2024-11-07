import React from 'react'
import NavItem from './nav-item'

import {
  Calendar,
  House,
  Package,
  Users,
  NotebookPen,
  // for question and answers
  MessageCircleQuestion,
  // for events
  PartyPopperIcon,
} from 'lucide-react'

const navBarItems = [
  {
    uid: 'ConfesionesEvents',
    href: '/admin/conf-events',
    title: 'Eventos confesiones',
    icon: <PartyPopperIcon size={20} /> 
  },
  {
    uid: 'business',
    href: '/admin/business',
    title: 'Empredimientos',
    icon: <Package size={20} />
  },
  {
    uid: 'events',
    href: '/admin/event',
    title: 'Eventos',
    icon: <Calendar size={20} />
  },
  {
    uid: 'products',
    href: '/admin/products',
    title: 'Productos y servicios',
    icon: <House size={20} />
  },
  {
    uid: 'users',
    href: '/admin/user',
    title: 'Usuarios',
    icon: <Users size={20} />
  },
  {
    uid: 'organizations',
    href: '/admin/organizations',
    title: 'Organizaciones',
    icon: <NotebookPen size={20} />
  },
  {
    uid: 'qa',
    href: '/admin/q&a',
    title: 'Preguntas frecuentes',
    icon: <MessageCircleQuestion size={20} />
  }
]

type NavBarProps = React.ComponentProps<'nav'>

export default function NavBar({ children, ...props }: NavBarProps) {
  return (
    <>
      <nav {...props}>
        {/* Nav item */}

        {navBarItems.map((item) => {
          return (
            <NavItem
              key={item.uid}
              href={item.href}
              icon={item.icon}
              title={item.title}
            />
          )
        })}

        {children}
      </nav>
    </>
  )
}

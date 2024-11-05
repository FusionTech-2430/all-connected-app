import React from 'react'
import NavItem from '../nav-item'

import {
  BoxIcon,
  MessageSquareIcon,
  PartyPopperIcon,
  PencilIcon,
  ShieldQuestionIcon,
  ShoppingBag
} from 'lucide-react'

const navBarItems = [
  {
    uid: 'Home',
    href: '/consumer',
    title: 'Productos',
    icon: <BoxIcon size={20} /> 
  },
  {
    uid: 'Services',
    href: '/consumer/services',
    title: 'Servicios',
    icon: <PencilIcon size={20} /> 
  },
  {
    uid: 'Events',
    href: '/consumer/events',
    title: 'Eventos',
    icon: <PartyPopperIcon size={20} /> 
  },
  {
    uid: 'Orders',
    href: '/orders',
    title: 'Mis Ordenes',
    icon: <ShoppingBag size={20} /> 
  },
  {
    uid: 'Chat',
    href: '/consumer/chat',
    title: 'Chat',
    icon: <MessageSquareIcon size={20} /> 
  },
  {
    uid: 'FAQs',
    href: '/consumer/faqs',
    title: 'FAQs',
    icon: <ShieldQuestionIcon size={20} /> 
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

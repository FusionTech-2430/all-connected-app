import NavItem from './nav-item'

import {
  House,
  LineChart,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'

const navBarItems = [
  {
    uid: 'inventory',
    href: '/inventory',
    title: 'Inventario',
    icon: <House size={20} />
  },
  {
    uid: 'cash-flow',
    href: '/cash-flow',
    title: 'Flujo de caja',
    icon: <ShoppingCart size={20} />
  },
  {
    uid: 'my-business',
    href: '/my-business',
    title: 'Mi emprendimiento',
    icon: <Package size={20} />
  },
  {
    uid: 'messages',
    href: '/messages',
    title: 'Mensajes',
    icon: <Users size={20} />
  },
  {
    uid: 'sales',
    href: '/sales',
    title: 'Ventas',
    icon: <LineChart size={20} />
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

# Introducción a Next.js 🚀

Este documento se explican los pasos básicos para desarrollar paginas y componentes, así como conceptos clave para comprendender el funcionamiento del framework de [Next.js](https://nextjs.org/).

Comencemos por comprender que es **Next.js**, es un framework de [React](https://es.react.dev/) que permite **SSR** (Server Side Rendering), renderizar paginas web del lado del servidor, lo que significa que el servidor genera el **HTML** de la página web y lo envía al cliente, esto permite que la página cargue más rápido y sea más amigable con los motores de búsqueda, a comparación de un **SPA** (Single Page Application) donde todo el contenido se carga del lado del cliente.

**React** es una librería de JavaScript que permite crear interfaces de usuario de forma declarativa, es decir, se define cómo se verá la interfaz y se encarga de actualizarla automáticamente cuando los datos cambian. 💻

Es importante tener en cuenta que **Next.js** es un framework de **React**, por lo que si no tienes experiencia con **React** te recomiendo que leas la [documentación oficial](https://es.react.dev/learn) para comprender los conceptos básicos. 📚

En **Next.js** hay dos [entornos de renderizado](https://nextjs.org/docs/app/building-your-application/rendering):

- El cliente se refiere al navegador en el dispositivo de un usuario que envía una solicitud a un servidor para su código de aplicación. A continuación, convierte la respuesta del servidor en una interfaz de usuario. 🌐

- El servidor es el ordenador de un centro de datos que almacena el código de la aplicación, recibe las peticiones del cliente y envía la respuesta adecuada. 🖥️

Por lo que estaríamos construyendo una [aplicación híbrida](https://nextjs.org/docs/app/building-your-application/rendering#building-hybrid-applications). 🔄

Cuando se trabaja en estos entornos, es útil pensar en el flujo del código en su aplicación como unidireccional. En otras palabras, durante una respuesta, el código de tu aplicación fluye en una dirección: del servidor al cliente. ➡️

Si necesitas acceder al servidor desde el cliente, envías una nueva petición al servidor en lugar de reutilizar la misma petición. Esto facilita la comprensión de dónde renderizar sus componentes y dónde colocar el Network Boundary. 🌐 ➡️ 🖥️

A medida que estas leyendo esta guía de desarrollo, te recomiendo que tengas a la mano la [documentación oficial de Next.js](https://nextjs.org/docs) para profundizar en los conceptos que se describen aquí. 📖

## Routing 🛤️

En **Next.js** el enrutamiento se realiza de forma automática, utilizando la estructura de directorios y convenciones de nombres de archivos, a esto se le conoce como [App router](https://nextjs.org/docs/app/building-your-application/routing#the-app-router)

Por ejemplo, si tienes un archivo llamado `page.tsx` en la raíz de la carpeta `app`, este archivo se convertirá en la página principal de tu aplicación, es decir, la ruta `/` de tu aplicación. 🏠

```
└── 📁all-connected-app
    └── 📁public
    └── 📁src
        └── 📁app
            └── favicon.ico
            └── layout.tsx
            └── page.tsx
```

En este caso, la ruta `/` se corresponderá con el archivo `page.tsx` dentro de la carpeta `app`.

Si deseas crear una ruta diferente, puedes crear una carpeta con el nombre de la ruta y dentro de esta carpeta un archivo con el nombre `page.tsx`.

```tsx
// src/app/page.tsx

export default function HomePage() {
  return (
    <>
      <h1> This is the home page </h1>
    </>
  )
}
```

```tsx
// src/app/about/page.tsx

export default function AboutPage() {
  return (
    <>
      <h1> This is the about page </h1>
    </>
  )
}
```

## Rutas dinámicas 🔄

En **Next.js** puedes crear rutas dinámicas utilizando corchetes `[]` en el nombre del archivo, por ejemplo, si tienes un archivo llamado `[id].tsx` en la carpeta `app`, este archivo se convertirá en una ruta dinámica, es decir, la ruta `/1`, `/2`, `/3`, etc.

```tsx
// src/app/users/[id]/page.tsx

export default function UserPage({ params }: { params: { id: number } }) {
  const { id } = params

  return (
    <>
      <h1> This is the user page for the user {id}</h1>
    </>
  )
}
```

También con query params 🔍

```tsx

// src/app/users/page.tsx

// browser: /users?searchTerm=John

export default function Users(searchParams: { [key: string]: string | string[] | undefined }
}) {

 const name = searchParams.searchTerm

 if (!name) {
    return (
      <>
        <h1> I'm gonna show all users </h1>
      </>
    )
  }

  return (
    <>
      <h1> I'm gonna show only users with a name like {name}</h1>
    </>
  )
}
```

Así mismo podemos juntar rutas dinámicas con query params 🔄🔍

```tsx
// src/app/users/[id]/page.tsx

// browser: /users/1?searchTerm=chocolate

export default function UserPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { id } = params
  const { product } = searchParams

  return (
    <>
      <h1> This is the user page for the user {id}</h1>

      {
        product && (
          <p> I'm looking for the product type of {product} from the user {id} </p>
        )
      }
    </>
  )
}
```

## Server Components y Client Components 🖥️💻

En **Next.js** existen dos tipos de componentes, los **Server Components** y los **Client Components**.

Los **Server Components** son componentes que se renderizan en el servidor, es decir, el servidor genera el **HTML** de estos componentes y los envía al cliente, esto permite que la página cargue más rápido y sea más amigable con los motores de búsqueda.

Los **Client Components** son componentes que se renderizan en el cliente, es decir, el servidor envía el **Javascript** de estos componentes al cliente y luego el cliente se encarga de renderizarlos, esto permite que la página sea más interactiva y dinámica.

Como diferenciarlos, los **Server Components** se importan de la siguiente manera:

```tsx
// src/components/avatar.tsx

export default function Avatar() {
  return (
    <>
      <img src="/avatar.png" alt="avatar" />
    </>
  )
}
```

```tsx
// src/components/dropdown.tsx
'use client'

import { useState } from 'react'

export default function Dropdown() {

    const [isOpen, setIsOpen] = useState(false)

  return (
    <>
        <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>

        {isOpen && (
            <div> This is a dropdown item </div>
            <div> This is a dropdown item </div>
            <div> This is a dropdown item </div>
        )}
    </>
  )
}
```

En el ejemplo anterior, el componente `Avatar` es un **Server Component** y el componente `Dropdown` es un **Client Component**, esto porque el archivo `dropdown.tsx` tiene la directiva `'use client'`, al inicio del archivo que indica que este componente se renderiza en el cliente.

### ¿Cuando se debe utilizar esta directiva? ❓

Se utiliza siempre que nuestro componente requiera el uso de alguno de los hooks de **React** que solo pueden ser utilizados en el cliente, como por ejemplo `useState`, `useEffect`, `useContext`, `useRef`, entre otros hooks de librerías o del propio framework como `useRouter`, `useSearchParams`, etc.

Los hooks se identifican por el prefijo `use`, por lo que si un componente utiliza un hook que empieza con `use` entonces este componente debe ser un **Client Component**.

## Layouts 🖼️

En **Next.js** los **Layouts** son componentes que se utilizan para envolver otros componentes y así poder reutilizar la estructura de la página, por ejemplo, el header, el footer, la barra de navegación, etc.

```tsx
// src/app/layout.tsx

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header> This is the header </header>
      {children}
      <footer> This is the footer </footer>
    </>
  )
}
```

## Data Fetching y Caching 📡

Hay dos formas de obtener datos en **Next.js**, al igual que en los componentes, los datos pueden ser **Server Side Fetching** o **Client Side Fetching**.

### Server Side Fetching 🌐

Este componente obtendrá y mostrará una lista de entradas de blog. La respuesta de la búsqueda se almacenará automáticamente en caché.

```tsx
// src/app/blog/page.tsx

// Importante que tenga el async function
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```
Si no está utilizando ninguna [dynamic functions](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering) a en ninguna otra parte de esta ruta, se prerenderizará durante la `next build` a una página estática. Los datos pueden ser actualizados usando [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration).

Si no desea almacenar en caché la respuesta de `fetch`, puede hacer lo siguiente:

```tsx
// src/app/blog/page.tsx

// Importante que tenga el async function
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog', { cache: 'no-store'})
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Client Side Fetching 💻

Se recomienda siempre usar **Server Side Fetching**.

Sin embargo, todavía hay casos en los que la obtención de datos del lado del cliente tiene sentido. En estos casos, puedes llamar manualmente a `fetch` en un `useEffect` (no recomendado), o recurrir a bibliotecas React populares en la comunidad (como [SWR](https://swr.vercel.app/) o [React Query](https://tanstack.com/query/latest)) para la obtención de datos del cliente.

```tsx
// src/components/posts.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Function to fetch posts
const fetchPosts = async () => {
  const response = await fetch('https://api.vercel.app/blog')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export default function Component() {
  // Using useQuery hook to fetch posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{post.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## Server actions y Mutations 🖥️🔄

Las [Server Actions](https://react.dev/reference/rsc/server-actions) son funciones asíncronas que se ejecutan en el servidor. Se pueden invocar en los **Server Components** y **Clients Components** para gestionar el envío de formularios y las mutaciones de datos en las aplicaciones Next.js.

[Aprende acerca de las Server Actions](https://www.youtube.com/watch?v=dDpZfOQBMaU)

```tsx
// src/lib/actions/users.ts
'use server'
 
export async function create(formData: FormData) {

    const rawFormData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
    }

    // Do something with the data like send it to an API
    await fetch('https://api.vercel.app/users', {
      method: 'POST',
      body: JSON.stringify(rawFormData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Revalidate the data at the /users path
    revalidatePath('/users')

    // Redirect to the users page
    redirect('/users')
}
```

```tsx
'use client'
 
import { create } from '@/lib/actions/users'
 
export function CreateUserForm() {
  return (
    <form action={create}>
        {/* ... */}
    </form>
  )
}
```

## Recursos 📚

📺 [Uso correcto de NextJs y diferentes conceptos que tienes que saber](https://www.youtube.com/watch?v=Tqt_9PVKFso)

📺 [Next.js App Router Caching: Explained!](https://www.youtube.com/watch?v=VBlSe8tvg4U)

📺 [Next.js App Router: Routing, Data Fetching, Caching](https://www.youtube.com/watch?v=gSSsZReIFRk&t=725s)

📺 [CURSO REACT 2024 - Aprende desde cero](https://www.youtube.com/watch?v=7iobxzd_2wY&list=PLUofhDIg_38q4D0xNWp7FEHOTcZhjWJ29)

📺 [NextJS Tutorial - All 12 Concepts You Need to Know](https://www.youtube.com/watch?v=vwSlYG7hFk0)

📺 [Tutorial Next.js 14 paso a paso, para Principiantes](https://www.youtube.com/watch?v=jMy4pVZMyLM)

📚 [Start building with Next.js](https://nextjs.org/learn)

📺 [10 common mistakes with the Next.js App Router](https://www.youtube.com/watch?v=RBM03RihZVs&t=932s)

📺 [All 29 Next.js Mistakes Beginners Make](https://www.youtube.com/watch?v=5QP0mvrJkiY&t=1269s)
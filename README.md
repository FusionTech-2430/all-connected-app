![Logo](https://github.com/FusionTech-2430/.github/blob/main/profile/Banner2.png?raw=true)

# AllConnected Web App

AllConnected es una **PWA** (Progressive Web App) que permite a diferentes usuarios, emprendedores y organizaciones, conectarse entre sí para realizar sus negocios, proyectos y eventos de manera más eficiente y efectiva.

## Stack Tecnológico

- [Next.js](https://nextjs.org/) 14.2.9
- [Tailwindcss](https://tailwindcss.com/) 3.4.10
- [Typescript](https://www.typescriptlang.org/) 5.6.2
- [Shadcn](https://ui.shadcn.com/) 2.0.5
- [Lucide icons](https://lucide.dev/) 0.439.0
- [Prettier](https://prettier.io/) 3.3.3

## Variables de entorno

Para ejecutar este proyecto, necesitarás agregar las siguientes variables de entorno a tu archivo `.env.local`.

`API_GATEWAY_URL`

> 📘 INFO
>
> Las variables de entorno que no tengan el prefijo `NEXT_PUBLIC_` sólo están disponibles en el entorno `Node.js` **(Server side)**, lo que significa que no son accesibles para el navegador **(Client side)**.

### Ejemplo de uso

```tsx
export async function Page() {
  const users: User[] = await fetch(`${process.env.API_GATEWAY_URL}/users`)

  return (
    <>
      <p>{JSON.stringify(users)}</p>
    </>
  )
}
```

## Ejecutar Localmente

Clona el proyecto

```bash
  git clone https://github.com/FusionTech-2430/all-connected-app.git
```

Ve al directorio del proyecto

```bash
  cd all-connected-app
```

Instala las dependencias

```bash
  npm install
```

Inicia el servidor de desarrollo

```bash
  npm run dev
```

## Estructura de directorios

```
└── 📁all-connected-app
    └── 📁.github
        └── 📁workflows
    └── 📁public

    └── 📁src
        └── 📁app
            └── favicon.ico
            └── layout.tsx
            └── page.tsx
        └── 📁components
        └── 📁hooks
        └── 📁lib
        └── 📁styles
        └── 📁types
        └── 📁utils
        └── middleware.ts
    └── .eslintrc.json
    └── .gitignore
    └── .prettierrc
    └── components.json
    └── next-env.d.ts
    └── next.config.mjs
    └── package-lock.json
    └── package.json
    └── postcss.config.mjs
    └── README.md
    └── tailwind.config.ts
    └── tsconfig.json
```

- **.github/workflows**: Directorio de acciones de GitHub.
- **public**: Directorio de archivos estáticos(imágenes, svg, videos,etc.).
- **src**: Directorio principal de la aplicación.
  - **app**: Directorio para la navegación, layout y páginas de la aplicación.
    - **favicon.ico**: Icono de la aplicación.
    - **layout.tsx**: Root layout de la aplicación.
    - **page.tsx**: Home page de la aplicación.
  - **components**: Directorio de componentes de la aplicación.
  - **hooks**: Directorio de hooks personalizados (Solamente funcionan en el lado del cliente).
  - **lib**: Directorio de librerías personalizadas.
  - **styles**: Directorio de estilos globales.
  - **types**: Directorio de tipos personalizados.
  - **utils**: Directorio de utilidades.
  - **middleware.ts**: Middleware de la aplicación.
- **.eslintrc.json**: Configuración de ESLint.
- **.gitignore**: Archivos ignorados por Git.
- **.prettierrc**: Configuración de Prettier.
- **components.json**: Configuración de componentes de shadcn.
- **next-env.d.ts**: Tipos de Next.js.
- **next.config.mjs**: Configuración de Next.js.
- **package.json**: Dependencias del proyecto.
- **tailwind.config.ts**: Configuración de Tailwindcss.


## Autores

- [@alejandronoss1017](https://github.com/alejandronoss1017)
- [@ValEscoSierra](https://github.com/ValEscoSierra)
- [@StiivenOrtiz](https://github.com/StiivenOrtiz)
- [@Moyano1711](https://github.com/Moyano1711)
- [@GianlucaGav](https://github.com/GianlucaGav)

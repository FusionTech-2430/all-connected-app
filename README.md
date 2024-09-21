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


## Ejecutar con Docker

Crear la imagen de Docker

```bash
  docker build -t all-connected-app:etiqueta .
```
- `-t`: Asigna un nombre y una etiqueta a la imagen

- `.`: Indica que el contexto es el directorio actual

> 📘 INFO
>
> La etiqueta es opcional, si no se especifica, se asignará `latest` por defecto.

Ejecutar el contenedor de Docker

```bash
  docker run -d --name all-connected-app-container -p 3000:3000 all-connected-app
```

### Opciones de Docker

- `-d`: Ejecuta el contenedor en modo desconectado (en segundo plano)

- `-p`: Mapea un puerto del host a un puerto del contenedor

- `-v`: Monta un volumen

- `--name`: Asigna un nombre al contenedor

- `-e`: Define variables de entorno

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
    └── .dockerignore
    └── .eslintrc.json
    └── .gitignore
    └── .prettierrc
    └── components.json
    └── Dockerfile
    └── next-env.d.ts
    └── next.config.mjs
    └── package-lock.json
    └── package.json
    └── postcss.config.mjs
    └── README.md
    └── tailwind.config.ts
    └── tsconfig.json
```

## Autores

- [@alejandronoss1017](https://github.com/alejandronoss1017)
- [@ValEscoSierra](https://github.com/ValEscoSierra)
- [@StiivenOrtiz](https://github.com/StiivenOrtiz)
- [@Moyano1711](https://github.com/Moyano1711)
- [@GianlucaGav](https://github.com/GianlucaGav)

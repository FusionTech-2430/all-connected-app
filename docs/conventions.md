# Convenciones

En este documento se describen las convenciones que se deben seguir para mantener un código limpio y ordenado.

## Convenciones para nombrar archivos

- Utilice minúsculas para los nombres de archivos y carpetas .
- Utilice `kebab-case` para nombres de archivos y carpetas de varias palabras .
- Los archivos especiales deben utilizar la nomenclatura exacta especificada en la documentación de [Next.js](https://nextjs.org/docs/getting-started/project-structure#app-routing-conventions)

### Ejemplo de uso

```
└── 📁all-connected-app
    └── 📁.github
        └── 📁workflows
    └── 📁public
    └── 📁src
        └── 📁app
            └── 📁my-profile
                └── page.tsx
            └── layout.tsx
            └── page.tsx
        └── 📁components
            └── nav-bar.tsx
        └── 📁hooks
            └── use-toast.ts
        └── 📁types
            └── event.ts
```

## Convenciones para nombrar componentes

- Utilice `PascalCase` para los nombres de componentes `React`.
- Utilice la extensión `.tsx` para los componentes `TypeScript`.

```tsx
// src/app/my-profile/page.tsx

// Good
export default function MyProfilePage() {
  return (
    <>
      <h1>My Profile</h1>
    </>
  )
}
```

## Convenciones para nombrar variables Y funciones

- Utilice `camelCase` para los nombres de variables.
- Utilice `const` para declarar variables que no cambian su valor.
- Utilice `let` para declarar variables que cambian su valor.

```tsx
const myVariable = 'Hello World'

let age: number

function myFooFunction() {
  return `foo bar`
}
```

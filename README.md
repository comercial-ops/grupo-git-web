# GRUPO GIT — Sitio web + Tienda (Marketplace)

Sitio web corporativo de GRUPO GIT con una tienda liviana tipo marketplace:
los productos (foto, precio, descripción, referencia) se administran desde
un panel de administrador y el botón "Comprar" abre WhatsApp con un mensaje
prellenado. Incluye landing, Tienda, Portafolio y Servicios (con catálogos
PDF descargables) y Contáctanos.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Supabase
(base de datos, storage de archivos y autenticación) + Vercel (hosting).

---

## 1. Configurar Supabase (base de datos)

1. Entra a [supabase.com](https://supabase.com) e inicia sesión con tu cuenta.
2. Crea un **New Project** (elige nombre, contraseña de base de datos y región —
   `South America (São Paulo)` es la más cercana a Colombia).
3. Cuando el proyecto esté listo, ve a **SQL Editor > New query**, pega todo
   el contenido del archivo [`supabase/schema.sql`](supabase/schema.sql) de
   este repo y dale **Run**. Esto crea las tablas `products` y `catalogs`,
   las reglas de seguridad (RLS) y los buckets de Storage para fotos y PDFs.
4. Ve a **Authentication > Users > Add user** y crea el usuario admin
   (tu correo + una contraseña segura). Con esas credenciales entrarás al
   panel `/admin` del sitio.
5. Ve a **Project Settings > API** y copia:
   - **Project URL**
   - **anon public key**

## 2. Configurar variables de entorno

Copia `.env.local.example` a `.env.local` y pega los valores del paso
anterior:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
```

## 3. Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Entra a `/admin/login`
con el usuario que creaste en Supabase para publicar el primer producto o
catálogo.

## 4. Subir el código a GitHub

1. Crea una cuenta en [github.com](https://github.com) si no tienes una.
2. Crea un repositorio nuevo (vacío, sin README) desde github.com/new.
3. En este proyecto:

```bash
git init
git add .
git commit -m "Sitio GRUPO GIT"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

(Git te pedirá iniciar sesión con tu cuenta de GitHub la primera vez —
sigue el flujo del navegador que te muestre.)

## 5. Desplegar en Vercel

1. Crea una cuenta gratis en [vercel.com](https://vercel.com) — puedes
   registrarte directo con tu cuenta de GitHub.
2. Click en **Add New... > Project** e importa el repositorio que acabas
   de subir a GitHub.
3. En **Environment Variables**, agrega las mismas dos variables del paso 2
   (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click en **Deploy**. En un par de minutos tendrás una URL pública
   (`tu-proyecto.vercel.app`). Puedes conectar tu propio dominio después
   desde **Project Settings > Domains**.

Cada vez que hagas `git push` a `main`, Vercel vuelve a desplegar
automáticamente.

## Administrar el contenido

- **Productos:** `/admin` (requiere login) → "Nuevo producto": nombre,
  referencia, descripción, precio y foto. Aparece de inmediato en `/tienda`
  y en los destacados de la portada.
- **Catálogos:** mismo panel, sección "Nuevo catálogo": título + archivo PDF.
  Aparece en `/portafolio`.
- **Botón de WhatsApp:** el número está en
  [`lib/whatsapp.ts`](lib/whatsapp.ts) (`WHATSAPP_NUMBER`). El link de
  WhatsApp (`wa.me`) no permite adjuntar la foto automáticamente — el
  mensaje sí incluye el nombre, la referencia y la descripción del equipo
  para que el asesor lo identifique.

## Inventario (interno, solo con login)

Pestaña **Inventario** (aparece en el menú solo al iniciar sesión): tabla de los
equipos que realmente hay en bodega, **independiente de la tienda**. Cada ítem
tiene foto, nombre (link a la foto), referencia, marca, descripción básica,
cantidad, localización y costo.

1. **Una sola vez:** en Supabase > SQL Editor corre [`supabase/inventory.sql`](supabase/inventory.sql).
   Crea la tabla `inventory_items` y un bucket **privado** para las fotos; solo
   usuarios con login pueden leer o escribir.
2. Inicia sesión en `/admin/login` desde el celular, abre **Inventario → + Agregar ítem**,
   toma la foto con la cámara y llena los datos.
3. Las fotos se reducen automáticamente (máx. 1600 px) antes de subirse.

El **valor total** que muestra la tabla es `cantidad × costo` (el costo se asume
**por unidad**).

## Subida de archivos

Las fotos y los PDF se suben **directo del navegador a Supabase Storage**, no por
Vercel (que rechaza peticiones de más de ~4.5 MB). Catálogos: hasta 50 MB.

## Contenido real

- **Logo:** [`public/logo.png`](public/logo.png) (161×65 px). Si tienes una versión
  más grande o en SVG/PNG de alta resolución, reemplaza ese archivo para que se
  vea nítido en pantallas retina.
- **Fotos de la landing/portafolio:** ahora no hay fotos de stock; se muestra un
  diseño gráfico de marca. Para usar fotos reales copia los archivos a
  `public/images/` y apunta a ellos en [`lib/site-images.ts`](lib/site-images.ts).
- **Contacto:** correo, teléfonos y redes en [`lib/site.ts`](lib/site.ts).

## Estructura del proyecto

```
app/
  page.tsx              Landing
  tienda/                Tienda (marketplace)
  portafolio/             Portafolio y Servicios + catálogos
  contacto/               Contáctanos
  inventario/             Inventario interno (protegido)
  admin/                  Panel de administración (protegido)
components/              Navbar, Footer, tarjetas, gráficos de marca
lib/                     Clientes de Supabase, subida de archivos, WhatsApp, datos del sitio
supabase/schema.sql      SQL base (productos y catálogos)
supabase/inventory.sql   SQL del módulo de inventario
proxy.ts                 Protege /admin e /inventario (redirige a login)
```

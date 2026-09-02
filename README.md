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

## Pendientes de contenido real (placeholders marcados con `TODO`)

- **Logo:** el header/footer usan un wordmark de texto "GRUPO GIT" mientras
  se integra el logo real. Para reemplazarlo: agrega el archivo en `public/`
  y cámbialo en [`components/Navbar.tsx`](components/Navbar.tsx) y
  [`components/Footer.tsx`](components/Footer.tsx) por un `<Image>`.
- **Fotos:** la landing y el portafolio usan fotos de stock (Unsplash) de
  ingeniería/fibra óptica/capacitación como marcador temporal — están
  centralizadas en [`lib/stock-images.ts`](lib/stock-images.ts) para
  reemplazarlas fácilmente por fotos reales de GRUPO GIT.
- **Correo de contacto:** en [`app/contacto/page.tsx`](app/contacto/page.tsx)
  hay un correo de ejemplo (`contacto@grupogit.com`) — reemplázalo por el
  real.

## Estructura del proyecto

```
app/
  page.tsx              Landing
  tienda/                Tienda (marketplace)
  portafolio/             Portafolio y Servicios + catálogos
  contacto/               Contáctanos
  admin/                  Panel de administración (protegido)
components/              Navbar, Footer, tarjetas de producto/catálogo, etc.
lib/                     Clientes de Supabase, helper de WhatsApp, tipos
supabase/schema.sql      Script SQL para crear la base de datos
proxy.ts                 Protege /admin (redirige a login si no hay sesión)
```

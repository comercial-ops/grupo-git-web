"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm({ next }: { next?: string }) {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-xl border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-brand-950">Acceso interno</h1>
        <p className="mt-1 text-sm text-brand-700/70">
          Ingresa con tu cuenta de GRUPO GIT.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next ?? ""} />
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70"
            >
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wide text-brand-700/70"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

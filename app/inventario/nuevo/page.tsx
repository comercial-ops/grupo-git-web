import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ItemForm from "../ItemForm";

export default async function NuevoItemPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login?next=/inventario/nuevo");

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="text-sm font-semibold uppercase tracking-wide text-accent-600">
        Inventario
      </h1>
      <p className="mt-1 text-3xl font-bold text-brand-950">Agregar ítem</p>
      <div className="mt-8">
        <ItemForm userId={user.id} />
      </div>
    </div>
  );
}

import { requirePermission } from "@/lib/dal";
import { PERMISSIONS } from "@/lib/permissions";
import { PostForm } from "@/app/_components/post-form";

export default async function EscreverPage() {
  await requirePermission(PERMISSIONS.POST_CREATE);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-8 pt-8 pb-16">
      <h1 className="mb-6 text-center font-heading text-3xl font-medium text-ink">Escrever</h1>
      <PostForm />
    </main>
  );
}

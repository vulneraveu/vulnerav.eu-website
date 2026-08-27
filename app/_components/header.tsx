import { getUser, getPermissions } from "@/lib/dal";
import { PERMISSIONS } from "@/lib/permissions";
import { HeaderBar } from "@/app/_components/header-bar";

export async function Header() {
  const user = await getUser();
  const canWrite = user ? (await getPermissions(user.id)).has(PERMISSIONS.POST_CREATE) : false;

  return <HeaderBar user={user ? { nickname: user.nickname } : null} canWrite={canWrite} />;
}

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PERMISSIONS } from "../lib/permissions";
import { ROLES } from "../lib/roles";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const db = new PrismaClient({ adapter });

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.READER]: [PERMISSIONS.COMMENT_CREATE],
  [ROLES.WRITER]: [PERMISSIONS.COMMENT_CREATE, PERMISSIONS.POST_CREATE, PERMISSIONS.POST_PUBLISH],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.LOCKED]: [], // nenhuma permissão — ver lib/roles.ts
};

async function main() {
  for (const key of Object.values(PERMISSIONS)) {
    await db.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
  }

  for (const [roleName, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await db.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });

    for (const key of permissionKeys) {
      const permission = await db.permission.findUniqueOrThrow({ where: { key } });
      await db.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  console.log("Seed concluído: roles e permissions criadas/atualizadas.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });

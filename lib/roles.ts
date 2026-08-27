export const ROLES = {
  READER: "reader",
  WRITER: "writer",
  ADMIN: "admin",
  // Sem nenhuma permission associada (ver seed). Usada como mecanismo de
  // ban/revogação instantânea: trocar o roleId de alguém pra "locked" faz
  // o DAL tratá-lo como deslogado na próxima request, sem esperar o JWT
  // expirar e sem precisar de token versioning.
  LOCKED: "locked",
} as const;

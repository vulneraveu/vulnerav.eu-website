export const PERMISSIONS = {
  POST_CREATE: "post.create",
  POST_PUBLISH: "post.publish",
  POST_DELETE: "post.delete",
  COMMENT_CREATE: "comment.create",
  COMMENT_DELETE: "comment.delete",
  CONFESSION_MODERATE: "confession.moderate",
  USER_MANAGE: "user.manage",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

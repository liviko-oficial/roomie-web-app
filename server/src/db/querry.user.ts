import { PERMISSIONS } from "@/user/lib/const";
import type { User } from "@/user/models/userMissing.schema";
import { UserDB, UserPartialDB } from "@/user/models/userMissing.schema";
import { RequestWithUser } from "@/user/routes/middleware/jwt";

export function get_user(req: RequestWithUser["user"]): Promise<null | User> {
  const db = {
    [PERMISSIONS["PARTIAL"]]: UserPartialDB,
    [PERMISSIONS["USER"]]: UserDB,
  }[req.permissions];
  return db.findById(req._id);
}
export function delete_user(
  req: RequestWithUser["user"]
): Promise<null | User> {
  const db = {
    [PERMISSIONS["PARTIAL"]]: UserPartialDB,
    [PERMISSIONS["USER"]]: UserDB,
  }[req.permissions];
  return db.findByIdAndDelete(req._id);
}
export function get_db(
  req:
    | RequestWithUser["user"]
    | { permissions: RequestWithUser["user"]["permissions"] }
) {
  const db = {
    [PERMISSIONS["PARTIAL"]]: UserPartialDB,
    [PERMISSIONS["USER"]]: UserDB,
  }[req.permissions];
  return db;
}

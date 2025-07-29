import { PERMITIONS } from "@/user/lib/const";
import type { User } from "@/user/models/userMissing.schema";
import { UserDB, UserPartialDB } from "@/user/models/userMissing.schema";
import { RequestWithUser } from "@/user/routes/middleware/jwt";

export function get_user(req: RequestWithUser["user"]): Promise<null | User> {
  const db = {
    [PERMITIONS["PARTIAL"]]: UserPartialDB,
    [PERMITIONS["USER"]]: UserDB,
  }[req.permitions];
  return db.findById(req._id);
}
export function delete_user(
  req: RequestWithUser["user"]
): Promise<null | User> {
  const db = {
    [PERMITIONS["PARTIAL"]]: UserPartialDB,
    [PERMITIONS["USER"]]: UserDB,
  }[req.permitions];
  return db.findByIdAndDelete(req._id);
}

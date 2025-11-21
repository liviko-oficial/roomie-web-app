import { randomUUID } from "node:crypto";
type User = { token: string; expiresAt: Date; password: string };
type Users = Map<string, User>;
const MINUTE = 60 * 1000;
function cron_service(users: Users) {
  const now = new Date();
  for (const [key, user] of users) {
    if (user.expiresAt < now) {
      users.delete(key);
    }
  }
}
export class VerificationEmail {
  private static _instance: VerificationEmail;
  private readonly users: Users;
  private constructor() {
    this.users = new Map();
    setInterval(() => {
      cron_service(this.users);
    }, 30 * MINUTE);
  }
  static get instance() {
    if (!this._instance) {
      this._instance = new VerificationEmail();
    }
    return this._instance;
  }
  verify({
    token,
    email,
  }): { success: false; error: string } | { success: true; user: User } {
    if (!this.users.has(email))
      return { success: false, error: "Token not found" };
    const user = this.users.get(email);
    if (user.expiresAt < new Date()) {
      return { success: false, error: "Token expired" };
    }
    if (user.token !== token)
      return { success: false, error: "Token not found" };
    this.users.delete(email);
    return { success: true, user };
  }
  private set_email({ email, password }) {
    const now = new Date();
    if (this.users.has(email) && this.users.get(email).expiresAt > now) {
      return this.users.get(email).token;
    }
    const token = randomUUID();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
    this.users.set(email, { token, expiresAt: expiresAt, password });
    return token;
  }
  get_link_token({ email, password }): string {
    const token = this.set_email({ email, password });
    return token;
  }
}
export default VerificationEmail.instance;

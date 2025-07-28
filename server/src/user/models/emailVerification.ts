import { randomUUID } from "node:crypto";
type User = { token: string; exipiresAt: Date; password: string };
type Users = Map<string, User>;
const MINUTES = 15;
function cron_service(users: Users) {
  const now = new Date();
  for (const [key, user] of users) {
    if (user.exipiresAt < now) {
      users.delete(key);
    }
  }
}
export class VerificationEmail {
  private static _instance: VerificationEmail;
  private users: Users;
  private constructor() {
    this.users = new Map();
    setImmediate(() => {
      cron_service(this.users);
    }, MINUTES * 60);
  }
  static get instance() {
    if (!this._instance) {
      this._instance = new VerificationEmail();
    }
    return this._instance;
  }
  verify({ token, email }): { error?: string } | User {
    if (!this.users.has(email)) return { error: "Token not found" };
    const user = this.users.get(email);
    if (user.exipiresAt < new Date()) {
      return { error: "Token expired" };
    }
    if (user.token !== token) return { error: "Token not found" };
    this.users.delete(email);
    return user;
  }
  private set_email({ email, password }) {
    const now = new Date();
    if (this.users.has(email) && this.users.get(email).exipiresAt > now) {
      return this.users.get(email).token;
    }
    const token = randomUUID();
    const exipiresAt = new Date(now.getTime() + 60 * 60 * 1000);
    this.users.set(email, { token, exipiresAt, password });
    return token;
  }
  get_link_token({ email, password }): string {
    const token = this.set_email({ email, password });
    return token;
  }
}
export default VerificationEmail.instance;

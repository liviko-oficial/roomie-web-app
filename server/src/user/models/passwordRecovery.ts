import { randomUUID } from "node:crypto";

type Entries = {
  token: string;
  expires_at: Date;
};
type EmailsTokens = Map<string, Entries>;

function cron_delete(email_token: EmailsTokens) {
  const now = new Date();
  for (const [email, entry] of email_token) {
    if (entry.expires_at < now) {
      email_token.delete(email);
    }
  }
}
const MINUTE = 60 * 1000;
class ValidateToken {
  private readonly emails_tokens: EmailsTokens;
  private static _instance: ValidateToken;
  static get instance() {
    if (!this._instance) {
      return new ValidateToken();
    }
    return this._instance;
  }
  private constructor() {
    this.emails_tokens = new Map();
    setInterval(() => cron_delete(this.emails_tokens), 30 * MINUTE);
  }
  verify({ email, token }: { email: string; token: string }): boolean {
    if (!this.emails_tokens.has(email)) return false;
    const entry = this.emails_tokens.get(email);
    this.emails_tokens.delete(email);
    if (entry.expires_at < new Date()) return false;
    if (entry.token !== token) return false;
    return true;
  }
  private new_email(email: string): string {
    const now = new Date().getTime();
    const token = randomUUID();
    this.emails_tokens.set(email, {
      expires_at: new Date(now + 15 * MINUTE),
      token,
    });
    return token;
  }
  get_token({ email }): string {
    if (!email) throw Error("No email get");
    if (
      this.emails_tokens.has(email) &&
      this.emails_tokens.get(email).expires_at < new Date()
    )
      return this.emails_tokens.get(email).token;
    return this.new_email(email);
  }
}
export const tokens_system = ValidateToken.instance;

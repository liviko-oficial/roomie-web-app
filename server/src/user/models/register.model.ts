import { AuthSubmitionSchema } from "@/user/models/userAuth.schema";
import { UserDB, UserPartialDB } from "@/user/models/userMissing.schema";
import email_link from "@/user/models/email_verification";
import { make_hash } from "@/user/lib/utils";
type Params = {
  email: string;
  password: string;
};
class RegistrationError extends Error {
  constructor(message: string, name: string) {
    super(message);
    this.name = name;
  }
}

export async function register_user(param: Params) {
  const parse_email = AuthSubmitionSchema.safeParse(param);
  if (!parse_email.success) {
    throw new RegistrationError(
      parse_email.error.issues[0].message,
      "format-error"
    );
  }
  const { email, password: raw_password } = parse_email.data;
  const userDB = await UserDB.findOne({ email });
  if (userDB) {
    throw new RegistrationError("User already exist", "user-found-users");
  }
  const userPartial = await UserPartialDB.findOne({ email });
  if (userPartial) {
    throw new RegistrationError("User already exist", "user-found-userPartial");
  }
  const password = await make_hash(raw_password);
  return email_link.get_link_token({ email, password });
}

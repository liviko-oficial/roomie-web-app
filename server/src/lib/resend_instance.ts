import { RESEND_KEY } from "@/lib/const";
import { Resend } from "resend";

export const resend = new Resend(RESEND_KEY);
export default resend;

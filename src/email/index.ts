/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "@/utils/nanoId";
import { type ReactElement, type JSXElementConstructor } from "react";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  react,
  marketing,
  test,
}: {
  email: string;
  subject: string;
  react: ReactElement<any, string | JSXElementConstructor<any>>;
  marketing?: boolean;
  test?: boolean;
}) => {
  return resend.emails.send({
    from: marketing
      ? "Alan Gabriel da Bebiss <gabriel@bebiss.com.br>"
      : "Alan Gabriel <gabriel@bebiss.com.br>",
    to: test ? "delivered@resend.dev" : email,
    subject,
    react,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
  });
};

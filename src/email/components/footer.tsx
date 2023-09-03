import React from "react";

import { Hr, Tailwind, Text } from "@react-email/components";

export default function Footer({
  email,
  marketing,
}: {
  email: string;
  marketing?: boolean;
}) {
  return (
    <Tailwind>
      <Hr className="mx-0 my-6 w-full border border-gray-200" />
      {marketing ? (
        <Text className="text-[12px] leading-6 text-gray-500">
          Este e-mail foi destinado para{" "}
          <span className="text-black">{email}</span>. Se você não esperava este
          e-mail, pode ignorá-lo. Se você não quiser receber e-mails como este
          no futuro, você pode cancelar sua inscrição aqui{" "}
          <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" className="text-gray-600">
            desinscreva-se aqui
          </a>
          .
        </Text>
      ) : (
        <Text className="text-[12px] leading-6 text-gray-500">
          Este e-mail foi destinado para{" "}
          <span className="text-black">{email}</span>. Se você não esperava este
          e-mail, pode ignorá-lo. Se você está preocupado com a segurança de sua
          conta, responda a este e-mail para entrar em contato conosco.
        </Text>
      )}
    </Tailwind>
  );
}

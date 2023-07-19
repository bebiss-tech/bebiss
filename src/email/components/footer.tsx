/* eslint-disable react/no-unescaped-entities */
import { Hr, Tailwind, Text } from "@react-email/components";

type FooterProps = {
  email: string;
  marketing?: boolean;
};

export default function Footer({ email, marketing }: FooterProps) {
  return (
    <Tailwind>
      <Hr className="mx-0 my-6 w-full border border-gray-200" />
      {marketing ? (
        <Text className="text-[12px] leading-6 text-gray-500">
          Este e-mail era para <span className="text-black">{email}</span>. Se
          você não estava esperando este e-mail, pode ignorá-lo. Se você não
          quer e-mails como este no futuro, você pode{" "}
          <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" className="text-gray-600">
            cancelar aqui
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

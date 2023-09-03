import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const BEBISS_LOGO = "https://i.imgur.com/kXIuyvG.png";
export const BEBISS_THUMBNAIL = "https://i.imgur.com/WhG9deL.png";

import Footer from "./components/footer";

export default function WelcomeEmail({
  name = "Alan Gabriel",
  email = "contato@alangabriel.dev",
}: {
  name: string | null;
  email: string;
}) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Bem vindo à Bebiss</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={BEBISS_LOGO}
                width="40"
                height="40"
                alt="Bebiss"
                className="mx-auto my-0"
              />
            </Section>
            <Section className="my-8">
              <Img
                src={BEBISS_THUMBNAIL}
                alt="Bebiss"
                className="max-w-[500px]"
              />
            </Section>

            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Bem vindo à Bebiss
            </Heading>

            <Text className="text-sm leading-6 text-black">
              Obrigado por se inscrever{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Seja muito bem-vindo à Bebiss! Sou Alan Gabriel, o fundador da
              Bebiss, plataforma de confirmação de agendamentos automatizada
              para empresas modernas. Estou empolgado em tê-lo conosco!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Aqui estão algumas coisas que você pode fazer:
            </Text>

            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Agendamentos ilimitados
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Aumentar a satisfação dos clientes
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Reagendamento automático
            </Text>

            <Text className="text-sm leading-6 text-black">
              Fique à vontade para entrar em contato caso tenha alguma dúvida ou
              feedback. Estou sempre feliz em ajudar!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Alan Gabriel da Bebiss
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Footer from "./components/footer";
// import { DUB_LOGO } from "../lib/constants";
const DUB_LOGO =
  "https://ci4.googleusercontent.com/proxy/bBQ6oDXeBnsgb5XArAeTdnHFpRZ2vVkznAb6x5Z9uz3tc5XfaDmQz51BWxg_E1UwdJ0=s0-d-e1-ft#https://dub.sh/_static/logo.png";

export default function LoginLink({
  email = "gabriel@bebiss.com.br",
  url = "http://localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Fapp.localhost%3A3000%2Flogin&token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&email=youremail@gmail.com",
}: {
  email: string;
  url: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your Dub Login Link</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={DUB_LOGO}
                width="40"
                height="40"
                alt="Dub"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Your Login Link
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Welcome to Dub!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Please click the magic link below to sign in to your account.
            </Text>
            <Section className="my-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Sign in
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              or copy and paste this URL into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url.replace(/^https?:\/\//, "")}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

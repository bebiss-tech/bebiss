import Head from "next/head";

export default function Meta({
  title = "Bebiss - Confirmação Automática de Agendamentos",
  description = "Bebiss é uma solução automatizada para confirmação de agendamentos e presença através do WhatsApp. Melhore a eficiência do seu agendamento com o Bebiss.",
  image = "https://dub.sh/_static/thumbnail.png",
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
      />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta itemProp="image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        name="keywords"
        content="Sistema Bebiss, Confirmação de Agendamentos, Presença Automática, WhatsApp, Automatização de Processos"
      />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bebiss" />
      <meta name="twitter:creator" content="@steventey" />
      <meta
        name="twitter:title"
        content="Dub - Open-Source Bitly Alternative"
      />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}

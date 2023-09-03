import formatPrice from "@/utils/format-price";

type NewUserDiscordMessageParams = {
  name: string;
  email: string;
  createdAt: string;
};

export const newUserDiscordMessage = ({
  createdAt,
  email,
  name,
}: NewUserDiscordMessageParams) => {
  return {
    content: "<@1141128155835420692>",
    embeds: [
      {
        title: "Novo usuário",
        description: "Um novo usuário acabou de cadastrar na **Bebiss**",
        color: 5832663,
        fields: [
          {
            name: "Nome",
            value: name,
            inline: true,
          },
          {
            name: "Email",
            value: email,
            inline: true,
          },
        ],
        footer: {
          text: "Usuário criado em",
        },
        timestamp: createdAt,
      },
    ],
    attachments: [],
  };
};

type NewSubscriptionDiscordMessageParams = {
  companyName: string;
  period: string;
  plan: string;
  createdAt: string;
  value: number;
};

export const newSubscriptionDiscordMessage = ({
  companyName,
  createdAt,
  period,
  plan,
  value,
}: NewSubscriptionDiscordMessageParams) => {
  return {
    content: "<@1141128155835420692>",
    embeds: [
      {
        title: "Nova Assinatura",
        description: `Venda realizada! ${formatPrice(
          value
        )}\n\nVocê está cada vez mais perto de ficar rico.`,
        color: 10180863,
        fields: [
          {
            name: "Empresa",
            value: companyName,
            inline: true,
          },
          {
            name: "Período",
            value: period,
            inline: true,
          },
          {
            name: "Plano",
            value: plan,
            inline: true,
          },
        ],
        footer: {
          text: "Plano contratado em",
        },
        timestamp: createdAt,
      },
    ],
    attachments: [],
  };
};

export const logMessage = ({
  message,
  mention = false,
}: {
  message: string;
  mention?: boolean;
}) => {
  return {
    content: `${mention ? "<@1141128155835420692>: " : ""}${message}`,
    username: "🧑🏼‍💻 LOG",
    attachments: [],
  };
};

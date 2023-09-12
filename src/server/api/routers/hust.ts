import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

type CreateConnectionResponse = {
  uuid: string;
  updateFrequency: number;
};

type StatusConnectionResponse = {
  status: "qrcode" | "configuring" | "connected" | "error";
  QRCode: string | null;
  QRCodeData: string | null;
  startDate: string;
  system: {
    instanceID: number;
  };
  client: {
    id: number;
  };
  QRCodehash: string;
  message?: string;
};

const createWhatsAppConnectionSchema = z.object({
  companyId: z.string().uuid("O ID da empresa é obrigatório"),
});

const checkWhatsAppConnectionSchema = z.object({
  uuid: z.string().uuid("O ID da empresa é obrigatório"),
});

export const hustAppRouter = createTRPCRouter({
  createWhatsAppConnection: protectedProcedure
    .input(createWhatsAppConnectionSchema)
    .query(async ({ ctx, input }) => {
      const { companyId } = input;
      const { id, role } = ctx.session.user;

      if (!["ADMIN_COMPANY"].includes(role!)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a company",
        });
      }

      const company = await ctx.prisma.company.findUnique({
        where: {
          id: companyId,
        },
        select: {
          users: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Empresa não encontrada",
        });
      }

      if (
        !company.users.find(
          (user) => user.id === id && user.role === "ADMIN_COMPANY"
        )
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Você não tem permissão para conectar o WhatsApp dessa empresa",
        });
      }

      // criar conexão com o whatsapp na hust
      // salvar dados da conexão no banco de dados (criar tabela de connections)

      try {
        const {
          data: { uuid, updateFrequency },
        } = await ctx.hustAPI.post<CreateConnectionResponse>("/connection", {
          type: "whatsapp",
        });

        const statusParams = {
          params: {
            uuid,
            typeQR: "data",
          },
        };

        const {
          data: { status, QRCodeData, startDate, client, system, QRCodehash },
        } = await ctx.hustAPI.get<StatusConnectionResponse>(
          "/connection/status",
          statusParams
        );

        return {
          uuid,
          QRCodeData,
          updateFrequency,
          QRCodehash,
          status,
        };
      } catch (err) {
        console.log("[ERROR]", JSON.stringify(err, null, 2));

        return {
          error: "Erro ao criar conexão com o WhatsApp",
        };
      }
    }),
  checkWhatsAppConnection: protectedProcedure
    .input(checkWhatsAppConnectionSchema)
    .query(async ({ ctx, input }) => {
      const { uuid } = input;

      try {
        const statusParams = {
          params: {
            uuid,
            typeQR: "data",
          },
        };

        const {
          data: { status, QRCodeData, startDate, client, system, QRCodehash },
        } = await ctx.hustAPI.get<StatusConnectionResponse>(
          "/connection/status",
          statusParams
        );

        return {
          QRCodeData,
          status,
          QRCodehash,
        };
      } catch (err) {
        console.log("[ERROR]", JSON.stringify(err, null, 2));

        return {
          error: "Erro ao criar conexão com o WhatsApp",
        };
      }
    }),
});

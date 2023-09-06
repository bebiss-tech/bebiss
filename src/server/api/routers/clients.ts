/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { parse } from "date-fns";
import { z } from "zod";

const clientSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Nome deve ter no mínimo 3 caracteres",
    })
    .max(150, {
      message: "Nome deve ter no máximo 150 caracteres",
    })
    .nonempty({
      message: "Nome é obrigatório",
    }),
  phone: z
    .string({
      required_error: "Telefone é obrigatório",
    })
    .nonempty({ message: "Telefone é obrigatório" }),
  secundaryPhone: z.string().optional(),
  email: z
    .string()
    .or(z.string().email({ message: "E-mail inválido" }))
    .optional(),
  cpf: z
    .string()
    .length(11, {
      message: "CPF deve ter 11 caracteres",
    })
    .optional(),
  birthday: z
    .string()
    .length(10, {
      message: "Data de nascimento inválida",
    })
    .optional(),
  gender: z.enum(["male", "famale", "uninformed"]).optional(),
  companyId: z.string().uuid().nonempty({
    message: "Empresa é obrigatória",
  }),
});

// const paginationSchema = z.object({
//   page: z.number().min(1).optional(),
//   limit: z.number().min(1).max(100).optional(),
// });

// const editCompanySchema = clientSchema.extend({
//   id: z.string().uuid(),
// });

export const clientsRouter = createTRPCRouter({
  createClient: protectedProcedure
    .input(clientSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId, birthday, ...data } = input;
      const {
        user: { role },
      } = ctx.session;

      if (!["ADMIN_COMPANY", "MEMBER_COMPANY"].includes(role!)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to create a company",
        });
      }

      const company = await ctx.prisma.company.findUnique({
        where: {
          id: companyId,
        },
        select: {
          plan: true,
          users: {
            select: {
              id: true,
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

      if (!company.users.find((user) => user.id === ctx.session.user.id)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Você não tem permissão para criar um cliente para essa empresa",
        });
      }

      const client = await ctx.prisma.client.create({
        data: {
          ...data,
          birthday: birthday ? parse(birthday, "dd/MM/yyyy", new Date()) : null,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
      });

      return {
        status: 201,
        message: "Client created successfully",
        result: client,
      };
    }),
});

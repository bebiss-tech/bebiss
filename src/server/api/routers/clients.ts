/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
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
  birthDate: z
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
      const { companyId, name, phone } = input;
      console.log({ companyId });
      const {
        user: { role },
      } = ctx.session;

      if (["ADMIN_COMPANY", "MEMBER_COMPANY"].includes(role!)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to create a company",
        });
      }

      const client = await ctx.prisma.client.create({
        data: {
          name,
          phone,
          company: {
            connect: {
              id: "499e1c52-efa8-4adc-a22c-202d75175091",
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
  // listClients: protectedProcedure
  //   .input(paginationSchema)
  //   .query(async ({ ctx, input }) => {
  //     const { page = 1, limit = 10 } = input;
  //     const { id, role } = ctx.session.user;

  //     if (role !== "ADMIN_COMPANY") {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "You are not authorized to get companies",
  //       });
  //     }

  //     const count = await ctx.prisma.client.count();

  //     return {
  //       clients: [],
  //       count,
  //       totalPages: Math.ceil(count / limit),
  //       limit,
  //     };
  //   }),
  // getClientById: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string().uuid(),
  //     })
  //   )
  //   .query(async ({ ctx, input: { id: companyId } }) => {
  //     const { id: userId, role } = ctx.session.user;

  //     if (role !== "ADMIN_COMPANY") {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "You are not authorized to get companies",
  //       });
  //     }

  //     const clinet = null;

  //     if (!clinet) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Client not found",
  //       });
  //     }

  //     return {};
  //   }),
  // editClient: protectedProcedure
  //   .input(editCompanySchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const { id } = input;
  //     const {
  //       user: { role, id: userId },
  //     } = ctx.session;

  //     if (role !== "ADMIN_COMPANY") {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "You do not have permission to create a company",
  //       });
  //     }

  //     // company update where id, and user id

  //     return {
  //       status: 200,
  //       message: "Client updated successfully",
  //       result: {},
  //     };
  //   }),
});

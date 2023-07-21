import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const createCompanySchema = z.object({
  companyName: z
    .string()
    .min(3, {
      message: "Nome deve ter no mínimo 3 caracteres",
    })
    .max(150, {
      message: "Nome deve ter no máximo 255 caracteres",
    }),
  phone: z
    .string({
      required_error: "Telefone é obrigatório",
    })
    .nonempty({ message: "Telefone é obrigatório" }),
  zipcode: z
    .string({
      required_error: "CEP é obrigatório",
    })
    .nonempty({ message: "CEP é obrigatório" }),
  state: z
    .string({
      required_error: "Estado é obrigatório",
    })
    .nonempty({ message: "Estado é obrigatório" }),
  city: z
    .string({
      required_error: "Cidade é obrigatório",
    })
    .nonempty({ message: "Cidade é obrigatório" }),
  neighborhood: z
    .string({
      required_error: "Bairro é obrigatório",
    })
    .nonempty({ message: "Bairro é obrigatório" }),
  street: z
    .string({
      required_error: "Rua é obrigatório",
    })
    .nonempty({ message: "Rua é obrigatório" }),
  number: z
    .string({
      required_error: "Número é obrigatório",
    })
    .nonempty({ message: "Número é obrigatório" }),
});

const paginationSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const companiesRouter = createTRPCRouter({
  createCompany: protectedProcedure
    .input(createCompanySchema)
    .mutation(async ({ ctx, input }) => {
      const {
        companyName,
        phone,
        zipcode,
        state,
        city,
        neighborhood,
        street,
        number,
      } = input;
      const {
        user: { role, id: userId },
      } = ctx.session;

      if (role !== "ADMIN_COMPANY") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to create a company",
        });
      }

      const company = await ctx.prisma.company.create({
        data: {
          name: companyName,
          phone,
          address: {
            create: {
              zipCode: zipcode,
              state,
              city,
              neighborhood,
              street,
              number,
            },
          },
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        status: 201,
        message: "Company created successfully",
        result: company,
      };
    }),
  listCompanies: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { page = 1, limit = 10 } = input;
      const { id, role } = ctx.session.user;

      if (role !== "ADMIN_COMPANY") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to get companies",
        });
      }

      const companies = await ctx.prisma.company.findMany({
        where: {
          users: {
            some: {
              id,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const count = await ctx.prisma.client.count();

      return {
        companies,
        count,
        totalPages: Math.ceil(count / limit),
        limit,
      };
    }),
});

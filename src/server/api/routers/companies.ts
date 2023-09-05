/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const companySchema = z.object({
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

const editCompanySchema = companySchema.extend({
  id: z.string().uuid(),
});

export const companiesRouter = createTRPCRouter({
  createCompany: protectedProcedure
    .input(companySchema)
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
          message: "Você não tem permissão para criar uma empresa",
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
        message: "Empresa criada com sucesso",
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
          message: "Você não está autorizado a contratar empresas",
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
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const companiesMapper = companies.map((company) => ({
        ...company,
        address: `${company.address.street}, ${company.address.number} - ${company.address.neighborhood}, ${company.address.city} - ${company.address.state}`,
        whatsapp: "Desconectado",
      }));

      const count = await ctx.prisma.company.count();

      return {
        companies: companiesMapper,
        count,
        totalPages: Math.ceil(count / limit),
        limit,
      };
    }),
  getCompanyById: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input: { id: companyId } }) => {
      const { id: userId, role } = ctx.session.user;

      if (role !== "ADMIN_COMPANY") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to get companies",
        });
      }

      const company = await ctx.prisma.company.findFirst({
        where: {
          id: companyId,
          users: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
      });

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found",
        });
      }

      const companyMapper = {
        ...company,
        address: `${company.address.street}, ${company.address.number} - ${company.address.neighborhood}, ${company.address.city} - ${company.address.state}`,
        whatsapp: "Desconectado",
      };

      return companyMapper;
    }),
  editCompany: protectedProcedure
    .input(editCompanySchema)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
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

      // company update where id, and user id
      const company = await ctx.prisma.company.update({
        where: {
          id,
          // @ts-ignore
          users: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          users: {
            select: {
              id: true,
            },
          },
        },
        data: {
          name: companyName,
          phone,
          address: {
            update: {
              zipCode: zipcode,
              state,
              city,
              neighborhood,
              street,
              number,
            },
          },
        },
      });

      return {
        status: 200,
        message: "Company updated successfully",
        result: company,
      };
    }),
});

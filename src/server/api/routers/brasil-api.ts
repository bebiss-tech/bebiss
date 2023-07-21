import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

const getAddressByZipcodeSchema = z.object({
  zipcode: z.string().nonempty("O CEP é obrigatório"),
});

type Address = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

export const brasilAPIRouter = createTRPCRouter({
  getAddressByZipcode: publicProcedure
    .input(getAddressByZipcodeSchema)
    .query(async ({ ctx, input }) => {
      const { zipcode } = input;
      const response = await ctx.axios.get<Address>(
        `https://brasilapi.com.br/api/cep/v1/${zipcode}`
      );
      return response.data;
    }),
});

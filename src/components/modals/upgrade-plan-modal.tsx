/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { getStripe } from "@/lib/stripe";
import { api } from "@/utils/api";
import formatPrice from "@/utils/format-price";
import { PLANS } from "@/utils/plans";
import { motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import Confetti from "react-dom-confetti";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CheckCircleFill from "../ui/icons/check-circle-fill";
import { Separator } from "../ui/separator";
import Modal from "./base-modal";

type UpgradePlanModalProps = {
  onChangeVisibility: (open: boolean) => void;
  open: boolean;
  welcomeFlow?: boolean;
};

const UpgradePlanModal = ({
  onChangeVisibility,
  open,
  welcomeFlow,
}: UpgradePlanModalProps) => {
  const router = useRouter();
  const companyId = router.query.id as string;
  const [period, setPeriod] = useState<"mensal" | "anual">("mensal");

  const plan = welcomeFlow ? PLANS[0]! : PLANS[1]!;
  const price = formatPrice(plan?.price[period].amount);
  const priceId =
    plan.price[period].priceIds[
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? "production"
        : "test"
    ];

  const { mutate: createCheckoutSession, isLoading } =
    api.checkout.createCheckoutSession.useMutation();

  const handleCheckoutSessin = () => {
    createCheckoutSession(
      {
        cancelUrl: `${window.location.origin}/app/welcome?type=upgrade&id=${companyId}`,
        successUrl: `${window.location.origin}/app/welcome?type=whatsapp&id=${companyId}`,
        stripePriceId: priceId,
        companyId,
      },
      {
        onSuccess: async ({ sessionId }) => {
          const stripe = await getStripe();
          void stripe?.redirectToCheckout({ sessionId });
        },
      }
    );
  };

  return (
    <Modal
      showModal={open}
      setShowModal={onChangeVisibility}
      welcomeFlow={welcomeFlow}
    >
      <motion.div className="overflow-hidden">
        <div className="mx-auto w-full max-w-sm p-6 text-center">
          <h1 className="mb-3 mt-2 flex items-center justify-center gap-3 text-xl tracking-tight transition-colors">
            Bebiss <MessagesSquare size={18} />
          </h1>

          <h2 className="mb-1 text-xl font-medium">Assine o PRO</h2>
          <p className="text-center text-sm text-gray-500">
            Para começar a usar a Bebiss, assine o plano PRO.
          </p>
        </div>

        <Separator />

        <div className="mx-auto w-full max-w-md p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 leading-6 text-slate-900">
              PRO {period}{" "}
              <Badge variant="outline" className="text-sm font-normal">
                {price}/{period}
              </Badge>
            </p>

            <Confetti
              active={period === "anual"}
              config={{ elementCount: 200, spread: 90 }}
            />

            <button
              onClick={() => {
                setPeriod(period === "mensal" ? "anual" : "mensal");
              }}
              className="text-xs text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-800"
            >
              {period === "mensal"
                ? "Ganhe 2 meses grátis 🎁"
                : "Alternar para mensal"}
            </button>
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            <li className="ml-1 flex items-center space-x-2 text-sm leading-4 text-gray-500">
              <CheckCircleFill className="h-5 w-5 text-green-500" />
              <span>Agendamentos ilimitados</span>
            </li>
            <li className="ml-1 flex items-center space-x-2 text-sm leading-4 text-gray-500">
              <CheckCircleFill className="h-5 w-5 text-green-500" />
              <span>Profissionais ilimitados</span>
            </li>
            <li className="ml-1 flex items-center space-x-2 text-sm leading-4 text-gray-500">
              <CheckCircleFill className="h-5 w-5 text-green-500" />
              <span>Diminuir o número de faltas</span>
            </li>
            <li className="ml-1 flex items-center space-x-2 text-sm leading-4 text-gray-500">
              <CheckCircleFill className="h-5 w-5 text-green-500" />
              <span>Ter previsibilidade de atendimentos</span>
            </li>
            <li className="ml-1 flex items-center space-x-2 text-sm leading-4 text-gray-500">
              <CheckCircleFill className="h-5 w-5 text-green-500" />
              <span>Ter uma agenda organizada</span>
            </li>
            <li className="ml-1 flex items-center space-x-2 text-sm leading-4 text-gray-500">
              <CheckCircleFill className="h-5 w-5 text-green-500" />
              <span>Aumentar a satisfação dos clientes</span>
            </li>
            <li className="ml-1 flex items-center space-x-2 text-sm leading-4 text-gray-500">
              <CheckCircleFill className="h-5 w-5 text-green-500" />
              <span>Reagendamento automático</span>
            </li>
          </ul>

          <Button className="mb-3 mt-8 w-full" onClick={handleCheckoutSessin}>
            {isLoading
              ? "Carregando..."
              : `Assine o PRO ${period} para continuar`}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default UpgradePlanModal;

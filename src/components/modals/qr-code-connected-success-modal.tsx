/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { STAGGER_CHILD_VARIANTS } from "@/utils/animations";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/router";

import Confetti from "react-dom-confetti";
import { Button } from "../ui/button";
import Modal from "./base-modal";

type QRCodeConnectedSuccessModalProps = {
  onChangeVisibility: (open: boolean) => void;
  open: boolean;
  welcomeFlow?: boolean;
};

const QRCodeConnectedSuccessModal = ({
  onChangeVisibility,
  open,
  welcomeFlow,
}: QRCodeConnectedSuccessModalProps) => {
  const router = useRouter();

  const { mutate: changeStep } = api.onboarding.changeStep.useMutation();

  const handleFinishOnboarding = () => {
    changeStep(
      {
        step: "COMPLETE_SETUP",
        query: undefined,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            void router.push({
              pathname: "/app",
            });
          }, 300);
        },
      }
    );
  };

  return (
    <Modal
      showModal={open}
      setShowModal={onChangeVisibility}
      welcomeFlow={welcomeFlow}
      className="max-w-[700px] transition-colors"
    >
      <motion.div
        className="p-6"
        variants={{
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <div className="flex justify-center">
          <Confetti active={true} config={{ elementCount: 200, spread: 90 }} />
        </div>

        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <div className="mb-2 flex items-center gap-2">
            <BadgeCheck size={32} className="text-emerald-500" />
            <h3 className="text-lg font-medium">
              WhatsApp conectado com sucesso
            </h3>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Agora você já pode começar a cadastrar agendamentos
          </p>
          <Button size="sm" onClick={handleFinishOnboarding}>
            Acessar dashboard
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default QRCodeConnectedSuccessModal;

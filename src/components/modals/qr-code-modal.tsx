/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { STAGGER_CHILD_VARIANTS } from "@/utils/animations";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import { BadgeCheck, RotateCw } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { Button } from "../ui/button";
import MenuIcon from "../ui/icons/whatsapp/menu";
import SettingsIcon from "../ui/icons/whatsapp/settings";
import Modal from "./base-modal";

type QRCodeModalProps = {
  onChangeVisibility: (open: boolean) => void;
  open: boolean;
  welcomeFlow?: boolean;
};

const QRCodeModal = ({
  onChangeVisibility,
  open,
  welcomeFlow,
}: QRCodeModalProps) => {
  const router = useRouter();

  const [QRcodeExpire, setQRcodeExpire] = useState(false);
  const [connected, setConnected] = useState(false);

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

  useEffect(() => {
    if (!QRcodeExpire) {
      setTimeout(() => {
        // setQRcodeExpire(true);
        setConnected(true);
      }, 1000 * 5);
    }
  }, [QRcodeExpire]);

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
        {!connected && (
          <>
            <motion.div variants={STAGGER_CHILD_VARIANTS} className="mb-4">
              <h2 className="mb-1 text-lg font-medium">Conectar WhatsApp</h2>

              <p className="text-sm text-gray-500">
                Isso possibilitará o envio de mensagens automáticas relacionadas
                aos agendamentos diretamente do seu WhatsApp.
              </p>
            </motion.div>

            <div className="flex justify-between gap-6">
              <div className="mt-4 flex flex-col justify-between">
                <ol className="list-decimal space-y-4 pl-5 text-base text-gray-800">
                  <motion.li variants={STAGGER_CHILD_VARIANTS} className="">
                    Abra o WhatsApp no seu telefone
                  </motion.li>

                  <motion.li variants={STAGGER_CHILD_VARIANTS}>
                    <p>
                      Toque em{" "}
                      <span className="inline-flex gap-2 font-semibold">
                        Menu <MenuIcon />
                      </span>{" "}
                      ou{" "}
                      <span className="inline-flex gap-2 font-semibold">
                        Configurações <SettingsIcon />
                      </span>{" "}
                      e selecione{" "}
                      <span className="font-semibold">
                        Aparelhos conectados.
                      </span>
                    </p>
                  </motion.li>

                  <motion.li variants={STAGGER_CHILD_VARIANTS}>
                    Toque em{" "}
                    <span className="font-semibold">Conectar um aparelho</span>
                  </motion.li>

                  <motion.li variants={STAGGER_CHILD_VARIANTS}>
                    Aponte seu telefone para esta tela para capturar o QR Code
                  </motion.li>
                </ol>
              </div>

              <motion.div
                variants={STAGGER_CHILD_VARIANTS}
                className="flex-shrink-0"
              >
                <div className="relative w-fit overflow-hidden">
                  {QRcodeExpire && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95">
                      <button
                        onClick={() => setQRcodeExpire(false)}
                        className="flex h-60 w-60 flex-col items-center justify-center gap-3 rounded-full bg-[#71BBA8] p-4 text-white"
                      >
                        <RotateCw size={32} />
                        <span className="text-center font-medium uppercase">
                          Clique para recarregar o QR code
                        </span>
                      </button>
                    </div>
                  )}

                  <img
                    src="/images/QRCode.png"
                    alt="QR Code"
                    className="h-64 w-64"
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <Confetti
            active={connected}
            config={{ elementCount: 200, spread: 90 }}
          />
        </div>

        {connected && (
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
        )}
      </motion.div>
    </Modal>
  );
};

export default QRCodeModal;

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { STAGGER_CHILD_VARIANTS } from "@/utils/animations";
import { api } from "@/utils/api";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { QRCode } from "react-qrcode-logo";

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

  const interval = useRef<NodeJS.Timeout>();

  const [QRcodeExpire, setQRcodeExpire] = useState(false);
  const [QRCodeData, setQRCodeData] = useState("");

  const { mutate: changeStep } = api.onboarding.changeStep.useMutation();
  const {
    data,
    isLoading,
    isSuccess,
    refetch: createWhatsAppConnectionrefetch,
  } = api.hust.createWhatsAppConnection.useQuery(
    {
      companyId: router.query.id as string,
    },
    {
      enabled: !!router.query.id && router.query.type === "whatsapp",
    }
  );

  const {
    refetch,
    data: checkStatus,
    isSuccess: checkStatusIsSuccess,
  } = api.hust.checkWhatsAppConnection.useQuery(
    {
      uuid: data?.uuid as string,
    },
    {
      enabled: !!data?.uuid && router.query.type === "whatsapp",
      onSuccess(data) {
        if (!!data.QRCodeData) {
          setQRCodeData(data.QRCodeData);
          setQRcodeExpire(false);
        }

        if (data.status === "error") setQRcodeExpire(true);

        if (data.status === "connected") {
          setQRcodeExpire(false);

          const query = {
            type: "whatsapp-connected",
            id: router.query.id as string,
          };

          changeStep(
            {
              step: "CONNECT_WHATSAPP_CONNECTED",
              query,
            },
            {
              onSuccess: () => {
                setTimeout(() => {
                  void router.push({
                    pathname: "/app",
                    query,
                  });
                }, 300);
              },
            }
          );
        }
      },
    }
  );

  let lastQRCodeHash: string;

  useEffect(() => {
    console.log("QRCodeModal useEffect");

    if (isSuccess && checkStatusIsSuccess && checkStatus.status) {
      interval.current = setInterval(async () => {
        const { data: connection, isSuccess: connectionIsSuccess } =
          await refetch();

        if (!connectionIsSuccess) return;

        if (connection.status === "connected") clearInterval(interval.current);

        if (
          !connection.status ||
          !["qrcode", "configuring", "connected"].includes(
            connection.status as string
          )
        ) {
          clearInterval(interval.current);
        }

        if (connection.status === "qrcode") {
          if (lastQRCodeHash === connection.QRCodehash) return;

          // eslint-disable-next-line react-hooks/exhaustive-deps
          lastQRCodeHash = connection.QRCodehash;
        }
      }, data?.updateFrequency || 2000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [checkStatus?.status, checkStatusIsSuccess, data, isSuccess]);

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
        <motion.div variants={STAGGER_CHILD_VARIANTS} className="mb-4">
          <h2 className="mb-1 text-lg font-medium">Conectar WhatsApp</h2>

          <p className="text-sm text-gray-500">
            Isso possibilitará o envio de mensagens automáticas relacionadas aos
            agendamentos diretamente do seu WhatsApp.
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
                  <span className="font-semibold">Aparelhos conectados.</span>
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
            <div className="relative w-fit min-w-[256px] overflow-hidden">
              {QRcodeExpire && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/95">
                  <button
                    onClick={async () =>
                      await createWhatsAppConnectionrefetch()
                    }
                    className="flex h-60 w-60 flex-col items-center justify-center gap-3 rounded-full bg-[#71BBA8] p-4 text-white"
                  >
                    <RotateCw size={32} />
                    <span className="text-center font-medium uppercase">
                      Clique para recarregar o QR code
                    </span>
                  </button>
                </div>
              )}

              {/* <img
                    src="/images/QRCode.png"
                    alt="QR Code"
                    className="h-64 w-64"
                  /> */}

              {isLoading && <span>Buscando QRCode</span>}

              {checkStatusIsSuccess && QRCodeData && (
                <QRCode value={QRCodeData} size={256} fgColor="#1f2937" />
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default QRCodeModal;

import Meta from "@/components/layouts/meta";
import NewCompanyModal from "@/components/modals/new-company-modal";
import QRCodeModal from "@/components/modals/qr-code-modal";
import UpgradePlanModal from "@/components/modals/upgrade-plan-modal";
import Intro from "@/components/welcome/Intro";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Welcome() {
  const router = useRouter();
  const { data } = useSession();
  const [showUpgradePlanModal, setshowUpgradePlanModal] = useState(false);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);

  useEffect(() => {
    if (router.query.type === "company") {
      setTimeout(() => {
        setShowNewCompanyDialog(true);
      }, 200);
    } else {
      setShowNewCompanyDialog(false);
    }

    if (router.query.type === "whatsapp") {
      setTimeout(() => {
        setShowQRCodeModal(true);
      }, 200);
    } else {
      setShowQRCodeModal(false);
    }

    if (router.query.type === "upgrade") {
      setTimeout(() => {
        setshowUpgradePlanModal(true);
      }, 200);
    } else {
      setshowUpgradePlanModal(false);
    }
  }, [router.query.type]);

  return (
    <>
      <Meta title={`Bem vindo, ${data?.user.name || ""}!`} />

      <div className="flex min-h-screen flex-col items-center justify-center bg-grid-slate-50 dark:bg-black dark:bg-grid-gray-900/50">
        <NewCompanyModal
          welcomeFlow
          open={showNewCompanyDialog}
          onChangeVisibility={setShowNewCompanyDialog}
        />

        <UpgradePlanModal
          welcomeFlow
          open={showUpgradePlanModal}
          onChangeVisibility={setshowUpgradePlanModal}
        />

        <QRCodeModal
          welcomeFlow
          open={showQRCodeModal}
          onChangeVisibility={setShowQRCodeModal}
        />

        <AnimatePresence mode="wait">
          {!router.query.type && <Intro key="intro" />}
        </AnimatePresence>
      </div>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import SidebarLogo from "@/components/Sidebar/SidebarLogo";
import { STAGGER_CHILD_VARIANTS } from "@/utils/animations";
import { api } from "@/utils/api";

import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Intro = () => {
  const router = useRouter();

  const { mutate: changeOnboardingStep } =
    api.onboarding.changeStep.useMutation();

  const handleNavigateToCreateCompany = () => {
    void router.push({
      pathname: "/app/welcome",
      query: {
        type: "company",
      },
    });

    changeOnboardingStep({
      step: "CREATE_COMPANY",
      query: {
        type: "company",
      },
    });
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="z-10"
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center text-center"
      >
        <motion.div variants={STAGGER_CHILD_VARIANTS} className="mb-6 ">
          <SidebarLogo className="pointer-events-none mb-0 scale-125 pb-0 pl-0 dark:text-white" />
        </motion.div>

        <motion.h1
          variants={STAGGER_CHILD_VARIANTS}
          className="text-5xl font-bold tracking-[-0.04em] text-slate-800 transition-colors dark:text-white sm:text-6xl"
        >
          Bem vindo à Bebiss
        </motion.h1>

        <motion.p
          variants={STAGGER_CHILD_VARIANTS}
          className="mt-6 max-w-2xl tracking-[-0.04em] text-gray-600 transition-colors dark:text-gray-300 sm:text-lg"
        >
          Bebiss oferece ferramentas para diminuir a taxa de no-show na sua
          empresa.
          <br />
          Aumente a taxa de comparecimento dos seus clientes.
        </motion.p>

        <motion.button
          variants={STAGGER_CHILD_VARIANTS}
          className="mt-8 inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-medium text-slate-50 ring-offset-white transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:ring-offset-slate-950 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-800"
          onClick={handleNavigateToCreateCompany}
        >
          Começar agora
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Intro;

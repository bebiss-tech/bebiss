import { AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type ModalProps = {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
  onClose?: () => void;
  welcomeFlow?: boolean;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

const Modal = ({
  setShowModal,
  showModal,
  welcomeFlow,
  children,
  title,
  description,
  onClose,
  className,
}: ModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }

    setShowModal(open);
  };

  return (
    <AnimatePresence>
      <Dialog
        open={showModal}
        onOpenChange={handleOpenChange}
        modal={!welcomeFlow}
      >
        <DialogContent welcomeFlow={welcomeFlow} className={className}>
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};

export default Modal;

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  open?: boolean;
}

export default function Modal({ children, onClose, open = true }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-card rounded-2xl shadow-2xl">
        {children}
      </DialogContent>
    </Dialog>
  );
}
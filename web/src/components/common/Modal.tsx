import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  open?: boolean;
  /** 스크린 리더용 제목. 지정하지 않으면 "모달" */
  title?: string;
}

export default function Modal({
  children,
  onClose,
  open = true,
  title = "모달",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="bg-card rounded-2xl shadow-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
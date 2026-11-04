import { Button } from './Button';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={open} onClose={onCancel} title={title} description={description} size="sm">
    <div className="flex justify-end gap-2">
      <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
      <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
    </div>
  </Modal>
);

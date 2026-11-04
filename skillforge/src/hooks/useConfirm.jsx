import { useCallback, useState } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

/**
 * Promise-based replacement for window.confirm():
 *
 *   const { confirm, dialog } = useConfirm();
 *   if (!(await confirm({ title: 'Delete skill?', confirmLabel: 'Delete' }))) return;
 *   ...
 *   return <>{page}{dialog}</>;
 */
export function useConfirm() {
  const [state, setState] = useState(null); // { options, resolve, open }

  const confirm = useCallback(
    (options) => new Promise((resolve) => setState({ options, resolve, open: true })),
    []
  );

  // Keep the options while the dialog animates out, so the title doesn't blank.
  const settle = (value) => {
    state?.resolve(value);
    setState((s) => (s ? { ...s, open: false } : s));
  };

  const dialog = (
    <ConfirmDialog
      open={Boolean(state?.open)}
      title={state?.options.title}
      description={state?.options.description}
      confirmLabel={state?.options.confirmLabel}
      variant={state?.options.variant}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  );

  return { confirm, dialog };
}

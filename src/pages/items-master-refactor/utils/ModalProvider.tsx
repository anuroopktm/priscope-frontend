
import React, { createContext, useContext, useState } from "react";
import { ConfirmDialog } from "../components/confirm-dialog";

interface ConfirmOptions {
    header?: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    showCheckbox?: boolean
}

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(
    () => Promise.resolve(false)
);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<
        (ConfirmOptions & { resolve: ((value: boolean) => void) | null }) | null
    >(null);

    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({ ...options, resolve });
        });
    };

    const handleConfirm = () => {
        state?.resolve?.(true);
        setState(null);
    };

    const handleCancel = () => {
        state?.resolve?.(false);
        setState(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {state && (
                <ConfirmDialog
                    header={state.header}
                    message={state.message}
                    confirmButtonText={state.confirmButtonText}
                    cancelButtonText={state.cancelButtonText}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    return useContext(ConfirmContext);
}

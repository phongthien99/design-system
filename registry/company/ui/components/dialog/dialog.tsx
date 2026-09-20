import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";
import { cn, mergeStateClassName } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;

export function DialogTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger className={mergeStateClassName("ds-dialog-trigger", className)} {...props} />;
}

export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup> & {
  backdropClassName?: string;
  viewportClassName?: string;
};

export function DialogContent({
  backdropClassName,
  children,
  className,
  viewportClassName,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className={cn("ds-dialog-backdrop", backdropClassName)} />
      <DialogPrimitive.Viewport className={cn("ds-dialog-viewport", viewportClassName)}>
        <DialogPrimitive.Popup className={mergeStateClassName("ds-dialog-content", className)} {...props}>
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("ds-dialog-header", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("ds-dialog-footer", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={mergeStateClassName("ds-dialog-title", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={mergeStateClassName("ds-dialog-description", className)} {...props} />;
}

export function DialogClose({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close className={mergeStateClassName("ds-dialog-close", className)} {...props} />;
}

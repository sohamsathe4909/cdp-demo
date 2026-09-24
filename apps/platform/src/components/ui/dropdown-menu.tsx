"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("Dropdown menu components must be used within DropdownMenu");
  }
  return context;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { open, setOpen } = useDropdownMenu();

  if (!asChild || !React.isValidElement(children)) {
    return (
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full outline-none"
      >
        {children}
      </button>
    );
  }

  const child = children as React.ReactElement<any>;
  const childProps = child.props as React.HTMLAttributes<HTMLElement> & {
    onClick?: React.MouseEventHandler<HTMLElement>;
  };

  return React.cloneElement(child, {
    ...childProps,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onClick?.(event);
      setOpen(!open);
    },
  } as any);
}

interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  sideOffset?: number;
}

export function DropdownMenuContent({
  children,
  className,
  align = "start",
  side = "bottom",
  sideOffset = 0,
  style,
  ...props
}: DropdownMenuContentProps) {
  const { open } = useDropdownMenu();

  // Panel is hidden until the trigger is clicked.
  if (!open) {
    return null;
  }

  const alignmentClass =
    align === "end"
      ? "right-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "left-0";

  const positionStyle =
    side === "top"
      ? { bottom: `calc(100% + ${sideOffset}px)` }
      : { top: `calc(100% + ${sideOffset}px)` };

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[12rem] rounded-2xl border bg-white p-2 shadow-xl",
        alignmentClass,
        className,
      )}
      style={{
        ...style,
        ...positionStyle,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { setOpen } = useDropdownMenu();
  const classes = cn(
    "flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none hover:bg-[#f9fff6] focus:bg-[#f9fff6]",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    const childProps = child.props as React.HTMLAttributes<HTMLElement> & {
      onClick?: React.MouseEventHandler<HTMLElement>;
    };

    return React.cloneElement(child, {
      ...childProps,
      className: cn(classes, childProps.className),
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        setOpen(false);
        props.onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
      },
    } as any);
  }

  return (
    <button
      type="button"
      {...props}
      className={classes}
      onClick={(event) => {
        setOpen(false);
        props.onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("my-1 h-px bg-black/[0.07]", className)}
      {...props}
    />
  );
}

import { useIsMobile } from "@/features/shared/hooks/use-mobile";
import { useCallback, useEffect, useId, useState } from "react";
import { useLocation } from "react-router-dom";

export interface UseMobileMenuProps {
  /**
   * Whether the menu should auto-close when navigating to a different route
   * @default true
   */
  autoCloseOnRoute?: boolean;
  /**
   * Whether the menu should auto-close when the viewport switches to desktop
   * @default true
   */
  autoCloseOnDesktop?: boolean;
  /**
   * Callback fired when the menu opens
   */
  onOpen?: () => void;
  /**
   * Callback fired when the menu closes
   */
  onClose?: () => void;
}

export interface UseMobileMenuReturn {
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** Function to open the menu */
  open: () => void;
  /** Function to close the menu */
  close: () => void;
  /** Function to toggle the menu state */
  toggle: () => void;
  /** Unique ID for accessibility attributes */
  menuId: string;
  /** Whether the current device is mobile */
  isMobile: boolean;
}

/**
 * Custom hook for managing mobile menu state with automatic responsive behavior
 * and route-based closing functionality
 */
export const useMobileMenu = ({
  autoCloseOnRoute = true,
  autoCloseOnDesktop = true,
  onOpen,
  onClose,
}: UseMobileMenuProps = {}): UseMobileMenuReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const menuId = useId();

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  //   // Auto-close when navigating to a different route
  useEffect(() => {
    if (autoCloseOnRoute && isOpen) {
      close();
    }
  }, [location.pathname, autoCloseOnRoute, close]);

  //   // Auto-close when switching to desktop view
  useEffect(() => {
    if (autoCloseOnDesktop && !isMobile && isOpen) {
      close();
    }
  }, [isMobile, autoCloseOnDesktop, isOpen, close]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    menuId,
    isMobile,
  };
};

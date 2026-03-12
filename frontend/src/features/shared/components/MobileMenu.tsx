import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  navigationItems,
  type NavigationItem,
} from "@/features/shared/config/navigation.config";
import { cn } from "@/features/shared/utils";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { Menu, X } from "lucide-react";
import React, { forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  menuId: string;
  currentView?: string;
  className?: string;
}

interface MobileMenuTriggerProps {
  onToggle: () => void;
  isOpen: boolean;
  className?: string;
}

interface MobileMenuItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
  delay: number;
}

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuVariants = {
  hidden: {
    x: "100%",
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 300,
    },
  },
  visible: {
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 300,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 300,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
};

export const MobileMenuTrigger = forwardRef<
  HTMLButtonElement,
  MobileMenuTriggerProps
>(({ onToggle, isOpen, className }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn("md:hidden relative hover:bg-muted/50 rounded-full", className)}
    onClick={onToggle}
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
  >
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="close"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <X className="h-6 w-6" />
        </motion.div>
      ) : (
        <motion.div
          key="menu"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Menu className="h-6 w-6" />
        </motion.div>
      )}
    </AnimatePresence>
  </Button>
));

MobileMenuTrigger.displayName = "MobileMenuTrigger";

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  item,
  isActive,
  onClick,
  delay,
}) => {
  const Icon = item.icon;

  return (
    <motion.div variants={itemVariants} custom={delay}>
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group relative overflow-hidden",
          "hover:bg-muted",
          "focus:bg-muted focus:outline-none",
          isActive && "bg-primary/10 text-primary"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
            isActive
              ? "bg-primary text-white shadow-glow"
              : "bg-white dark:bg-muted border border-border group-hover:border-primary/50 text-muted-foreground group-hover:text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 text-left z-10">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium text-base", isActive ? "font-semibold" : "")}>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-sm opacity-70 mt-0.5 font-normal">{item.description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  menuId,
  currentView,
  className,
}) => {
  const location = useLocation();

  const activeItem = navigationItems.find(
    (item) => currentView === item.id || location.pathname === item.href
  );

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const shouldClose = info.offset.x > 100 && info.velocity.x > 500;
      if (shouldClose) {
        onClose();
      }
    },
    [onClose]
  );

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={cn("md:hidden", className)}>
          <motion.div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-xl"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.nav
            id={menuId}
            className={cn(
              "fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm",
              "bg-background/95 backdrop-blur-2xl border-l border-white/20 shadow-2xl",
              "flex flex-col overflow-hidden"
            )}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <motion.div
              className="flex items-center justify-between p-6 border-b border-border/40"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary text-white rounded-xl shadow-glow flex items-center justify-center">
                  <span className="font-bold text-lg">TM</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  TaskMaster
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-full hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>

            <div className="flex-1 overflow-y-auto p-6">
              <motion.div
                className="space-y-3"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {navigationItems.map((item, index) => (
                  <MobileMenuItem
                    key={item.id}
                    item={item}
                    isActive={item.id === activeItem?.id}
                    onClick={onClose}
                    delay={index * 0.05}
                  />
                ))}
              </motion.div>
            </div>

            <motion.div
              className="p-6 border-t border-border/40 bg-muted/20"
              variants={itemVariants}
            >
               <p className="text-xs text-center text-muted-foreground">
                  v1.0.0 &bull; TaskMaster Inc.
               </p>
            </motion.div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

MobileMenu.displayName = "MobileMenu";

/**
 * 🎨 PREMIUM UI COMPONENT LIBRARY
 * 
 * Enterprise-grade, beautiful, accessible components
 * with smooth animations and intuitive interactions
 */

import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Menu, X, Bell, Settings } from "lucide-react";

/**
 * PREMIUM BUTTON - Multiple variants
 */
export interface PremiumButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  loading,
  children,
  onClick,
  className = "",
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-800",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={`
        rounded-lg font-semibold transition-all duration-200 flex items-center gap-2
        ${variants[variant]} ${sizes[size]} ${className}
        ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {loading ? <div className="animate-spin">⟳</div> : icon}
      {children}
    </motion.button>
  );
};

/**
 * PREMIUM CARD - Beautiful container with hover effects
 */
export interface PremiumCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  subtitle,
  children,
  onClick,
  interactive = false,
  className = "",
}) => {
  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : {}}
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200
        p-6 border border-gray-100 ${interactive ? "cursor-pointer" : ""} ${className}
      `}
    >
      {title && <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {children}
    </motion.div>
  );
};

/**
 * PREMIUM INPUT - Enhanced text input with icons
 */
export interface PremiumInputProps {
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  error?: string;
  className?: string;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
  placeholder,
  icon,
  value,
  onChange,
  type = "text",
  error,
  className = "",
}) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        {icon && <span className="pl-3 text-gray-400">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`
            flex-1 bg-transparent px-3 py-2.5 outline-none text-gray-900
            placeholder-gray-400 ${className}
          `}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

/**
 * PREMIUM DROPDOWN - Beautiful select component
 */
export interface DropdownOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface PremiumDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
}

export const PremiumDropdown: React.FC<PremiumDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  icon,
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2.5 text-left hover:border-gray-300 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className={selected ? "text-gray-900" : "text-gray-400"}>
            {selected?.label || placeholder}
          </span>
        </span>
        <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-blue-50 flex items-center gap-2 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {option.icon && <span className="text-gray-400">{option.icon}</span>}
                <span className="text-gray-900">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * PREMIUM MODAL - Beautiful dialog with animations
 */
export interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: { label: string; onClick: () => void; variant?: "primary" | "secondary" }[];
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl max-w-md w-full mx-4 z-50"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
            {actions && (
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                {actions.map((action, idx) => (
                  <PremiumButton
                    key={idx}
                    variant={action.variant || "secondary"}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </PremiumButton>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * PREMIUM NAVBAR - Modern navigation header
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: number;
}

export interface PremiumNavbarProps {
  logo?: ReactNode;
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (href: string) => void;
  rightContent?: ReactNode;
}

export const PremiumNavbar: React.FC<PremiumNavbarProps> = ({
  logo,
  items,
  activeItem,
  onItemClick,
  rightContent,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl text-blue-600">{logo || "ShadowChat"}</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => onItemClick?.(item.href)}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-colors relative
                  ${activeItem === item.href ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"}
                `}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex items-center gap-4">
            {rightContent}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {items.map((item) => (
                  <motion.button
                    key={item.href}
                    onClick={() => {
                      onItemClick?.(item.href);
                      setMobileOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg font-medium transition-colors
                      ${activeItem === item.href ? "text-blue-600 bg-blue-50" : "text-gray-700"}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

/**
 * PREMIUM TOAST - Notifications
 */
export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}

export const PremiumToast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
}) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const colors = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg border ${colors[type]} shadow-lg`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * PREMIUM SKELETON - Loading placeholder
 */
export const PremiumSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 1,
  className = "",
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`bg-gray-200 rounded-lg h-12 ${className}`}
        />
      ))}
    </>
  );
};

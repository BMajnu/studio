"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleFooterProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleFooter = ({
  isCollapsed,
  toggleCollapse,
  children,
  className,
}: CollapsibleFooterProps) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCollapse}
        className={cn(
          "absolute right-4 hover:bg-primary/10 rounded-full transition-all duration-300 shadow-sm z-20",
          isCollapsed ? "-top-8" : "-top-3"
        )}
        aria-label={isCollapsed ? "Expand footer" : "Collapse footer"}
      >
        {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="footer-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleFooter; 
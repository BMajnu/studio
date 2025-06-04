"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleHeaderProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleHeader = ({
  isCollapsed,
  toggleCollapse,
  children,
  className,
}: CollapsibleHeaderProps) => {
  return (
    <div className={cn("relative w-full", className)}>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="header-content"
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
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCollapse}
        className={cn(
          "absolute right-4 hover:bg-primary/10 rounded-full transition-all duration-300 shadow-sm z-20",
          isCollapsed ? "-bottom-8" : "-bottom-3"
        )}
        aria-label={isCollapsed ? "Expand header" : "Collapse header"}
      >
        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </Button>
    </div>
  );
};

export default CollapsibleHeader; 
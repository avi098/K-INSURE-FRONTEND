// @/components/ui/tabs.js

import React from "react";

export const Tabs = ({ children, className, ...props }) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {children}
  </div>
);

export const TabsList = ({ children, ...props }) => (
  <div className="flex space-x-2 border-b" {...props}>
    {children}
  </div>
);

export const TabsTrigger = ({ children, value, ...props }) => (
  <button
    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
    {...props}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, value, ...props }) => (
  <div {...props}>{children}</div>
);

"use client";

import { StyleProvider, createCache } from "@ant-design/cssinjs";
import React from "react";

export const AntdRegistry = ({ children }: { children: React.ReactNode }) => {
  const cache = React.useMemo(() => createCache(), []);

  return (
    <StyleProvider cache={cache} hashPriority="high" ssrInline={true}>
      {children}
    </StyleProvider>
  );
};

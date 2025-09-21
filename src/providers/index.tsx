"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ReactNode, useEffect, useState } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Force update CSS variables on the body
    const body = document.body;
    if (isDark) {
      body.style.setProperty("--ant-color-bg-base", "#141414");
      body.style.setProperty("--ant-color-text", "#ffffff");
      body.style.setProperty("--ant-color-bg-container", "#1f1f1f");
      body.style.setProperty("--ant-color-border", "#424242");
    } else {
      body.style.setProperty("--ant-color-bg-base", "#ffffff");
      body.style.setProperty("--ant-color-text", "#000000");
      body.style.setProperty("--ant-color-bg-container", "#ffffff");
      body.style.setProperty("--ant-color-border", "#d9d9d9");
    }
  }, [isDark]);

  const handleThemeChange = () => {
    setIsDark((d: boolean) => !d);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            borderRadius: 12,
            // Add some custom tokens to ensure variables are generated
            colorBgBase: isDark ? "#141414" : "#ffffff",
            colorTextBase: isDark ? "#ffffff" : "#000000",
            colorBgContainer: isDark ? "#1f1f1f" : "#ffffff",
            colorBorder: isDark ? "#424242" : "#d9d9d9",
          },
          cssVar: true, // Enable CSS variables
        }}
      >
        <div style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }} onClick={handleThemeChange}>
          <div>{isDark ? "☀️" : "🌙"}</div>
        </div>
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
}

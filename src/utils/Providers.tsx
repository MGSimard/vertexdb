"use client";
import { ReactNode, useState } from "react";
import { QueryClientProvider, Query } from "@tanstack/react-query";

export function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
}

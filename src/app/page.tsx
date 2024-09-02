"use client";
import { Searchbar } from "@/components/searchbar/Searchbar";
import { toast } from "sonner";
import { CustomToast } from "@/components/layout/CustomToast";

export default function Page() {
  return (
    <main className="index-main">
      <Searchbar />
      <h2 className="notice">THIS APP IS IN ACTIVE DEVELOPMENT MODE.</h2>
      <button type="button" onClick={() => toast.error("Jeff")}>
        EEEEEEEA SPORTS
      </button>
      <button type="button" onClick={() => toast.custom((t) => <CustomToast />)}>
        EEEEEEEA SPORTS
      </button>
    </main>
  );
}

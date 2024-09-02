"use client";
import { Searchbar } from "@/components/searchbar/Searchbar";
import { toast } from "sonner";
import { CustomToast } from "@/components/layout/CustomToast";

export default function Page() {
  return (
    <main className="index-main">
      <Searchbar />
      <h2 className="notice">THIS APP IS IN ACTIVE DEVELOPMENT MODE.</h2>
      <button
        type="button"
        onClick={() =>
          toast.custom(
            (t) => (
              <CustomToast
                icon="warning"
                message="DATABASE ERROR: Could not retrieve current vote or submission score."
              />
            ),
            { duration: Infinity }
          )
        }>
        TEST ERROR
      </button>
      <button
        type="button"
        onClick={() =>
          toast.custom((t) => <CustomToast icon="success" message="SUCCESS: Vote successfully modified." />, {
            duration: Infinity,
          })
        }>
        TEST SUCCESS
      </button>
    </main>
  );
}

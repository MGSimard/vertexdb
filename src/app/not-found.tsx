import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VERTEXDB - NOT FOUND",
};

export default function NotFound() {
  return (
    <main className="not-found">
      <h2>404</h2>
      <h1>NOT FOUND.</h1>
      <Link href="/">
        <button className="btn-ui" type="button">
          RETURN HOME
        </button>
      </Link>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  console.log(process.env.POSTGRES_URL);
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

"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Searchbar } from "@/components/searchbar/Searchbar";
import { Tech, Chip, Add } from "@/components/icons";

export function Navbar() {
  const pathname = usePathname();

  let navh1;
  switch (pathname) {
    case "/":
      navh1 = "CORE";
      break;
    case "/dashboard":
      navh1 = "DASHBOARD";
      break;
    case "/game/add":
      navh1 = "ADD GAME";
    default:
      break;
  }

  return (
    <nav className="noselect">
      <div className="nav-ele nav-ele-left">
        <Link href="/" className="nav-logo">
          VERTEX<span>DB</span>
        </Link>
      </div>

      {navh1 ? (
        <div className="nav-ele">
          <div className="ne-iconbox">
            {navh1 === "CORE" && <Tech />}
            {navh1 === "DASHBOARD" && <Chip />}
            {navh1 === "ADD GAME" && <Add />}
          </div>
          <h1>{navh1}</h1>
        </div>
      ) : (
        <div className="nav-ele nav-ele-search">
          <Searchbar />
        </div>
      )}
      <div className="nav-ele nav-ele-right">
        <div>
          <button className="btn-ui nav-account"></button>
        </div>
      </div>
    </nav>
  );
}

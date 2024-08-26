import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import "@/styles/dashboard.css";
import { CardLarge } from "@/components/page_dashboard/CardLarge";

export default function Page() {
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    notFound();
  }

  return (
    <main>
      <section className="grid-3x">
        <CardLarge title="SOMETHING">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ante mauris, lacinia non tempor ut,
            tincidunt in urna. In erat risus, ultricies sed ullamcorper vitae, ultrices quis justo. Cras faucibus
            facilisis sem, at sodales tortor. Suspendisse potenti. Interdum et malesuada fames ac ante ipsum primis in
            faucibus.
          </p>
        </CardLarge>
        <CardLarge title="SOMETHING ELSE">
          <p>
            Phasellus non eleifend massa. Integer tristique dignissim aliquet. Cras dapibus porta neque. Aenean a risus
            a ipsum accumsan commodo. Ut posuere urna sed sapien ornare, vitae eleifend tortor dictum. Ut pellentesque
            risus at efficitur varius. Praesent at imperdiet eros. Suspendisse faucibus, urna sed sollicitudin
            hendrerit, nibh diam condimentum neque, sed consequat quam quam ac erat.
          </p>
        </CardLarge>
        <CardLarge title="THINKS HE'S PART OF THE TEAM">
          <p>
            The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as
            it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed
            starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be
            completed each time you hear this sound. [ding]
          </p>
        </CardLarge>
      </section>
      <section>
        <CardLarge title="REPORT BOARD">
          <p>
            The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as
            it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed
            starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be
            completed each time you hear this sound. [ding]
          </p>
        </CardLarge>
      </section>
    </main>
  );
}

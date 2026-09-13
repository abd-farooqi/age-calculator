import AgeCalculator from "@/components/age-calculator";
import ParticleBackground from "@/components/particle-background";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <AgeCalculator />
        <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-2xl font-bold">Agewise FAQ</h2>
          <div className="space-y-4 text-muted-foreground">
            <details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold text-foreground">How is age calculated?</summary><p className="mt-3">Agewise compares your birth date with the current date and accounts for leap years and different month lengths.</p></details>
            <details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold text-foreground">Does Agewise store my birth date?</summary><p className="mt-3">No. The browser calculates your result locally. The API returns a result for the request but does not require an account.</p></details>
            <details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold text-foreground">What are planetary ages?</summary><p className="mt-3">They are mathematical conversions based on each world’s orbital period. They are not predictions about lifespan or health.</p></details>
          </div>
        </section>
      </div>
    </div>
  );
}

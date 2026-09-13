import AgeCalculator from "@/components/age-calculator";
import ParticleBackground from "@/components/particle-background";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <AgeCalculator />
        <section className="relative z-10 mx-auto mb-12 max-w-4xl px-4" aria-labelledby="discord-heading">
          <div className="glass-card rounded-xl p-6 sm:p-8">
            <div className="eyebrow mb-3">AGEWISE FOR DISCORD / 02</div>
            <h2 id="discord-heading" className="text-2xl sm:text-3xl font-bold">Bring Agewise to your server</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Calculate exact ages directly in Discord with a fast, privacy-friendly slash command.</p>
            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a className="action-button action-primary inline-flex" href="https://discord.com/oauth2/authorize?client_id=1548786562701992216&amp;permissions=3072&amp;scope=bot%20applications.commands" target="_blank" rel="noreferrer">Add Agewise to Discord</a>
              <code className="rounded bg-black/40 px-3 py-2 text-sm text-muted-foreground">/age date:DD-MM-YYYY</code>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">No account required. Your bot token stays private, and the calculator API is documented publicly.</p>
          </div>
        </section>
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

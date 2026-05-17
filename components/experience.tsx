import { PixelFaceCard } from "@/components/PixelFace"
export function Experience() {
  return (
    <section id="experience" className="py-24 px-6" text-align="justify">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Experience & Education
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-6 max-w-2xl mx-auto">
          My professional journey and academic background.
        </p>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
            <span className="text-xs text-muted-foreground">Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink" />
            <span className="text-xs text-muted-foreground">Education</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow" />
            <span className="text-xs text-muted-foreground">Achievement</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-auto">

          {/* HERO CARD — Lead Dev */}
          <div className="md:col-span-4 p-6 rounded-2xl border border-cyan/30 bg-card/50 hover:border-cyan/60 transition-colors duration-200 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-1">
                Lead Developer & Project Coordinator
              </h3>
              <p className="text-cyan text-sm mb-3">Arcana Learning Platform</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Building a full-stack LMS with React/Vite and Frappe as headless backend. Handling API integration, intern onboarding, architecture decisions, and deployment on a Linux VPS.
              </p>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex flex-wrap gap-2">
                {["React", "Vite", "Frappe", "Linux VPS", "REST API"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/20">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">2026 – Present</span>
            </div>
          </div>

          {/* Instructional Designer */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-cyan/20 bg-card/50 hover:border-cyan/40 transition-colors duration-200 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                Instructional Designer
              </h3>
              <p className="text-cyan text-sm">The Allicock Group</p>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2026 – Present</span>
          </div>

          {/* BS Math CS */}
          <div className="md:col-span-3 p-6 rounded-2xl border border-pink/20 bg-card/50 hover:border-pink/40 transition-colors duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                BS Mathematics & Computer Science
              </h3>
              <p className="text-pink text-sm mb-3">Bulacan State University</p>
              <div className="flex flex-wrap gap-2">
                {["Class Mayor", "Dean's Lister", "DOST Scholar", "Civil Service Passer"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-pink/10 text-pink border border-pink/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2022 – 2026</span>
          </div>

          {/* Freelance Full Stack */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-cyan/20 bg-card/50 hover:border-cyan/40 transition-colors duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                Freelance Full Stack Web Developer
              </h3>
              <p className="text-cyan text-sm">Self-employed</p>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2025 – Present</span>
          </div>

          {/* Thesis Nomination */}
          <div className="md:col-span-1 p-6 rounded-2xl border border-yellow/30 bg-yellow/5 hover:border-yellow/60 transition-colors duration-200 flex flex-col justify-between">
            <span className="text-yellow text-lg">★</span>
            <div>
              <p className="text-xs font-semibold text-yellow uppercase tracking-widest mb-1">Thesis Nomination</p>
              <p className="text-xs text-muted-foreground">Best Programmed Thesis 2026 · Dottica.art</p>
            </div>
          </div>

          {/* Logistics Committee Head */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-cyan/20 bg-card/50 hover:border-cyan/40 transition-colors duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                Logistics Committee Head
              </h3>
              <p className="text-cyan text-sm">Mathematics Society, BulSU</p>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2024 – 2025</span>
          </div>

          {/* Secretary / President */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-cyan/20 bg-card/50 hover:border-cyan/40 transition-colors duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                Secretary / President
              </h3>
              <p className="text-cyan text-sm">BulSU CSBand</p>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2024 – 2025</span>
          </div>
          
          {/* Freelance Video Editor */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-cyan/20 bg-card/50 hover:border-cyan/40 transition-colors duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                Freelance Video Editor
              </h3>
              <p className="text-cyan text-sm">Self-employed</p>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2024 – 2025</span>
          </div>

          {/* Multimedia Committee */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-cyan/20 bg-card/50 hover:border-cyan/40 transition-colors duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                Multimedia Committee Head Apprentice
              </h3>
              <p className="text-cyan text-sm">Mathematics Society, BulSU</p>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2022 – 2023</span>
          </div>
          
          {/* Lab High School */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-pink/20 bg-card/50 hover:border-pink/40 transition-colors duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground mb-1">
                Laboratory High School
              </h3>
              <p className="text-pink text-sm mb-1">Bulacan State University</p>
              <p className="text-xs text-muted-foreground">With Honours</p>
            </div>
            <span className="text-xs text-muted-foreground mt-4">2016 – 2022</span>
          </div>

          <PixelFaceCard />

        </div>
      </div>
    </section>
  )
}
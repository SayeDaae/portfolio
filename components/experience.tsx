const experiences = [
  {
    title: "Instructional Designer",
    company: "The Allicock Group",
    period: "2026 - Present",
  },
  {
    title: "Freelance Full Stack Web Developer",
    company: "Self-employed",
    period: "2025 - Present",
  },
  {
    title: "Freelance Video Editor",
    company: "Self-employed",
    period: "2024 - 2025",
  },
  {
    title: "Logistics Committee Head",
    company: "Mathematics Society, BulSU",
    period: "2024 - 2025",
  },
  {
    title: "Multimedia Committee Head Apprentice",
    company: "Mathematics Society, BulSU",
    period: "2022 - 2023",
  },
  {
    title: "Secretary / President",
    company: "BulSU CSBand",
    period: "2024 - 2025",
  },
]

const education = [
  {
    title: "BS Mathematics & Computer Science",
    company: "Bulacan State University",
    period: "2022 - 2026",
    note: "Class Mayor · Dean's Lister · DOST Scholar · Civil Service Passer",
  },
  {
    title: "Laboratory High School",
    company: "Bulacan State University",
    period: "2016 - 2022",
    note: "With Honours",
  },
]

export function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Experience & Education
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-16 max-w-2xl mx-auto">
          My professional journey and academic background.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Experience Column */}
          <div>
            <h3 className="font-[family-name:var(--font-syne)] text-sm font-bold tracking-widest uppercase text-cyan mb-6">
              Experience
            </h3>
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-cyan/20" />
              <div className="flex flex-col gap-4">
                {experiences.map((item) => (
                  <div key={item.title} className="relative pl-8">
                    <div className="absolute left-0 top-3 w-4 h-4 rounded-full border-2 border-cyan bg-background" />
                    <div className="p-4 rounded-lg border border-border bg-card/50 hover:border-cyan/30 transition-colors duration-200">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className="font-[family-name:var(--font-syne)] text-sm font-bold text-foreground">
                          {item.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{item.period}</span>
                      </div>
                      <p className="text-xs text-cyan">{item.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education Column */}
          <div>
            <h3 className="font-[family-name:var(--font-syne)] text-sm font-bold tracking-widest uppercase text-pink mb-6">
              Education
            </h3>
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-pink/20" />
              <div className="flex flex-col gap-4">
                {education.map((item) => (
                  <div key={item.title} className="relative pl-8">
                    <div className="absolute left-0 top-3 w-4 h-4 rounded-full border-2 border-pink bg-background" />
                    <div className="p-4 rounded-lg border border-border bg-card/50 hover:border-pink/30 transition-colors duration-200">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className="font-[family-name:var(--font-syne)] text-sm font-bold text-foreground">
                          {item.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{item.period}</span>
                      </div>
                      <p className="text-xs text-pink mb-2">{item.company}</p>
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
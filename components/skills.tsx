"use client"

const skillGroups = [
  {
    category: "Frontend Engineering",
    color: "cyan",
    skills: ["React", "JavaScript", "TypeScript", "Vite", "Next.js", "HTML/CSS", "Tailwind CSS"],
  },
  {
    category: "UX & Learning Experience",
    color: "pink",
    skills: ["UI/UX Architecture", "Information Structuring", "Figma", "Articulate Rise 360", "Visual Communication"],
  },
  {
    category: "Backend & Infrastructure",
    color: "cyan", // Consistent color for 'Engineering'
    skills: ["Python", "C#", "C/C++", "MySQL", "REST APIs", "Docker", "Linux VPS", "Git/GitHub"],
  },
  {
    category: "Applied Logic & Systems",
    color: "yellow",
    skills: ["Mathematical Modeling", "Algorithm Design", "Data Structures", "Numerical Analysis", "System Architecture"],
  },
  {
    category: "Leadership & Execution",
    color: "pink", // Consistent color for 'Strategy/Human'
    skills: ["Project Coordination", "Technical Onboarding", "Cross-functional Leadership", "Problem Solving", "Adaptability"],
  },
]

const colorMap: Record<string, string> = {
  cyan: "border-cyan/20 text-cyan bg-cyan/5 hover:bg-cyan/10",
  pink: "border-pink/20 text-pink bg-pink/5 hover:bg-pink/10",
  yellow: "border-yellow/20 text-yellow bg-yellow/5 hover:bg-yellow/10",
}

const headerColorMap: Record<string, string> = {
  cyan: "text-cyan",
  pink: "text-pink",
  yellow: "text-yellow",
}

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Skills & Technologies
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-16 max-w-2xl mx-auto">
          The technical stack and strategic workflows I use to build scalable logic and intuitive interfaces.
        </p>

        {/* Responsive grid: 1 col on mobile, 2 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {skillGroups.map((group) => (
            <div key={group.category} className="flex flex-col gap-4">
              <h3 className={`font-[family-name:var(--font-syne)] text-sm font-800 tracking-widest uppercase opacity-80 ${headerColorMap[group.color]}`}>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-300 ${colorMap[group.color]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
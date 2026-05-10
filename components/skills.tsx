const skillGroups = [
  {
    category: "Frontend & Web",
    color: "cyan",
    skills: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Vite", "Next.js", "UI/UX Design", "Responsive Design"],
  },
  {
    category: "Languages & Frameworks",
    color: "purple",
    skills: ["C/C++", "C#", "Python", "MySQL", "Git/GitHub", "Unity"],
  },
  {
    category: "Design & Authoring",
    color: "pink",
    skills: ["Figma", "Articulate Rise 360", "Multimedia Editing", "Microsoft PowerPoint", "Visual Design"],
  },
  {
    category: "Instructional Design",
    color: "yellow",
    skills: ["Content Development", "Content Structuring", "Learning Experience Design", "Visual Communication", "Storytelling", "Project Coordination"],
  },
  {
    category: "Soft Skills",
    color: "cyan",
    skills: ["Problem Solving", "Leadership", "Adaptability", "Teamwork", "Attention to Detail"],
  },
]

const colorMap: Record<string, string> = {
  cyan: "border-cyan/20 text-cyan bg-cyan/5 hover:bg-cyan/10",
  purple: "border-purple/20 text-purple bg-purple/5 hover:bg-purple/10",
  pink: "border-pink/20 text-pink bg-pink/5 hover:bg-pink/10",
  yellow: "border-yellow/20 text-yellow bg-yellow/5 hover:bg-yellow/10",
}

const headerColorMap: Record<string, string> = {
  cyan: "text-cyan",
  purple: "text-purple",
  pink: "text-pink",
  yellow: "text-yellow",
}

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Skills & Tools
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-16 max-w-2xl mx-auto">
          Technologies and tools I use to bring ideas to life.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skillGroups.map((group) => (
            <div key={group.category} className="flex flex-col gap-4">
              <h3 className={`font-[family-name:var(--font-syne)] text-sm font-800 tracking-widest uppercase ${headerColorMap[group.color]}`}>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors duration-200 ${colorMap[group.color]}`}
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
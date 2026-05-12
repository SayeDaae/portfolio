"use client"

import { useReveal } from "@/hooks/useReveal"

const projects = [
  {
    name: "Dottica.art",
    description: "A pixel art image processing web app that transforms your images into stunning pixel art creations.",
    stack: ["React", "Vite", "Tailwind CSS"],
    liveUrl: "https://dottica.art",
  },
  {
    name: "Arcana-learning.com",
    description: "A learning platform landing site designed to showcase educational tools and resources.",
    stack: ["HTML5", "CSS", "JavaScript"],
    liveUrl: "https://arcana-learning.com",
  },
]

export function Projects() {
  const { ref, revealed } = useReveal()

  return (
    <section id="work" className="py-24 px-6">
      <div
        ref={ref}
        className={`reveal ${revealed ? "revealed" : ""} mx-auto max-w-6xl`}
      >
        <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Featured Work
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-16 max-w-2xl mx-auto">
          A selection of projects I&apos;ve built and contributed to.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.name}
              className="group relative bg-card rounded-2xl border border-border p-8 hover:border-cyan/50 transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-3 group-hover:text-cyan transition-colors">
                  {project.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan text-background font-medium text-sm hover:bg-cyan/90 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  Live Site
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
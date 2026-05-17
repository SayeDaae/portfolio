"use client"

import { useReveal } from "@/hooks/useReveal"

const projects = [
  {
    name: "Dottica.art",
    description: "A mathematical image processing engine that applies complex algorithms to convert and stylize images. Nominated for Best Programmed Thesis 2025.",
    stack: ["React", "Math Algorithms", "Vite", "Tailwind CSS"],
    status: "Live",
    liveUrl: "https://dottica.art",
    repoUrl: "",
  },
  {
    name: "Arcana Marketing",
    description: "The production marketing site for Arcana, featuring custom domain configuration and optimized deployment workflows.",
    stack: ["HTML5", "CSS", "JavaScript", "Netlify"],
    status: "Live",
    liveUrl: "https://arcana-learning.com",
    repoUrl: "",
  },
  {
    name: "Interactive UI Sandbox",
    description: "A passion project focused on advanced state management, complex routing, and custom web carousels for modern web applications.",
    stack: ["React", "TypeScript", "Tailwind CSS", "State Management"],
    status: "Live",
    liveUrl: "/lab",
    repoUrl: "#", 
  },
  {
    name: "Arcana LMS Platform",
    description: "A full-stack learning management system featuring API-driven auth and automated enrollment. Built with a headless backend and iframe-based content delivery.",
    stack: ["React", "Vite", "Frappe", "REST API", "Linux VPS"],
    status: "In Development",
    liveUrl: "",
    repoUrl: "#", 
    highlight: "Leading architecture & intern onboarding",
  },
]

export function Projects() {
  const { ref, revealed } = useReveal()

  return (
    <section id="work" className="py-24 px-6 relative">
      <div
        ref={ref}
        className={`reveal ${revealed ? "revealed" : ""} mx-auto max-w-6xl relative z-10`}
      >
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Work
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of production builds, system architecture, and technical experiments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.name}
              className="group relative bg-card rounded-2xl border border-border p-8 hover:border-cyan/50 transition-all duration-300 flex flex-col h-full"
            >
              {/* Status Badge */}
              <div className="absolute top-8 right-8">
                <span
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${
                    project.status === "Live"
                      ? "bg-cyan/10 text-cyan border-cyan/20"
                      : "bg-purple/10 text-purple border-purple/20"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mb-6 flex-grow">
                <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground mb-3 group-hover:text-cyan transition-colors pr-20">
                  {project.name}
                </h3>
                {project.highlight && (
                  <p className="text-sm text-pink font-medium mb-3">
                    {project.highlight}
                  </p>
                )}
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-auto">
                {project.status === "Live" ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan text-background font-medium text-sm hover:bg-cyan/90 transition-all hover:scale-105"
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
                    View Live Site
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground/60 font-medium text-sm cursor-default">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
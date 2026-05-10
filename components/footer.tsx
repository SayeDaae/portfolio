export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <p className="font-[family-name:var(--font-syne)] text-lg font-bold text-cyan">MJ</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Web Developer & Instructional Designer based in the Philippines.
              Open to remote work worldwide.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2 md:text-right md:items-end">
            <p className="font-[family-name:var(--font-syne)] text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">Get in Touch</p>
            <a
              href="mailto:mark.joseph.santos101@gmail.com"
              className="text-sm text-foreground hover:text-cyan transition-colors"
            >
              mark.joseph.santos101@gmail.com
            </a>
            <a
              href="https://github.com/SayeDaae"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground hover:text-cyan transition-colors"
            >
              github.com/SayeDaae
            </a>
            <a
              href="https://www.linkedin.com/in/jesu-santos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground hover:text-cyan transition-colors"
            >
              linkedin.com/in/jesu-santos
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Mark Joseph Santos. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Built with Next.js & React
          </p>
        </div>
      </div>
    </footer>
  )
}
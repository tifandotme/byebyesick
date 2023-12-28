import { siteConfig } from "@/config"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <section className="container flex items-center justify-between pb-8 pt-6 md:py-8">
        <div className="flex flex-wrap gap-2 text-sm">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span className="select-none text-xs text-muted-foreground">
            &bull;
          </span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span className="select-none text-xs text-muted-foreground">
            &bull;
          </span>
          <span className="text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </div>
      </section>
    </footer>
  )
}

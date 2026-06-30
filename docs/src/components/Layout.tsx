import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Navbar } from './Navbar'
import { Sidebar, DesktopSidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'
import { Footer } from './Footer'

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-dvh bg-background">
      <div className="relative z-10">
        <Navbar />

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* mobile topbar trigger */}
        <div className="sticky top-0 z-30 flex h-12 items-center border-b border-white/[0.08] bg-background/80 px-4 backdrop-blur-md lg:hidden" style={{ marginTop: 80 }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <Menu size={16} />
          </button>
          <span className="ml-2 text-[12px] text-muted-foreground/50">Menu</span>
        </div>

        {/* content area */}
        <div className="mx-auto max-w-[1100px] px-6 pt-24 lg:px-10 lg:pt-28">
          <div className="flex gap-12">
            <DesktopSidebar />

            <div className="min-w-0 flex-1 pb-16">
              <div className="lg:grid lg:grid-cols-[1fr_160px] lg:gap-10 xl:grid-cols-[1fr_170px]">
                <main id="doc-content" className="min-w-0" key={pathname}>
                  {children}
                </main>
                <TableOfContents />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

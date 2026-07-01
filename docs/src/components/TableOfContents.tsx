import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')
  const { pathname } = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      const content = document.getElementById('doc-content')
      if (!content) return

      const headings = content.querySelectorAll('h2[id], h3[id]')
      const tocItems: TocItem[] = []
      headings.forEach((h) => {
        tocItems.push({
          id: h.id,
          text: h.textContent || '',
          level: h.tagName === 'H2' ? 2 : 3,
        })
      })
      setItems(tocItems)
      if (tocItems.length > 0) setActiveId(tocItems[0].id)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0.1 }
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="hidden lg:block">
      <div className="sticky top-[100px]">
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
          On this page
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active = activeId === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                    setActiveId(item.id)
                  }}
                  className={`block py-1 text-[11px] font-bold leading-relaxed transition-all duration-150 ${
                    item.level === 3 ? 'pl-3' : ''
                  } ${
                    active
                      ? 'text-white'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {item.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

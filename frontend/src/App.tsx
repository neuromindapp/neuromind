import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Landing from './pages/Landing'
import Edges from './pages/Edges'
import TrackRecord from './pages/TrackRecord'
import Account from './pages/Account'
import Report from './pages/Report'

export function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={isLanding ? '' : 'app-page min-h-screen'}>
        <div className={isLanding ? '' : 'flex min-h-[60vh] flex-col'}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/edges" element={<Edges />} />
            <Route path="/track-record" element={<TrackRecord />} />
            <Route path="/account" element={<Account />} />
            <Route path="/report/:id" element={<Report />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  )
}

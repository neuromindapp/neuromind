import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DocPage, docs } from './pages/DocPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        {docs.map((doc) => (
          <Route key={doc.path} path={doc.path} element={<DocPage doc={doc} />} />
        ))}
      </Routes>
    </Layout>
  )
}

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Studio from './components/Studio'
import Services from './components/Services'
import Work from './components/Work'
import Philosophy from './components/Philosophy'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import QuoteWizard from './pages/QuoteWizard'
import QuoteResult from './pages/QuoteResult'
import Admin from './pages/Admin'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div id="top">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Studio />
              <Services />
              <Work />
              <Philosophy />
              <ContactForm />
              <Footer />
            </>
          }
        />
        <Route path="/get-a-quote" element={<QuoteWizard />} />
        <Route path="/quote-result" element={<QuoteResult />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App

import { useState } from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Navbar,Hero,About,Experience,Works,Tech,Contact} from './components'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-black min-h-screen">
        {/* Subtle background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#64ffda]/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#915EFF]/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Navbar/>
          <Hero/>
        </div>
        
        <div className="relative z-10">
          <About/>
          <Experience/>
          <Tech/>
          <Works/>
          <Contact/>
        </div>
        
      </div>
    </BrowserRouter>
  )
}

export default App

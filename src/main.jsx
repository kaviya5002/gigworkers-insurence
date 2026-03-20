import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/darkmode.css'
import App from './App.jsx'
import { DarkModeProvider } from './context/DarkModeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>,
)

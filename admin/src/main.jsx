import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toastdev, ToastdevProvider } from '@azadev/react-toastdev'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastdevProvider>
        <Toastdev />
        <App />
      </ToastdevProvider>
    </BrowserRouter>
  </StrictMode>,
)

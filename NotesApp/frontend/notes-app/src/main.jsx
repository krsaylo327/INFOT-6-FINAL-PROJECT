import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Modal from 'react-modal'; 

// Set the root element for accessibility with react-modal
Modal.setAppElement('#root'); // Prevents screen readers from reading content outside the modal

// Render the main React application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

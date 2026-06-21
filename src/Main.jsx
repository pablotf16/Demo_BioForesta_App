import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const { StrictMode } = React
const { createRoot } = ReactDOM

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
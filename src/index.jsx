import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/normalize.css'
import './styles/globals.css'
import { createFastContext } from './utils/fastContext'

const Provider = createFastContext({
  currentProduct: null,
  products: [],
  loading: true,
  modalContent: null,
})

createRoot(document.getElementById('root')).render(
  <Provider>
    <App />
  </Provider>
)

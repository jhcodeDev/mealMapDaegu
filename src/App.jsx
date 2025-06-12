import { useState } from 'react'
import './App.css'
import AppRouter from '././routes/AppRouter'

const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;
function App() {

  return (
    <div>
      <AppRouter></AppRouter>
    </div>
  );

}

export default App;


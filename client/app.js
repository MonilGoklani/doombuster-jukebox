import React from 'react'

import Navbar from './components/navbar'
import Routes from './routes'



const App = () => {
  return (
      <div>
        <Navbar history={history} />
        <Routes history={history}/>
      </div>
  )
}

export default App

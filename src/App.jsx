
import './App.css'
import '@fontsource/roboto';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './layout/Navbar';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import AddUser from './users/AddUser';
function App() {

  return (
    <>
        <div className="App">
        <Router>
            <Navbar/>
            <Routes>
                <Route exact path='/' element={<Home/>}></Route>
                <Route exact path='/adduser' element={<AddUser/>}></Route>
            </Routes>
        </Router>
        </div>
    </>
  )
}

export default App

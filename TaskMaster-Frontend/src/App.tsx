
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { Home } from './pages/Home/Home';
import './App.scss';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<PrivateRoute component={Home} />} />
      </Routes>
    </Router>
  )
}

export default App

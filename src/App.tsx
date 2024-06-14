
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.scss';
import { Main } from './pages/Main/Main';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <PrivateRoute path="/" component={Main} />
      </Routes>
    </Router>
  )
}

export default App

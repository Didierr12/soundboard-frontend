import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Review from './pages/Review';
import Profile from './pages/Profile';
import Recomendaciones from './pages/Recomendaciones';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/review" element={<Review />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recomendaciones" element={<Recomendaciones />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
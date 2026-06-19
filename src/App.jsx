import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import GameDetail from './pages/GameDetail';
import Wishlist from './pages/Wishlist';
import AdminGames from './pages/admin/AdminGames';
import AdminGenres from './pages/admin/AdminGenres';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/games" element={<AdminGames />} />
            <Route path="/admin/genres" element={<AdminGenres />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

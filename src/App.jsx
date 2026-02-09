import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Analytics from './pages/Analytics';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <TransactionProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>

          {/* PWA Install Prompt */}
          <InstallPrompt />
        </div>
      </TransactionProvider>
    </Router>
  );
}

export default App;

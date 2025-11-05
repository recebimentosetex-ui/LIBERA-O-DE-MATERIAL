import React, { useState } from 'react';
import { ReleasesPage } from './components/ReleasesPage';
import { FiberStockPage } from './components/FiberStockPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('releases');

  return (
    <div className="min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('releases')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'releases' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Liberação de Material
              </button>
              <button
                onClick={() => setCurrentPage('fibers')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'fibers' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Estoque de Fibras
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main>
        {currentPage === 'releases' && <ReleasesPage />}
        {currentPage === 'fibers' && <FiberStockPage />}
      </main>
    </div>
  );
};

export default App;

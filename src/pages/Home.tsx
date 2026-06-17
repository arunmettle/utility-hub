import { Link } from 'react-router-dom';
import { tools } from '../utils/toolsData';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Developer Utility Hub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          A collection of powerful, free online tools for developers. All processing happens in your browser.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Icon size={24} className="text-white" />
                </div>
                <ArrowRight 
                  size={20} 
                  className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" 
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                  {tool.category}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Privacy First
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All processing happens locally in your browser. Your data never leaves your device.
          </p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Lightning Fast
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Instant results with real-time processing. No waiting, no server delays.
          </p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Beautiful UI
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Clean, modern interface with dark mode support for comfortable use.
          </p>
        </div>
      </div>
    </div>
  );
}

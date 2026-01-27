import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-xs">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button icon={<Home className="w-5 h-5"/>} className="w-auto px-8">
            Go Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, Waves, Calendar, BarChart2, ShieldCheck } from 'lucide-react';
import { AlertWidget } from '@/components/AlertWidget';
import { Header } from '@/components/Header';
import { WeatherForecast } from '@/components/WeatherForecast';

export const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Safe Sailing Weather Alerts
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about weather conditions that may affect your boating trips
            </p>
          </div>
          
          <AlertWidget standalone={true} />
          
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Waves className="h-6 w-6 text-blue-500" />
                Marine Weather Forecast
              </h2>
              <WeatherForecast />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <Calendar className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tour Schedule</h3>
              <p className="text-gray-600 mb-4">
                View our upcoming boat tours and check for any weather-related cancellations
              </p>
              <Link to="/tours" className="mt-auto">
                <Button variant="outline" className="w-full">View Schedule</Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Weather Alerts</h3>
              <p className="text-gray-600 mb-4">
                Subscribe to receive notifications about weather-related tour cancellations
              </p>
              <Link to="/alerts" className="mt-auto">
                <Button variant="outline" className="w-full">Subscribe</Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <ShieldCheck className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safety Information</h3>
              <p className="text-gray-600 mb-4">
                Learn about our safety protocols and what to expect on your boat tour
              </p>
              <Link to="/safety" className="mt-auto">
                <Button variant="outline" className="w-full">Read More</Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/admin">
              <Button variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700">
                <BarChart2 className="w-5 h-5 mr-2" />
                Manage Weather Alerts
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Safe Sailing Tours</h3>
              <p className="text-gray-400">Weather monitoring and alerts for boat tours</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/admin" className="hover:text-blue-400">Admin</Link>
              <Link to="/privacy" className="hover:text-blue-400">Privacy</Link>
              <Link to="/terms" className="hover:text-blue-400">Terms</Link>
              <Link to="/contact" className="hover:text-blue-400">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Safe Sailing Tours. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

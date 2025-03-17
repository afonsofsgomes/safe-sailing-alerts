
import { AlertWidget } from "@/components/AlertWidget";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sailboat, CloudSun, AlertTriangle, Code } from "lucide-react";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-24 sm:pt-32 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white" />
            
            <div className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full bg-sea-100 blur-3xl opacity-20" />
            <div className="absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full bg-sea-200 blur-3xl opacity-20" />
          </div>
          
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-sm animate-float">
                <Sailboat className="h-12 w-12 text-sea-500" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl animate-slide-up">
              Keep Your Customers Informed
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 animate-slide-up">
              Easily manage and display weather-related disruptions to your boat tours with our simple alert system.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-slide-up">
              <Button asChild size="lg" className="bg-sea-500 hover:bg-sea-600">
                <Link to="/admin">
                  Manage Alerts
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/embed">
                  Embed Widget
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Alert Widget Preview */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <AlertWidget standalone={true} />
          </div>
        </section>
        
        {/* Features */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Simple, Effective Weather Alerts
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Keep your customers informed about weather-related disruptions to your sailing schedule.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<CloudSun className="h-10 w-10 text-sea-500" />}
                title="Weather Disruptions"
                description="Easily mark days or time periods when your boat tours won't be operating due to weather conditions."
              />
              <FeatureCard 
                icon={<AlertTriangle className="h-10 w-10 text-amber-500" />}
                title="Clear Alerts"
                description="Display beautiful, attention-grabbing alerts on your website to keep customers informed."
              />
              <FeatureCard 
                icon={<Code className="h-10 w-10 text-gray-700" />}
                title="Simple Integration"
                description="Add the widget to any website with a simple embed code. No technical knowledge required."
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sailboat className="h-5 w-5 text-sea-500" />
            <span className="font-medium">SafeSailing.io</span>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} SafeSailing.io. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <div className="bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/SimpleAuth';
import ScorecardCalculator from './components/ScorecardCalculator';
import MobileEnhancedCalculator from './components/MobileEnhancedCalculator';
import { Toaster } from "@/components/ui/sonner";
import { Settings } from 'lucide-react';
function App() {
  console.log('App component loaded - Current timestamp:', new Date().toISOString());
  console.log('No getEvents or loadEvents functions should exist in this component');
  return <AuthProvider>
      <Router>
        <div className="min-h-screen nature-gradient natural-texture">
          <Routes>
            {/* Main Assessment Route - Public */}
            <Route path="/" element={<div className="min-h-screen flex flex-col">
                <div className="flex-1">
                  <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="text-center mb-12">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-3 rounded-organic bg-primary/10 border-2 border-primary/20">
                          <Settings className="w-8 h-8 text-primary animate-gentle-float" />
                        </div>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        Business Systems Assessment
                      </h1>
                      <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-secondary mx-auto rounded-full mb-6"></div>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Discover how your business systems can grow more naturally. 
                        Get personalized insights to cultivate operational harmony and sustainable growth.
                      </p>
                    </div>
                    {/* Use mobile-enhanced version for better touch experience */}
                    <div className="block sm:hidden">
                      <MobileEnhancedCalculator />
                    </div>
                    <div className="hidden sm:block">
                      <ScorecardCalculator />
                    </div>
                  </div>
                </div>
                
                {/* Organic Footer */}
                <footer className="border-t border-primary/10 bg-card/30 py-6 pb-24">
                  <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        <p className=''>© 2025 HuddleCo - Business Systems Assessment</p>
                      </div>
                      {/* Removed CRM dashboard link for simplified app */}
                    </div>
                  </div>
                </footer>
              </div>} />
            
            {/* Removed CRM dashboard route for simplified app */}
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </AuthProvider>;
}
export default App;
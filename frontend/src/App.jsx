import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-dark-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-dark-800">
        <div className="text-2xl font-black tracking-tighter text-white">
          FIT<span className="text-primary-500">CORE</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#plans" className="hover:text-white transition-colors">Plans</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</button>
          <button className="px-5 py-2 text-sm font-bold text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20">
            Join Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-dark-900 to-dark-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white max-w-4xl tracking-tight leading-tight z-10">
          Forge Your Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-yellow-500">Physique</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl z-10">
          Join FITCORE for premium facilities, expert coaching, and a community that pushes you beyond your limits. Subscribe today and start your transformation.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10">
          <button className="px-8 py-4 text-lg font-bold text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/30 transform hover:-translate-y-1">
            Start Free Trial
          </button>
          <button className="px-8 py-4 text-lg font-bold text-white bg-dark-700 rounded-full hover:bg-dark-800 transition-all border border-dark-700 hover:border-gray-500">
            View Plans
          </button>
        </div>
      </main>

      {/* Pricing Section Placeholder */}
      <section id="plans" className="py-24 bg-dark-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white">Choose Your Plan</h2>
            <p className="mt-4 text-gray-400">Simple, transparent pricing for every fitness level.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="p-8 rounded-3xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-colors">
              <h3 className="text-xl font-bold text-white">Basic</h3>
              <div className="mt-4 text-4xl font-black text-white">$29<span className="text-lg text-gray-500 font-medium">/mo</span></div>
              <ul className="mt-8 space-y-4 text-gray-400">
                <li className="flex items-center gap-3">✓ Full gym access</li>
                <li className="flex items-center gap-3">✓ Locker room access</li>
                <li className="flex items-center gap-3 opacity-50">✗ Group classes</li>
                <li className="flex items-center gap-3 opacity-50">✗ Personal training</li>
              </ul>
              <button className="w-full mt-8 py-3 rounded-full font-bold text-white bg-dark-700 hover:bg-dark-600 transition-colors">Select Plan</button>
            </div>
            
            {/* Plan 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-primary-500 relative transform md:-translate-y-4 shadow-2xl shadow-primary-500/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary-500 text-xs font-bold text-white rounded-full tracking-wider uppercase">Most Popular</div>
              <h3 className="text-xl font-bold text-white">Premium</h3>
              <div className="mt-4 text-4xl font-black text-white">$49<span className="text-lg text-gray-400 font-medium">/mo</span></div>
              <ul className="mt-8 space-y-4 text-gray-300">
                <li className="flex items-center gap-3">✓ Full gym access</li>
                <li className="flex items-center gap-3">✓ Locker room access</li>
                <li className="flex items-center gap-3 text-primary-500">✓ Unlimited group classes</li>
                <li className="flex items-center gap-3 opacity-50">✗ Personal training</li>
              </ul>
              <button className="w-full mt-8 py-3 rounded-full font-bold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30">Select Plan</button>
            </div>
            
            {/* Plan 3 */}
            <div className="p-8 rounded-3xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-colors">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <div className="mt-4 text-4xl font-black text-white">$99<span className="text-lg text-gray-500 font-medium">/mo</span></div>
              <ul className="mt-8 space-y-4 text-gray-400">
                <li className="flex items-center gap-3">✓ Full gym access</li>
                <li className="flex items-center gap-3">✓ Locker room access</li>
                <li className="flex items-center gap-3 text-white">✓ Unlimited group classes</li>
                <li className="flex items-center gap-3 text-white">✓ 4x Personal training/mo</li>
              </ul>
              <button className="w-full mt-8 py-3 rounded-full font-bold text-white bg-dark-700 hover:bg-dark-600 transition-colors">Select Plan</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 border-t border-dark-800 bg-dark-900">
        <p>&copy; 2026 FITCORE. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

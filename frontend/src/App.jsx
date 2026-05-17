import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  Shield, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  ChevronDown, 
  X, 
  Mail, 
  Lock, 
  User, 
  Check, 
  ArrowRight,
  TrendingUp,
  Apple,
  Award,
  ChevronRight
} from 'lucide-react';

function App() {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', 'checkout', 'trial'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [trialName, setTrialName] = useState('');
  const [trialEmail, setTrialEmail] = useState('');
  const [trialPhone, setTrialPhone] = useState('');

  // Fetch plans from backend API
  useEffect(() => {
    fetch('https://gym-backend-ivqp.onrender.com/api/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        setLoadingPlans(false);
      })
      .catch(err => {
        console.error('Error fetching plans, using fallback.', err);
        // Fallback plans if backend fails
        setPlans([
          { id: 1, name: 'Basic', price: 29, features: ['Full gym access', 'Locker room access', '1 Complementary fitness assessment'] },
          { id: 2, name: 'Premium', price: 49, features: ['Full gym access', 'Locker room access', 'Unlimited group classes', 'Custom workout plan'] },
          { id: 3, name: 'Pro', price: 99, features: ['Full gym access', 'Locker room & Sauna', 'Unlimited group classes', '4x Personal training/mo', 'Nutrition guide'] }
        ]);
        setLoadingPlans(false);
      });
  }, []);

  const openCheckout = (plan) => {
    setSelectedPlan(plan);
    setCheckoutStep(1);
    setPaymentSuccess(false);
    setActiveModal('checkout');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else {
      setPaymentSuccess(true);
      setTimeout(() => {
        setActiveModal(null);
        setPaymentSuccess(false);
        setCheckoutStep(1);
      }, 3000);
    }
  };

  const handleTrialSubmit = (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setActiveModal(null);
      setPaymentSuccess(false);
      setTrialName('');
      setTrialEmail('');
      setTrialPhone('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[1200px] right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-900">
        <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Dumbbell className="h-7 w-7 text-orange-500 animate-pulse" />
          FIT<span className="text-orange-500">CORE</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-slate-300">
          <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
          <a href="#plans" className="hover:text-orange-500 transition-colors">Plans</a>
          <a href="#testimonials" className="hover:text-orange-500 transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center space-x-5">
          <button 
            onClick={() => setActiveModal('login')} 
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={() => openCheckout(plans[1] || { name: 'Premium', price: 49 })}
            className="px-6 py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-full hover:from-orange-500 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 md:px-12 py-20 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Start Your Fitness Journey Today
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Forge Your <br className="hidden md:block"/>Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">Physique</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
            FITCORE delivers premium training spaces, top-tier coaches, and a relentless community to push you beyond your perceived boundaries. 
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setActiveModal('trial')}
              className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white bg-orange-600 rounded-full hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/30 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
            </button>
            <a 
              href="#plans"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-300 bg-slate-900 rounded-full hover:bg-slate-800 transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center"
            >
              View Plans & Pricing
            </a>
          </div>
          
          {/* Trust Badges / Stats */}
          <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-black text-white">15K+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">50+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Expert Coaches</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">4.9/5</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                Google Rating <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Image Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute w-[350px] h-[350px] bg-orange-500/20 rounded-full blur-[100px] -z-10"></div>
          <div className="p-8 rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative max-w-sm w-full overflow-hidden group">
            {/* Visual element */}
            <div className="h-48 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center relative overflow-hidden mb-6">
              <Dumbbell className="h-24 w-24 text-white/10 absolute -right-4 -bottom-4 rotate-12" />
              <Dumbbell className="h-20 w-20 text-white animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Today's Gym Capacity</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-400">Current Occupancy:</span>
              <span className="text-sm font-bold text-green-400">Low (34%)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-3 rounded-full" style={{ width: '34%' }}></div>
            </div>
            <button 
              onClick={() => setActiveModal('trial')}
              className="w-full py-3 rounded-xl font-bold text-slate-950 bg-white hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              Get Gym Pass <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-950 border-t border-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Everything You Need To Succeed</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">We provide premium amenities, professional staff, and highly dynamic classes to power your fitness goals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-900 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">24/7 Premium Access</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Workout on your own terms. Our doors are open 24 hours a day, 7 days a week, including holidays.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-900 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Elite Level Coaches</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our certified trainers build customized programs tailored to your specific biomechanics and targets.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-900 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced Performance Stats</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Track metrics and measure body fat, muscle gain, and overall strength with smart scanning technology.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-900 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Apple className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Customized Nutrition Plans</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Receive complete diet templates, macronutrient configurations, and shopping lists curated by sports dieticians.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-900 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Group Classes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Gain unlimited access to CrossFit, HIIT, Yoga, Spin, and Strength circuits hosted by lead instructors.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-900 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra Clean Environment</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We enforce continuous sterilization cycles throughout the day to guarantee perfect hygiene standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-24 bg-slate-950 border-t border-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Choose Your Subscription Plan</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">Simple, transparent, contract-free pricing for every fitness goal.</p>
          </div>

          {loadingPlans ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400">Loading plans...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan) => {
                const isPremium = plan.name.toLowerCase() === 'premium';
                return (
                  <div 
                    key={plan.id}
                    className={`p-8 rounded-3xl bg-slate-900 border flex flex-col justify-between transition-all duration-300 relative ${
                      isPremium 
                        ? 'border-2 border-orange-500 shadow-xl shadow-orange-500/10 scale-105 z-10' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isPremium && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-slate-950 text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider">
                        Most Popular
                      </span>
                    )}
                    <div>
                      <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                      <div className="mt-4 text-5xl font-black text-white">
                        ${plan.price}
                        <span className="text-sm font-semibold text-slate-500">/mo</span>
                      </div>
                      <ul className="mt-8 space-y-4">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                            <span className="p-1 rounded-full bg-green-500/10 text-green-400">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => openCheckout(plan)}
                      className={`w-full mt-10 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                        isPremium 
                          ? 'bg-orange-500 text-slate-950 hover:bg-orange-400 shadow-orange-500/20' 
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      Select Plan
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-950 border-t border-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Real Success Stories</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">Read about our members who challenged themselves and reached their peaks.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-orange-500" />)}
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed mb-6">
                  "FITCORE changed everything. The 24/7 access let me maintain my workout schedule even with my busy night shifts. The coaches are genuinely invested in my progress."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white">MK</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Marcus King</h4>
                  <span className="text-xs text-slate-500">Member for 1 year</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-orange-500" />)}
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed mb-6">
                  "The facility is absolutely flawless and has everything you could ever ask for. Plus, the nutrition templates completely dialed in my recovery."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950">SC</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sarah Carter</h4>
                  <span className="text-xs text-slate-500">Member for 6 months</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-orange-500" />)}
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed mb-6">
                  "Unbeatable atmosphere. Everyone in this facility is pushing hard, which gives you so much energy. The group CrossFit classes are next level."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white">DB</div>
                <div>
                  <h4 className="text-sm font-bold text-white">David Miller</h4>
                  <span className="text-xs text-slate-500">Member for 2 years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-950 border-t border-slate-900 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-base">Everything you need to know about the FITCORE gym experience.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Can I cancel my subscription at any time?", a: "Absolutely. All of our plans are entirely month-to-month. There are no contracts, registration fees, or hidden cancellation penalties. Cancel anytime through your online dashboard." },
              { q: "Do you offer personal training packages?", a: "Yes. Our Pro tier includes 4 personal training sessions every month. If you are on the Basic or Premium tiers, you can purchase single or package training sessions directly from the app." },
              { q: "Is locker access and towel service included?", a: "All memberships include complete locker room and shower access. Towel service is included in our Premium and Pro tiers." },
              { q: "How do I start my free trial?", a: "Simply click the 'Start 7-Day Free Trial' button. Enter your name, email, and phone number, and you will receive a digital pass instantly to show at the front desk." }
            ].map((faq, index) => (
              <div key={index} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <button 
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full px-6 py-5 text-left font-bold flex items-center justify-between hover:text-orange-500 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === index && (
                  <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-950 border-t border-slate-900 px-6 md:px-12 text-slate-500">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="text-xl font-black text-white flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-orange-500" /> FITCORE
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              We empower athletic performance and support continuous transformation with modern equipment and premium coaching.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-4">Location</h4>
            <p className="text-sm text-slate-400 flex items-start gap-2">
              <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
              100 Innovation Way,<br />
              Tech City, TC 94002
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-4">Hours</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Open 24 Hours a day<br />
              7 Days a week<br />
              Staff Hours: 8:00 AM - 10:00 PM
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Sign up for tips, advice, and event discounts.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email Address" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
              <button className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>&copy; 2026 FITCORE. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
            <div className="text-center mb-6">
              <Dumbbell className="h-10 w-10 text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-black text-white">Welcome Back</h3>
              <p className="text-xs text-slate-400 mt-1">Log in to manage your workout subscription.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-orange-500 text-slate-950 font-black rounded-xl hover:bg-orange-400 transition-colors">
                Log In
              </button>
            </form>
            <p className="text-center text-xs text-slate-500 mt-6">
              Don't have an account?{' '}
              <button onClick={() => setActiveModal('register')} className="text-orange-500 font-bold hover:underline">
                Create one
              </button>
            </p>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {activeModal === 'register' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
            <div className="text-center mb-6">
              <Dumbbell className="h-10 w-10 text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-black text-white">Create Account</h3>
              <p className="text-xs text-slate-400 mt-1">Join the FITCORE community today.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-orange-500 text-slate-950 font-black rounded-xl hover:bg-orange-400 transition-colors">
                Create Account
              </button>
            </form>
            <p className="text-center text-xs text-slate-500 mt-6">
              Already have an account?{' '}
              <button onClick={() => setActiveModal('login')} className="text-orange-500 font-bold hover:underline">
                Log in
              </button>
            </p>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {activeModal === 'checkout' && selectedPlan && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl overflow-hidden">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
              <X className="h-6 w-6" />
            </button>
            
            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black text-white">Payment Successful</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Your FITCORE {selectedPlan.name} membership is active! A confirmation email has been sent. Welcome aboard!
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Subscription Checkout</span>
                  <h3 className="text-2xl font-black text-white mt-1">Activate Membership</h3>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
                  <div>
                    <h4 className="font-bold text-white">{selectedPlan.name} Membership</h4>
                    <span className="text-xs text-slate-500">Billed monthly, cancel anytime</span>
                  </div>
                  <span className="text-2xl font-black text-white">${selectedPlan.price}/mo</span>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  {checkoutStep === 1 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" required />
                        <input type="text" placeholder="Last Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" required />
                      </div>
                      <input type="email" placeholder="Email Address" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" required />
                      <button type="submit" className="w-full py-4 bg-orange-500 text-slate-950 font-black rounded-xl hover:bg-orange-400 transition-colors flex items-center justify-center gap-2 mt-4">
                        Continue to Payment <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <input type="text" placeholder="Cardholder Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" required />
                        <input type="text" placeholder="Card Number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" required />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="MM/YY" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" required />
                          <input type="text" placeholder="CVV" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" required />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button type="button" onClick={() => setCheckoutStep(1)} className="w-1/3 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
                          Back
                        </button>
                        <button type="submit" className="w-2/3 py-4 bg-orange-500 text-slate-950 font-black rounded-xl hover:bg-orange-400 transition-colors">
                          Pay & Activate
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FREE TRIAL MODAL */}
      {activeModal === 'trial' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-white">Pass Activated!</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Your 7-day free gym pass is ready. We have sent the pass details and your QR code barcode to your email address!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <Sparkles className="h-10 w-10 text-orange-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white">Start 7-Day Free Trial</h3>
                  <p className="text-xs text-slate-400 mt-1">Get immediate full access pass. No card required.</p>
                </div>
                <form onSubmit={handleTrialSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={trialName}
                      onChange={(e) => setTrialName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={trialEmail}
                      onChange={(e) => setTrialEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      value={trialPhone}
                      onChange={(e) => setTrialPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-orange-500 text-slate-950 font-black rounded-xl hover:bg-orange-400 transition-colors">
                    Activate Free Pass
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

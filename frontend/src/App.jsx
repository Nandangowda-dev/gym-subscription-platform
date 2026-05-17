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
  ChevronRight,
  Activity,
  Zap,
  RotateCw
} from 'lucide-react';

function App() {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', 'checkout', 'trial'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Live Workout Animation States
  const [activeExercise, setActiveExercise] = useState('dumbbell');
  const [repProgress, setRepProgress] = useState(0); // 0 to 100
  const [repCount, setRepCount] = useState(0);
  const [isLiftingUp, setIsLiftingUp] = useState(true);

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
        setPlans([
          { id: 1, name: 'Basic', price: 29, features: ['Full gym access', 'Locker room access', '1 Complementary fitness assessment'] },
          { id: 2, name: 'Premium', price: 49, features: ['Full gym access', 'Locker room access', 'Unlimited group classes', 'Custom workout plan'] },
          { id: 3, name: 'Pro', price: 99, features: ['Full gym access', 'Locker room & Sauna', 'Unlimited group classes', '4x Personal training/mo', 'Nutrition guide'] }
        ]);
        setLoadingPlans(false);
      });
  }, []);

  // Smooth Workout Repetition Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRepProgress(prev => {
        if (isLiftingUp) {
          if (prev >= 100) {
            setIsLiftingUp(false);
            return 100;
          }
          return prev + 2.5;
        } else {
          if (prev <= 0) {
            setIsLiftingUp(true);
            setRepCount(rc => rc + 1);
            return 0;
          }
          return prev - 2.5;
        }
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isLiftingUp, activeExercise]);

  // Reset reps when changing exercise
  useEffect(() => {
    setRepCount(0);
    setRepProgress(0);
    setIsLiftingUp(true);
  }, [activeExercise]);

  // Sine mapping for realistic biological lifting speed (slower at peak, faster in middle)
  const animValue = Math.sin((repProgress / 100) * (Math.PI / 2));

  const exercises = {
    dumbbell: {
      name: "Dumbbell Bicep Curl",
      muscles: "Biceps, Forearms, Brachialis",
      calories: 4.8,
      tips: "Keep elbows pinned to your torso. Avoid using momentum or swinging the upper body.",
      render: () => {
        const forearmRotation = animValue * 55; // 0 to 55 degrees
        const bicepScaleY = 1 + animValue * 0.28;
        const bicepScaleX = 1 + animValue * 0.15;
        return (
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 200 200">
            {/* Shoulder Joint */}
            <circle cx="70" cy="60" r="10" className="fill-slate-800 stroke-slate-700 stroke-2" />
            {/* Upper Arm */}
            <line x1="70" y1="60" x2="80" y2="110" className="stroke-slate-700 stroke-[16] stroke-linecap-round" />
            {/* Bicep Muscle (Active Highlights) */}
            <path 
              d="M 68 70 Q 55 85 78 105" 
              className="stroke-orange-500 fill-none stroke-[20] stroke-linecap-round opacity-80"
              style={{
                transform: `scale(${bicepScaleX}, ${bicepScaleY})`,
                transformOrigin: '70px 60px',
                transition: 'transform 0.05s ease-out',
                filter: `drop-shadow(0 0 ${animValue * 8}px rgba(249, 115, 22, 0.4))`
              }}
            />
            {/* Elbow Joint */}
            <circle cx="80" cy="110" r="8" className="fill-slate-800 stroke-slate-700 stroke-2" />
            
            {/* Forearm + Dumbbell Group (Rotates around Elbow [80, 110]) */}
            <g style={{
              transform: `rotate(-${forearmRotation}deg)`,
              transformOrigin: '80px 110px',
              transition: 'transform 0.05s ease-out'
            }}>
              {/* Forearm bone */}
              <line x1="80" y1="110" x2="140" y2="100" className="stroke-slate-700 stroke-[12] stroke-linecap-round" />
              {/* Forearm muscle highlight */}
              <line x1="80" y1="110" x2="140" y2="100" className="stroke-orange-500/40 stroke-[12] stroke-linecap-round" />
              {/* Wrist Joint */}
              <circle cx="140" cy="100" r="6" className="fill-slate-800 stroke-slate-700 stroke-2" />
              
              {/* Dumbbell Handle */}
              <line x1="140" y1="85" x2="140" y2="115" className="stroke-slate-500 stroke-[8]" />
              {/* Dumbbell Weights */}
              <rect x="130" y="70" width="20" height="15" rx="3" className="fill-slate-800 stroke-slate-600 stroke-2" />
              <rect x="130" y="115" width="20" height="15" rx="3" className="fill-slate-800 stroke-slate-600 stroke-2" />
              {/* Grip Highlight */}
              <circle cx="140" cy="100" r="4" className="fill-orange-500" />
            </g>
          </svg>
        );
      }
    },
    barbell: {
      name: "Barbell Bench Press",
      muscles: "Pectoralis Major, Triceps, Anterior Deltoids",
      calories: 6.2,
      tips: "Retract scapula, maintain a slight arch in your lower back, and touch the bar to mid-chest.",
      render: () => {
        const barY = 120 - animValue * 65; // Bar slides between Y=120 and Y=55
        const chestScale = 1 + animValue * 0.15;
        return (
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 200 200">
            {/* Bench Press Rack */}
            <line x1="40" y1="150" x2="40" y2="80" className="stroke-slate-800 stroke-[6] stroke-linecap-round" />
            <line x1="160" y1="150" x2="160" y2="80" className="stroke-slate-800 stroke-[6] stroke-linecap-round" />
            {/* Flat Bench */}
            <rect x="50" y="130" width="100" height="15" rx="4" className="fill-slate-900 stroke-slate-800 stroke-2" />
            
            {/* Torso lying down */}
            <ellipse cx="100" cy="122" rx="35" ry="12" className="fill-slate-800 stroke-slate-700 stroke-2" />
            {/* Active Pec highlight */}
            <ellipse cx="100" cy="122" rx="25" ry="8" 
              className="fill-orange-500/20 stroke-orange-500 stroke-2"
              style={{
                transform: `scale(${1 / chestScale}, ${chestScale})`,
                transformOrigin: '100px 122px',
                filter: `drop-shadow(0 0 ${animValue * 6}px rgba(249, 115, 22, 0.3))`
              }}
            />

            {/* Left Arm Connecting to Bar */}
            <line x1="65" y1="122" x2="60" y2={barY} className="stroke-slate-700 stroke-[8] stroke-linecap-round" />
            {/* Right Arm Connecting to Bar */}
            <line x1="135" y1="122" x2="140" y2={barY} className="stroke-slate-700 stroke-[8] stroke-linecap-round" />

            {/* Barbell Assembly */}
            <g style={{
              transform: `translateY(0px)`,
              transition: 'transform 0.05s ease-out'
            }}>
              {/* Steel Bar */}
              <line x1="20" y1={barY} x2="180" y2={barY} className="stroke-slate-400 stroke-[4]" />
              {/* Left Plates */}
              <rect x="20" y={barY - 15} width="12" height="30" rx="2" className="fill-slate-800 stroke-slate-700 stroke-2" />
              <rect x="10" y={barY - 12} width="8" height="24" rx="2" className="fill-slate-900 stroke-slate-800 stroke-2" />
              {/* Right Plates */}
              <rect x="168" y={barY - 15} width="12" height="30" rx="2" className="fill-slate-800 stroke-slate-700 stroke-2" />
              <rect x="182" y={barY - 12} width="8" height="24" rx="2" className="fill-slate-900 stroke-slate-800 stroke-2" />
              {/* Grip markers */}
              <circle cx="60" cy={barY} r="3" className="fill-orange-500" />
              <circle cx="140" cy={barY} r="3" className="fill-orange-500" />
            </g>
          </svg>
        );
      }
    },
    flying: {
      name: "Pec Deck Fly (Flying Machine)",
      muscles: "Sternal Pecs, Clavicular Pecs, Anterior Delts",
      calories: 5.5,
      tips: "Maintain a soft bend in the elbows. Concentrate on pressing your elbows together at peak.",
      render: () => {
        const armAngle = animValue * 42; // Arms swing 0 to 42 degrees inwards
        return (
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 200 200">
            {/* Machine Frame Backrest */}
            <rect x="90" y="30" width="20" height="130" rx="5" className="fill-slate-900 stroke-slate-800 stroke-2" />
            {/* Top Frame Pulley Bar */}
            <line x1="50" y1="45" x2="150" y2="45" className="stroke-slate-800 stroke-[8] stroke-linecap-round" />
            
            {/* Human Chest (Top-down view) */}
            <circle cx="100" cy="110" r="30" className="fill-slate-800 stroke-slate-700 stroke-2" />
            {/* Pec Muscles highlighting */}
            <path 
              d="M 75 100 Q 100 125 125 100" 
              className="stroke-orange-500 fill-none stroke-[8] stroke-linecap-round"
              style={{
                opacity: 0.2 + animValue * 0.8,
                filter: `drop-shadow(0 0 ${animValue * 8}px rgba(249, 115, 22, 0.5))`
              }}
            />

            {/* Left Machine Lever Pivoting around [60, 45] */}
            <g style={{
              transform: `rotate(${armAngle}deg)`,
              transformOrigin: '60px 45px',
              transition: 'transform 0.05s ease-out'
            }}>
              {/* Lever arm */}
              <line x1="60" y1="45" x2="60" y2="125" className="stroke-slate-700 stroke-[6] stroke-linecap-round" />
              {/* Handle */}
              <line x1="60" y1="125" x2="72" y2="125" className="stroke-slate-500 stroke-[5] stroke-linecap-round" />
              <circle cx="72" cy="125" r="4" className="fill-orange-500" />
            </g>

            {/* Right Machine Lever Pivoting around [140, 45] */}
            <g style={{
              transform: `rotate(-${armAngle}deg)`,
              transformOrigin: '140px 45px',
              transition: 'transform 0.05s ease-out'
            }}>
              {/* Lever arm */}
              <line x1="140" y1="45" x2="140" y2="125" className="stroke-slate-700 stroke-[6] stroke-linecap-round" />
              {/* Handle */}
              <line x1="140" y1="125" x2="128" y2="125" className="stroke-slate-500 stroke-[5] stroke-linecap-round" />
              <circle cx="128" cy="125" r="4" className="fill-orange-500" />
            </g>
          </svg>
        );
      }
    },
    smith: {
      name: "Smith Machine Squat",
      muscles: "Quadriceps, Gluteus Maximus, Hamstrings",
      calories: 7.5,
      tips: "Rest the bar on your traps, stand shoulder-width apart, and push your hips back as if sitting in a chair.",
      render: () => {
        const squatY = animValue * 45; // Hips slide down up to 45px
        return (
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 200 200">
            {/* Smith Machine Tracks */}
            <line x1="50" y1="30" x2="50" y2="170" className="stroke-slate-800 stroke-[6] stroke-linecap-round" />
            <line x1="150" y1="30" x2="150" y2="170" className="stroke-slate-800 stroke-[6] stroke-linecap-round" />
            
            {/* Squatter Body Assembly */}
            <g style={{
              transform: `translateY(${squatY}px)`,
              transition: 'transform 0.05s ease-out'
            }}>
              {/* Torso */}
              <line x1="100" y1="75" x2="100" y2="115" className="stroke-slate-700 stroke-[12] stroke-linecap-round" />
              {/* Head */}
              <circle cx="100" cy="60" r="10" className="fill-slate-800 stroke-slate-700 stroke-2" />
              
              {/* Squatter thighs highlighting */}
              <line x1="100" y1="115" x2="80" y2="140" 
                className="stroke-slate-700 stroke-[10] stroke-linecap-round"
                style={{
                  transform: `rotate(-${squatY * 0.7}deg)`,
                  transformOrigin: '100px 115px'
                }}
              />
              {/* Quad Highlight */}
              <line x1="100" y1="115" x2="80" y2="140" 
                className="stroke-orange-500 stroke-[10] stroke-linecap-round"
                style={{
                  opacity: 0.2 + animValue * 0.8,
                  transform: `rotate(-${squatY * 0.7}deg)`,
                  transformOrigin: '100px 115px',
                  filter: `drop-shadow(0 0 ${animValue * 6}px rgba(249, 115, 22, 0.4))`
                }}
              />

              {/* Barbell rest on shoulders [100, 75] */}
              <line x1="35" y1="75" x2="165" y2="75" className="stroke-slate-400 stroke-[4]" />
              {/* Barbell weights */}
              <rect x="35" y="65" width="10" height="20" rx="1" className="fill-slate-800 stroke-slate-700" />
              <rect x="155" y="65" width="10" height="20" rx="1" className="fill-slate-800 stroke-slate-700" />
            </g>

            {/* Lower Leg (Stay static on ground) */}
            <line x1="80" y1="140" x2="80" y2="175" className="stroke-slate-700 stroke-[10] stroke-linecap-round" />
            {/* Ground feet */}
            <line x1="72" y1="175" x2="90" y2="175" className="stroke-slate-800 stroke-[4] stroke-linecap-round" />
          </svg>
        );
      }
    }
  };

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
          <a href="#visualizer" className="hover:text-orange-500 transition-colors">Interactive Workouts</a>
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

      {/* Interactive Workout Visualizer Section */}
      <section id="visualizer" className="py-24 bg-slate-950 border-t border-slate-900 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> Interactive Real-time HUD
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Real-Time Workout Visualizer</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">Select any machine to see biological muscle activation and real-time biometric tracking loops.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Control Panel Menu */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" /> Select Equipment
              </h3>
              
              {[
                { id: 'dumbbell', label: 'Dumbbell Curl', desc: 'Isolate and load the biceps.' },
                { id: 'barbell', label: 'Barbell Bench Press', desc: 'Power through the pectoral chain.' },
                { id: 'flying', label: 'Pec Deck Fly Machine', desc: 'Isolate inner chest squeeze.' },
                { id: 'smith', label: 'Smith Machine Squat', desc: 'Drive quadricep & glute power.' }
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setActiveExercise(ex.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group active:scale-[0.98] ${
                    activeExercise === ex.id 
                      ? 'bg-slate-900 border-orange-500 shadow-lg shadow-orange-500/5' 
                      : 'bg-slate-900/30 border-slate-900 hover:border-slate-800 hover:bg-slate-900/50'
                  }`}
                >
                  <div>
                    <h4 className={`font-bold text-base transition-colors ${activeExercise === ex.id ? 'text-orange-500' : 'text-white'}`}>
                      {ex.label}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{ex.desc}</p>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform ${activeExercise === ex.id ? 'text-orange-500 translate-x-1' : 'text-slate-600 group-hover:text-white'}`} />
                </button>
              ))}
            </div>

            {/* Animation Viewer Panel */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900 border border-slate-800 relative flex flex-col justify-between h-[480px]">
              {/* Exercise Details HUD Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Active Visualizer</span>
                  <h4 className="text-xl font-bold text-white mt-0.5">{exercises[activeExercise].name}</h4>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Target Muscles</span>
                    <p className="text-xs font-bold text-slate-300">{exercises[activeExercise].muscles}</p>
                  </div>
                </div>
              </div>

              {/* The Interactive SVG Canvas */}
              <div className="flex-1 flex items-center justify-center p-4">
                {exercises[activeExercise].render()}
              </div>

              {/* HUD Biometrics Panel */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center relative overflow-hidden">
                  <span className="text-[10px] font-black text-slate-500 uppercase block tracking-wider">Completed Reps</span>
                  <span className="text-2xl font-black text-white mt-1 block">{repCount}</span>
                </div>
                
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center relative overflow-hidden">
                  <span className="text-[10px] font-black text-slate-500 uppercase block tracking-wider">REP PROGRESS</span>
                  <span className="text-2xl font-black text-orange-500 mt-1 block">{Math.round(repProgress)}%</span>
                  {/* Progress Line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-orange-500" style={{ width: `${repProgress}%`, transition: 'width 0.05s ease-out' }}></div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center relative overflow-hidden">
                  <span className="text-[10px] font-black text-slate-500 uppercase block tracking-wider">CALORIES BURNT</span>
                  <span className="text-2xl font-black text-white mt-1 block">{(repCount * exercises[activeExercise].calories).toFixed(1)} kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Advice Box */}
          <div className="mt-8 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-4">
            <RotateCw className="h-6 w-6 text-orange-500 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Coaching Tip for peak engagement</span>
              <p className="text-sm text-slate-300 mt-1">{exercises[activeExercise].tips}</p>
            </div>
          </div>
        </div>
      </section>

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

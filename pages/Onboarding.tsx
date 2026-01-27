import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PERSONAS } from '../constants';
import { BusinessProfile, PersonaId } from '../types';
import { User, ArrowRight, Briefcase, MapPin, ChevronLeft, Mail, Lock, CheckCircle2, TrendingUp, Users, Award, Moon, Sun } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTheme } from '../contexts/ThemeContext';

interface OnboardingProps {
  setProfile: (profile: BusinessProfile) => void;
}

type ViewState = 'landing' | 'login' | 'signup';

// --- DATA LISTS ---
const AFRICAN_COUNTRIES = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Democratic Republic of the Congo", "Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
].sort();

const INDUSTRIES = [
    "Retail & Commerce",
    "Agriculture & Farming",
    "Technology & Software",
    "Services & Consulting",
    "Healthcare & Wellness",
    "Education & Training",
    "Manufacturing & Production",
    "Logistics & Transport",
    "Hospitality & Tourism",
    "Construction & Real Estate",
    "Fashion & Creative Arts",
    "Financial Services",
    "Beauty & Cosmetics",
    "Food & Beverage",
    "Other"
];

const BUSINESS_GOALS = [
    "Pricing Strategy",
    "Increase Revenue",
    "Manage Expenses",
    "Access Loans/Grants",
    "Marketing & Sales",
    "Staff Training",
    "Legal Compliance",
    "Product Development",
    "Export/Expansion",
    "Digital Transformation"
];

const TEAM_SIZES = [
    "Just Me (Solopreneur)",
    "2-5 People",
    "6-10 People",
    "11-50 People",
    "50+ People"
];

const REVENUE_RANGES = [
    "Pre-revenue",
    "< $1,000 / yr",
    "$1,000 - $10,000 / yr",
    "$10,000 - $50,000 / yr",
    "$50,000+ / yr"
];

const STRENGTHS = [
    "Product Quality",
    "Customer Service",
    "Location / Reach",
    "Affordable Pricing",
    "Brand Reputation",
    "Innovation / Tech",
    "Speed of Delivery"
];

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Onboarding: React.FC<OnboardingProps> = ({ setProfile }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<ViewState>('landing');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup Wizard State
  const [signupStep, setSignupStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ownerName: '',
    businessName: '',
    businessType: INDUSTRIES[0],
    country: 'Nigeria',
    teamSize: TEAM_SIZES[1],
    revenueRange: REVENUE_RANGES[1],
    primaryStrength: STRENGTHS[0],
    goals: [] as string[]
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSelectPersona = (id: PersonaId) => {
    setProfile(PERSONAS[id]);
    navigate('/');
  };

  const simulateAuthDelay = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    await simulateAuthDelay();
    const googleProfile: BusinessProfile = {
        id: 'google-user-' + Date.now(),
        email: 'alex.doe@example.com',
        ownerName: 'Alex Doe',
        businessName: "Alex's Business",
        businessType: 'Retail',
        country: 'Nigeria',
        currency: '₦',
        revenueRange: REVENUE_RANGES[1],
        teamSize: TEAM_SIZES[1],
        primaryStrength: 'Location',
        goals: ['Growth']
    };
    setProfile(googleProfile);
    navigate('/');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return;
    
    await simulateAuthDelay();
    const userProfile: BusinessProfile = {
        id: 'email-user-' + Date.now(),
        email: loginData.email,
        ownerName: loginData.email.split('@')[0],
        businessName: "My Business",
        businessType: 'Retail',
        country: 'Nigeria',
        currency: '₦',
        revenueRange: REVENUE_RANGES[1],
        teamSize: TEAM_SIZES[1],
        primaryStrength: 'Location',
        goals: ['Growth']
    };
    setProfile(userProfile);
    navigate('/');
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => {
        const exists = prev.goals.includes(goal);
        if (exists) {
            return { ...prev, goals: prev.goals.filter(g => g !== goal) };
        } else {
            return { ...prev, goals: [...prev.goals, goal] };
        }
    });
  };

  const handleSignupSubmit = async () => {
    if (signupStep < 4) {
        setSignupStep(prev => prev + 1);
        return;
    }

    // Final Validation
    if(!formData.ownerName || !formData.businessName || !formData.email) return;

    await simulateAuthDelay();

    // Basic Currency Mapping
    const currencyMap: Record<string, string> = {
        'Nigeria': '₦',
        'Kenya': 'KSh',
        'South Africa': 'R',
        'Ghana': '₵',
        'Egypt': 'E£',
        'Rwanda': 'RF',
        'Tanzania': 'TSh',
        'Uganda': 'USh',
        'Morocco': 'DH',
    };

    const newProfile: BusinessProfile = {
        id: 'user-' + Date.now(),
        email: formData.email,
        ownerName: formData.ownerName,
        businessName: formData.businessName,
        businessType: formData.businessType,
        country: formData.country,
        currency: currencyMap[formData.country] || '$',
        revenueRange: formData.revenueRange,
        teamSize: formData.teamSize,
        primaryStrength: formData.primaryStrength,
        goals: formData.goals.length > 0 ? formData.goals : ['Growth']
    };
    setProfile(newProfile);
    navigate('/');
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center text-center w-full animate-fade-in-up">
        <div className="mb-8 scale-150">
            <Logo showText={false} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Mzizi Advisor</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xs text-lg">Your AI Partner for Business Growth in Africa.</p>

        <div className="w-full space-y-3">
          <Button onClick={() => setView('signup')}>
            Get Started
          </Button>
          <Button variant="outline" onClick={() => setView('login')}>
            I have an account
          </Button>
        </div>
    </div>
  );

  const renderLogin = () => (
    <div className="w-full animate-fade-in-up">
        <button onClick={() => setView('landing')} className="mb-6 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="mb-8 text-center">
             <div className="inline-block scale-75 mb-2"><Logo showText={false}/></div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
             <p className="text-gray-500 dark:text-gray-400">Login to manage your business.</p>
        </div>

        <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 p-3 rounded-xl font-medium mb-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 relative"
        >
            <GoogleIcon />
            <span>Sign in with Google</span>
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with email</span>
            </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5"/>}
              value={loginData.email}
              onChange={e => setLoginData({...loginData, email: e.target.value})}
              required
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5"/>}
              value={loginData.password}
              onChange={e => setLoginData({...loginData, password: e.target.value})}
              required
            />
            <Button type="submit" isLoading={isLoading} icon={<ArrowRight className="w-5 h-5" />}>
                Sign In
            </Button>
        </form>

        <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Developer Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PERSONAS) as PersonaId[]).map((id) => (
                    <button
                        key={id}
                        onClick={() => handleSelectPersona(id)}
                        className="p-2 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-green-50 hover:text-green-700 transition-all truncate"
                    >
                        {PERSONAS[id].ownerName}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  const renderSignupStep1 = () => (
    <div className="space-y-4 animate-fade-in-up">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create Account</h3>
        
        <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 p-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 relative"
        >
            <GoogleIcon />
            <span>Sign up with Google</span>
        </button>

        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or with email</span>
            </div>
        </div>

        <Input 
            label="Email Address"
            type="email"
            icon={<Mail className="w-5 h-5"/>}
            placeholder="grace@example.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            autoFocus
        />
        <Input 
            label="Create Password"
            type="password"
            icon={<Lock className="w-5 h-5"/>}
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
        />
    </div>
  );

  const renderSignupStep2 = () => (
    <div className="space-y-4 animate-fade-in-up">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Identity</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Tell us what to call you and your business.</p>
        
        <Input 
            label="Your Name"
            icon={<User className="w-5 h-5"/>}
            placeholder="e.g. Grace Okafor"
            value={formData.ownerName}
            onChange={e => setFormData({...formData, ownerName: e.target.value})}
            autoFocus
        />
        <Input 
            label="Business Name"
            icon={<Briefcase className="w-5 h-5"/>}
            placeholder="e.g. Grace's Fabrics"
            value={formData.businessName}
            onChange={e => setFormData({...formData, businessName: e.target.value})}
        />
    </div>
  );

  const renderSignupStep3 = () => (
    <div className="space-y-4 animate-fade-in-up">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Business Context</h3>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
            <div className="relative">
                <select 
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="w-full pl-3 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white dark:bg-gray-800 dark:text-white appearance-none"
                >
                    {AFRICAN_COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry Category</label>
            <select 
                value={formData.businessType}
                onChange={e => setFormData({...formData, businessType: e.target.value})}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white dark:bg-gray-800 dark:text-white"
            >
                {INDUSTRIES.map(i => (
                    <option key={i} value={i}>{i}</option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Size</label>
                <div className="relative">
                    <select 
                        value={formData.teamSize}
                        onChange={e => setFormData({...formData, teamSize: e.target.value})}
                        className="w-full pl-3 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white dark:bg-gray-800 dark:text-white appearance-none"
                    >
                        {TEAM_SIZES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <Users className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Income</label>
                <div className="relative">
                    <select 
                        value={formData.revenueRange}
                        onChange={e => setFormData({...formData, revenueRange: e.target.value})}
                        className="w-full pl-3 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white dark:bg-gray-800 dark:text-white appearance-none"
                    >
                        {REVENUE_RANGES.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <TrendingUp className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    </div>
  );

  const renderSignupStep4 = () => (
    <div className="space-y-4 animate-fade-in-up">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Strategy & Goals</h3>
        
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What is your primary business strength?</label>
            <div className="relative">
                 <select 
                    value={formData.primaryStrength}
                    onChange={e => setFormData({...formData, primaryStrength: e.target.value})}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white dark:bg-gray-800 dark:text-white appearance-none"
                >
                    {STRENGTHS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <Award className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select your top goals</label>
            <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto no-scrollbar pb-2">
                {BUSINESS_GOALS.map(goal => {
                    const isSelected = formData.goals.includes(goal);
                    return (
                        <button
                            key={goal}
                            onClick={() => handleGoalToggle(goal)}
                            className={`p-3 rounded-xl text-left text-sm font-medium transition-all border ${
                                isSelected 
                                ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 ring-1 ring-green-500' 
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-200'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <span>{goal}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    </div>
  );

  const renderSignup = () => (
    <div className="w-full">
        {/* Navigation & Progress */}
        <div className="flex items-center justify-between mb-6">
            <button 
                onClick={() => {
                    if (signupStep > 1) setSignupStep(prev => prev - 1);
                    else setView('landing');
                }} 
                className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" /> Back
            </button>
            
            <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(step => (
                    <div 
                        key={step} 
                        className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                            step <= signupStep ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    />
                ))}
            </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="min-h-[300px]">
            {signupStep === 1 && renderSignupStep1()}
            {signupStep === 2 && renderSignupStep2()}
            {signupStep === 3 && renderSignupStep3()}
            {signupStep === 4 && renderSignupStep4()}
        </div>

        {/* Action Button */}
        <div className="mt-8">
            <Button 
                onClick={handleSignupSubmit}
                isLoading={isLoading}
                disabled={
                    (signupStep === 1 && (!formData.email || !formData.password)) ||
                    (signupStep === 2 && (!formData.ownerName || !formData.businessName)) ||
                    (signupStep === 4 && formData.goals.length === 0)
                }
            >
                {signupStep === 4 ? 'Create Account' : 'Continue'} 
                {signupStep !== 4 && <ArrowRight className="w-5 h-5 ml-1" />}
            </Button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-gray-900 dark:text-white">
      {/* Background Blobs (Adaptive) */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-green-100 dark:bg-green-900 rounded-full blur-3xl opacity-50 transition-colors duration-500" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-yellow-100 dark:bg-yellow-900 rounded-full blur-3xl opacity-50 transition-colors duration-500" />

      {/* Theme Toggle - Fixed Top Right */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:text-green-600 z-50 transition-all"
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      <div className="max-w-md w-full z-10">
        {view === 'landing' && renderLanding()}
        {view === 'login' && renderLogin()}
        {view === 'signup' && renderSignup()}

        <div className="mt-12 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
                By continuing, you agree to our Terms & Privacy Policy.<br/>
                Mzizi uses AI to provide business suggestions.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
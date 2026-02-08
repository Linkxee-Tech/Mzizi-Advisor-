import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessProfile, Currency } from '../types';
import { User, Building2, MapPin, Target, LogOut, Globe, Shield, Mail, Users, TrendingUp, Lock, Award, ChevronLeft, Wallet } from 'lucide-react';
import { getCurrencies } from '../services/api';

interface ProfileProps {
  profile: BusinessProfile;
  onUpdateProfile: (updates: Partial<BusinessProfile>) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdateProfile, onLogout }) => {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error("Failed to fetch currencies", error);
      }
    };
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateProfile({ currency: e.target.value });
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors md:hidden"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
      </div>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden">
        {/* Admin Lock Badge */}
        <div className="absolute top-4 right-4 text-gray-300 dark:text-gray-600">
          <Lock className="w-5 h-5" />
        </div>

        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 text-green-800 dark:text-green-200">
          <span className="text-3xl font-bold">{profile.ownerName.charAt(0)}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.ownerName}</h2>
        <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
          <Mail className="w-3 h-3" />
          <span className="text-sm">{profile.email || 'No email provided'}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{profile.businessName}</p>

        <div className="mt-4 flex gap-2">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3" /> Standard Plan
          </span>
        </div>
      </div>

      {/* Settings Section with Currency Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 font-bold text-gray-700 dark:text-gray-300 text-sm">
          Preferences
        </div>

        <div className="p-4 flex items-center gap-4">
          <Wallet className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Preferred Currency</p>
            <div className="relative">
              <select
                value={profile.currency}
                onChange={handleCurrencyChange}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.symbol}>
                    {c.symbol} - {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 font-bold text-gray-700 dark:text-gray-300 text-sm flex justify-between items-center">
          <span>Business Details</span>
          <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 uppercase tracking-wider">Read Only</span>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          <div className="p-4 flex items-center gap-4 opacity-80">
            <Building2 className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Industry</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.businessType}</p>
            </div>
            <Lock className="w-3 h-3 text-gray-300" />
          </div>

          <div className="p-4 flex items-center gap-4 opacity-80">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Location</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.country}</p>
            </div>
            <Lock className="w-3 h-3 text-gray-300" />
          </div>

          <div className="p-4 flex items-center gap-4 opacity-80">
            <Users className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Team Size</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.teamSize}</p>
            </div>
            <Lock className="w-3 h-3 text-gray-300" />
          </div>

          <div className="p-4 flex items-center gap-4 opacity-80">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Annual Revenue</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.revenueRange}</p>
            </div>
            <Lock className="w-3 h-3 text-gray-300" />
          </div>

          <div className="p-4 flex items-center gap-4 opacity-80">
            <Award className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Primary Strength</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.primaryStrength}</p>
            </div>
            <Lock className="w-3 h-3 text-gray-300" />
          </div>

          <div className="p-4 flex items-center gap-4 opacity-80">
            <Target className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Primary Goals</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.goals.map(g => (
                  <span key={g} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300">
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <Lock className="w-3 h-3 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 font-bold text-gray-700 dark:text-gray-300 text-sm">
          Account Settings
        </div>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
          <Globe className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
          <span className="ml-auto text-xs text-gray-400">English</span>
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-t border-gray-50 dark:border-gray-700">
          <Shield className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Privacy & Data</span>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>

      <p className="text-center text-xs text-gray-400 pt-4">
        Mzizi Advisor v1.0.2<br />
        Made for Africa 🌍
      </p>
    </div>
  );
};

export default Profile;
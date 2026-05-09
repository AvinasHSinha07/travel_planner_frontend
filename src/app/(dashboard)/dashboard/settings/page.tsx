'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings,
  Heart,
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TravelPreference {
  interests: string[];
  budgetRange: string;
  travelStyle: 'ADVENTURE' | 'RELAXATION' | 'CULTURAL' | 'LUXURY' | 'BUDGET' | 'FAMILY';
  dietaryRestrictions: string[];
  preferredClimate: string;
  mobilityNeeds: string;
}

const interestOptions = [
  'Beach', 'Adventure', 'Cultural', 'Food & Dining', 
  'Nature', 'Urban', 'Luxury', 'Budget', 'History', 'Wildlife'
];

const climateOptions = ['Tropical', 'Temperate', 'Cold', 'Any'];
const budgetOptions = ['Economy', 'Mid-range', 'Luxury'];

const SettingsPage = () => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    phone: '',
  });

  // Preferences state
  const [preferences, setPreferences] = useState<TravelPreference>({
    interests: [],
    budgetRange: 'Mid-range',
    travelStyle: 'ADVENTURE',
    dietaryRestrictions: [],
    preferredClimate: 'Any',
    mobilityNeeds: '',
  });

  // Fetch existing preferences
  const { isLoading: prefsLoading } = useQuery({
    queryKey: ['preferences', session?.user?.id],
    queryFn: async () => {
      const response = await axiosInstance.get('/preference');
      if (response.data.data) {
        setPreferences(response.data.data);
      }
      return response.data.data;
    },
    enabled: !!session?.user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profile) => {
      const response = await axiosInstance.patch('/user/profile', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: TravelPreference) => {
      const response = await axiosInstance.post('/preference', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Preferences saved successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
    onError: () => {
      toast.error('Failed to save preferences');
    },
  });

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferencesMutation.mutate(preferences);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
          Manage Your Profile & Preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-secondary/10 p-2 rounded-2xl h-auto">
          <TabsTrigger 
            value="profile" 
            className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm font-black uppercase text-xs tracking-widest"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="preferences"
            className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm font-black uppercase text-xs tracking-widest"
          >
            <Heart className="w-4 h-4 mr-2" />
            Travel Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-[2.5rem] p-8 max-w-2xl"
          >
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Full Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="h-14 rounded-xl border-border/60"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Email</Label>
                <Input
                  value={session?.user?.email || ''}
                  disabled
                  className="h-14 rounded-xl border-border/60 bg-secondary/5"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-14 rounded-xl border-border/60"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <Button 
                type="submit" 
                className="h-14 px-8 rounded-xl bg-primary font-black uppercase text-xs tracking-widest"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Save Changes
              </Button>
            </form>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-[2.5rem] p-8"
          >
            {prefsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={handlePreferencesSubmit} className="space-y-8">
                {/* Interests */}
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest">Travel Interests</Label>
                  <div className="flex flex-wrap gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          preferences.interests.includes(interest)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/10 text-foreground hover:bg-secondary/20'
                        }`}
                      >
                        {preferences.interests.includes(interest) && (
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />
                        )}
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel Style */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Travel Style</Label>
                  <Select
                    value={preferences.travelStyle}
                    onValueChange={(val) => setPreferences(prev => ({ ...prev, travelStyle: val as any }))}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="ADVENTURE">Adventure</SelectItem>
                      <SelectItem value="RELAXATION">Relaxation</SelectItem>
                      <SelectItem value="CULTURAL">Cultural</SelectItem>
                      <SelectItem value="LUXURY">Luxury</SelectItem>
                      <SelectItem value="BUDGET">Budget</SelectItem>
                      <SelectItem value="FAMILY">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Budget Range</Label>
                  <Select
                    value={preferences.budgetRange}
                    onValueChange={(val) => setPreferences(prev => ({ ...prev, budgetRange: val }))}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {budgetOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Climate */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Preferred Climate</Label>
                  <Select
                    value={preferences.preferredClimate}
                    onValueChange={(val) => setPreferences(prev => ({ ...prev, preferredClimate: val }))}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {climateOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobility Needs */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Mobility Needs</Label>
                  <Input
                    value={preferences.mobilityNeeds}
                    onChange={(e) => setPreferences(prev => ({ ...prev, mobilityNeeds: e.target.value }))}
                    className="h-14 rounded-xl border-border/60"
                    placeholder="Any specific mobility requirements?"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="h-14 px-8 rounded-xl bg-primary font-black uppercase text-xs tracking-widest"
                  disabled={updatePreferencesMutation.isPending}
                >
                  {updatePreferencesMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  Save Preferences
                </Button>
              </form>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

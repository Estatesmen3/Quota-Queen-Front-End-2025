import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Bell,
  Lock,
  Shield,
  Palette,
  Download,
  Trash2,
  Save,
  CreditCard,
  LogOut,
  CheckCircle,
  LinkIcon,
  Upload,
  Loader2,
  Camera,
  Trash,
  Building,
  Briefcase
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const { toast } = useToast();
  const { user, profile, signOut, updateProfile, uploadAvatar } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isRecruiter = profile?.user_type === "recruiter";
  
  const [profileData, setProfileData] = useState({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    email: user?.email || "",
    
    university: profile?.university || "",
    major: profile?.major || "",
    graduationYear: profile?.graduation_year || "",
    
    companyName: profile?.company_name || "",
    jobTitle: profile?.job_title || "",
    industry: profile?.industry || "",
    yearsOfExperience: profile?.years_experience || "",
    
    linkedInUrl: profile?.linkedin_url || "",
    bio: profile?.bio || ""
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailDigest: true,
    roleplayReminders: true,
    newMessages: true,
    newConnections: true,
    resourceUpdates: false,
    marketingEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showRoleplayStats: true,
    allowMessaging: true,
    allowRecruiters: true
  });

  const [appearance, setAppearance] = useState("system");
  
  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user?.email || "",
        
        university: profile.university || "",
        major: profile.major || "",
        graduationYear: profile.graduation_year || "",
        
        companyName: profile.company_name || "",
        jobTitle: profile.job_title || "",
        industry: profile.industry || "",
        yearsOfExperience: profile.years_experience || "",
        
        linkedInUrl: profile.linkedin_url || "",
        bio: profile.bio || ""
      });
    }
  }, [profile, user]);

  const handleProfileSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const updateData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        linkedin_url: profileData.linkedInUrl,
        bio: profileData.bio
      };
      
      if (isRecruiter) {
        Object.assign(updateData, {
          company_name: profileData.companyName,
          job_title: profileData.jobTitle,
          industry: profileData.industry,
          years_experience: profileData.yearsOfExperience ? parseInt(profileData.yearsOfExperience.toString()) : null
        });
      } else {
        Object.assign(updateData, {
          university: profileData.university,
          major: profileData.major,
          graduation_year: profileData.graduationYear ? parseInt(profileData.graduationYear.toString()) : null
        });
      }
      
      const { error } = await updateProfile(updateData);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setIsLoading(true);
    
    try {
      await uploadAvatar(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleNotification = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [key]: !notificationPrefs[key]
    });
    
    toast({
      title: "Notification settings updated",
      duration: 2000,
    });
  };

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key]
    });
    
    toast({
      title: "Privacy settings updated",
      duration: 2000,
    });
  };

  const handleAppearanceChange = (value: string) => {
    setAppearance(value);
    
    toast({
      title: "Appearance updated",
      description: `Theme set to ${value}`,
      duration: 2000,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Are you sure?",
      description: "This action cannot be undone. Please contact support if you're experiencing issues.",
      variant: "destructive",
      duration: 5000,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full max-w-md mb-6">
              <TabsTrigger value="profile" className="flex-1">
                <User size={16} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">
                <Bell size={16} className="mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1">
                <Lock size={16} className="mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex-1">
                <Palette size={16} className="mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Manage your personal information and how it appears to others
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative group">
                            <Avatar className="w-24 h-24 cursor-pointer" onClick={triggerFileInput}>
                              <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                              <AvatarFallback className="text-2xl bg-dopamine-purple text-white">
                                {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                              </AvatarFallback>
                              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-8 w-8 text-white" />
                              </div>
                            </Avatar>
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden" 
                              accept="image/*"
                              onChange={handleAvatarUpload}
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={triggerFileInput}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload size={14} />}
                            Upload Photo
                          </Button>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input 
                                id="firstName" 
                                value={profileData.firstName}
                                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input 
                                id="lastName" 
                                value={profileData.lastName}
                                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              disabled
                            />
                            <p className="text-xs text-muted-foreground">
                              Your email is verified <CheckCircle size={12} className="inline text-dopamine-green ml-1" />
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {isRecruiter ? (
                        <div className="space-y-4">
                          <h3 className="font-medium">Professional Information</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="companyName">Company Name</Label>
                              <Input 
                                id="companyName" 
                                value={profileData.companyName}
                                onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                                placeholder="e.g. Acme Corporation"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="jobTitle">Job Title</Label>
                              <Input 
                                id="jobTitle" 
                                value={profileData.jobTitle}
                                onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                                placeholder="e.g. Talent Acquisition Manager"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="industry">Industry</Label>
                              <Input 
                                id="industry" 
                                value={profileData.industry}
                                onChange={(e) => setProfileData({...profileData, industry: e.target.value})}
                                placeholder="e.g. Technology"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                              <Input 
                                id="yearsOfExperience" 
                                type="number"
                                value={profileData.yearsOfExperience}
                                onChange={(e) => setProfileData({...profileData, yearsOfExperience: e.target.value})}
                                placeholder="e.g. 5"
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="linkedin">LinkedIn URL</Label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                  <LinkIcon size={14} />
                                </span>
                                <Input 
                                  id="linkedin" 
                                  value={profileData.linkedInUrl}
                                  onChange={(e) => setProfileData({...profileData, linkedInUrl: e.target.value})}
                                  className="rounded-l-none"
                                  placeholder="e.g. linkedin.com/in/yourprofile"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <Textarea 
                              id="bio"
                              value={profileData.bio}
                              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                              className="w-full min-h-[100px]"
                              placeholder="Share your professional background, hiring focus, and what you look for in candidates..."
                            />
                            <p className="text-xs text-muted-foreground">
                              Your bio will be visible to candidates in your talent pool
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="font-medium">Academic Information</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="university">University</Label>
                              <Input 
                                id="university" 
                                value={profileData.university}
                                onChange={(e) => setProfileData({...profileData, university: e.target.value})}
                                placeholder="e.g. Stanford University"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="major">Major</Label>
                              <Input 
                                id="major" 
                                value={profileData.major}
                                onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                                placeholder="e.g. Business Administration"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="gradYear">Graduation Year</Label>
                              <Input 
                                id="gradYear" 
                                value={profileData.graduationYear}
                                onChange={(e) => setProfileData({...profileData, graduationYear: e.target.value})}
                                placeholder="e.g. 2025"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="linkedin">LinkedIn URL</Label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                  <LinkIcon size={14} />
                                </span>
                                <Input 
                                  id="linkedin" 
                                  value={profileData.linkedInUrl}
                                  onChange={(e) => setProfileData({...profileData, linkedInUrl: e.target.value})}
                                  className="rounded-l-none"
                                  placeholder="e.g. linkedin.com/in/yourprofile"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea 
                              id="bio"
                              value={profileData.bio}
                              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                              className="w-full min-h-[100px]"
                              placeholder="Tell recruiters about yourself, your interests, and your career goals..."
                            />
                            <p className="text-xs text-muted-foreground">
                              Your bio will be visible to recruiters and other students
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Reset</Button>
                      <Button 
                        onClick={handleProfileSave} 
                        className="glow-on-hover"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Control how and when we contact you
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Weekly Digest Email</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive a summary of your progress and new opportunities
                            </p>
                          </div>
                          <Switch 
                            checked={notificationPrefs.emailDigest}
                            onCheckedChange={() => toggleNotification('emailDigest')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Roleplay Reminders</Label>
                            <p className="text-sm text-muted-foreground">
                              Get reminders to practice regularly
                            </p>
                          </div>
                          <Switch 
                            checked={notificationPrefs.roleplayReminders}
                            onCheckedChange={() => toggleNotification('roleplayReminders')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">New Messages</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications for new messages
                            </p>
                          </div>
                          <Switch 
                            checked={notificationPrefs.newMessages}
                            onCheckedChange={() => toggleNotification('newMessages')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Connection Requests</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when someone wants to connect
                            </p>
                          </div>
                          <Switch 
                            checked={notificationPrefs.newConnections}
                            onCheckedChange={() => toggleNotification('newConnections')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Resource Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about new learning resources
                            </p>
                          </div>
                          <Switch 
                            checked={notificationPrefs.resourceUpdates}
                            onCheckedChange={() => toggleNotification('resourceUpdates')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive news, updates, and special offers
                            </p>
                          </div>
                          <Switch 
                            checked={notificationPrefs.marketingEmails}
                            onCheckedChange={() => toggleNotification('marketingEmails')}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full glow-on-hover">
                        Save Notification Preferences
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 8 characters with a mix of letters, numbers, and symbols
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full glow-on-hover">
                        Update Password
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>
                        Control who can see your information and connect with you
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Profile Visibility</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow your profile to be discovered by other users
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.showProfile}
                          onCheckedChange={() => togglePrivacy('showProfile')}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Show Roleplay Statistics</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your practice performance to other users
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.showRoleplayStats}
                          onCheckedChange={() => togglePrivacy('showRoleplayStats')}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Allow Messaging</Label>
                          <p className="text-sm text-muted-foreground">
                            Let other users send you direct messages
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.allowMessaging}
                          onCheckedChange={() => togglePrivacy('allowMessaging')}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Recruiter Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow recruiters to view your profile and contact you
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.allowRecruiters}
                          onCheckedChange={() => togglePrivacy('allowRecruiters')}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full glow-on-hover">
                        <Shield size={16} className="mr-2" />
                        Save Privacy Settings
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Theme Preferences</CardTitle>
                      <CardDescription>
                        Customize the appearance of Quota Queen
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select 
                          value={appearance} 
                          onValueChange={handleAppearanceChange}
                        >
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Choose how Quota Queen appears to you
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div 
                          className={`cursor-pointer aspect-video rounded-md bg-white border-2 ${appearance === 'light' ? 'border-dopamine-purple' : 'border-transparent'} flex items-center justify-center`}
                          onClick={() => handleAppearanceChange('light')}
                        >
                          <div className="w-full h-full p-2">
                            <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                            <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        
                        <div 
                          className={`cursor-pointer aspect-video rounded-md bg-gray-900 border-2 ${appearance === 'dark' ? 'border-dopamine-purple' : 'border-transparent'} flex items-center justify-center`}
                          onClick={() => handleAppearanceChange('dark')}
                        >
                          <div className="w-full h-full p-2">
                            <div className="w-full h-2 bg-gray-700 rounded mb-1"></div>
                            <div className="w-2/3 h-2 bg-gray-700 rounded"></div>
                          </div>
                        </div>
                        
                        <div 
                          className={`cursor-pointer aspect-video rounded-md overflow-hidden border-2 ${appearance === 'system' ? 'border-dopamine-purple' : 'border-transparent'}`}
                          onClick={() => handleAppearanceChange('system')}
                        >
                          <div className="flex h-full">
                            <div className="w-1/2 bg-white p-2">
                              <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-1/2 bg-gray-900 p-2">
                              <div className="w-full h-2 bg-gray-700 rounded mb-1"></div>
                              <div className="w-2/3 h-2 bg-gray-700 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full glow-on-hover">
                        <Palette size={16} className="mr-2" />
                        Save Appearance Settings
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Plan</span>
                        <span className="font-medium">Free (Student)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Joined</span>
                        <span className="font-medium">May 15, 2023</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Storage Used</span>
                        <span className="font-medium">128MB / 2GB</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <CreditCard size={16} className="mr-2" />
                      Upgrade Plan
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data & Privacy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download size={16} className="mr-2" />
                      Download Your Data
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-muted-foreground"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Help & Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">Need help with your account?</p>
                    <p className="text-sm text-muted-foreground">Contact our support team or visit our help center.</p>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                    <Button variant="link" className="w-full">
                      Visit Help Center
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

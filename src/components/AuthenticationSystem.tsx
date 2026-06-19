/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Smartphone, Monitor, Mail, Lock, Phone, ShieldCheck, 
  Sparkles, CheckCircle2, User, AlertCircle, RefreshCw, 
  MapPin, Clock, Eye, EyeOff, Globe, Bell, Fingerprint, 
  Compass, BadgeCheck, FileText, Send, LogIn, HardDrive, 
  HelpCircle, Trash2, ShieldAlert, ArrowLeft, X
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface AuthenticationSystemProps {
  users: UserType[];
  onUpdateUsers: (updated: UserType[]) => void;
  onLoginSuccess: (userId: string) => void;
}

// Preset Premium Avatars for Onboarding setup choice
const AVATAR_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', label: 'Fatima UI/UX' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', label: 'Imran Client' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', label: 'Ayesha Creator' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', label: 'Saad Developer' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', label: 'Sana Designer' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', label: 'Maryam Artist' }
];

const SKILL_POTENTIALS = [
  'Logo Design', 'UI/UX Wireframing', 'SaaS Copywriting', 'React Frontend',
  'EasyPaisa Integration', 'Video Post-Production', 'Flutter Development', 'SEO Optimization'
];

interface DeviceLog {
  id: string;
  name: string;
  ip: string;
  city: string;
  country: string;
  time: string;
  status: 'Approved' | 'Requires Verification' | 'Blocked';
  isCurrent: boolean;
}

interface SimulatedEmail {
  id: string;
  subject: string;
  body: string;
  receivedAt: string;
  verificationLink?: string;
}

export default function AuthenticationSystem({
  users,
  onUpdateUsers,
  onLoginSuccess
}: AuthenticationSystemProps) {
  
  // Platform selection state
  const [platform, setPlatform] = useState<'web' | 'android' | 'ios'>('web');
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'signup' | 'otp_signup' | 'smart_onboarding' | 'onboarding' | 'forgot_password' | 'mfa'>('welcome');

  // Custom Registration inputs for requested Create Account flow:
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'Regular' | 'Freelancer' | 'Creator' | 'Client'>('Freelancer');
  const [regOtp, setRegOtp] = useState('');
  const [regOtpSentCode, setRegOtpSentCode] = useState('');
  const [regSmartGoal, setRegSmartGoal] = useState<'Earn Money' | 'Hire Talent' | 'Promote Skills' | 'Grow Audience'>('Earn Money');
  
  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone OTP Flow states
  const [phoneNumber, setPhoneNumber] = useState('+92 300 4567891');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentCode, setOtpSentCode] = useState('1928'); // Simulated token
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'social'>('email');

  // Multi-platform specific mockups trigger states
  const [showOneTap, setShowOneTap] = useState(true); // Android-specific One Tap dialogue
  const [showAppleIDPanel, setShowAppleIDPanel] = useState(false); // iOS-specific Face ID panel
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceScanSuccess, setFaceScanSuccess] = useState(false);

  // Security elements state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [mfaSubmittedCode, setMfaSubmittedCode] = useState('');
  const [userPendingMfaId, setUserPendingMfaId] = useState<string | null>(null);
  
  // User Profile setup onboarding state
  const [onboardingUsername, setOnboardingUsername] = useState('');
  const [onboardingFullName, setOnboardingFullName] = useState('');
  const [onboardingEmail, setOnboardingEmail] = useState('');
  const [onboardingPhone, setOnboardingPhone] = useState('');
  const [onboardingRole, setOnboardingRole] = useState<'Regular' | 'Freelancer' | 'Client'>('Freelancer');
  const [onboardingCountry, setOnboardingCountry] = useState('Pakistan');
  const [onboardingAvatar, setOnboardingAvatar] = useState(AVATAR_PRESETS[0].url);
  const [onboardingBio, setOnboardingBio] = useState('Enthusiastic MatchGig user ready to deliver awesome creative gigs!');
  const [onboardingSkills, setOnboardingSkills] = useState<string[]>(['Logo Design', 'UI/UX Wireframing']);

  // Logged notification events simulation console
  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>([
    {
      id: 'em_1',
      subject: '⚠️ Security Alert: Login on new device recorded',
      body: 'Assalam-o-Alaikum! We recorded a security login to your account using Chrome Browser from Lahore, IP Address: 110.37.158.42. If this was not you, please immediately freeze your escrow wallet state.',
      receivedAt: 'Just Now'
    }
  ]);
  
  const [deviceLogs, setDeviceLogs] = useState<DeviceLog[]>([
    { id: 'dev_1', name: 'Chrome v114 (Windows 11 PC)', ip: '110.37.158.42', city: 'Lahore', country: 'Pakistan', time: 'Active Session', status: 'Approved', isCurrent: true },
    { id: 'dev_2', name: 'MatchGig App v3.1 (iPhone 14 Pro)', ip: '39.46.223.11', city: 'Rawalpindi', country: 'Pakistan', time: '12 hours ago', status: 'Approved', isCurrent: false },
    { id: 'dev_3', name: 'Android Pixel 8 Pro Mobile SDK', ip: '162.24.99.10', city: 'Karachi', country: 'Pakistan', time: 'June 17, 2026', status: 'Requires Verification', isCurrent: false }
  ]);

  const [loginAlerts, setLoginAlerts] = useState<string[]>([
    'System initialization... Secure Device fingerprint checking activated.'
  ]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (otpSent && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, countdown]);

  const pushAlert = (msg: string) => {
    setLoginAlerts(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev
    ]);
  };

  // Switch tabs
  const handleTabChange = (t: 'email' | 'phone' | 'social') => {
    setActiveTab(t);
    setFormError('');
    setFormSuccess('');
  };

  // SIMULATE SENDING PHONE / REGISTRATION OTP
  const handleSendOtp = () => {
    if (!phoneNumber.trim()) {
      setFormError('Please specfiy a valid phone number format with country code.');
      return;
    }
    setIsBusy(true);
    setFormError('');
    
    setTimeout(() => {
      setIsBusy(false);
      setOtpSent(true);
      setCountdown(60);
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setOtpSentCode(randomCode);
      pushAlert(`Dispatched One-Time PIN (${randomCode}) of device Verification telemetry to: ${phoneNumber}`);
      setFormSuccess(`OTP security code sent successfully to device!`);
      
      // Inject simulated SMS log to client
      const smsEmail: SimulatedEmail = {
        id: 'em_' + Math.random().toString(),
        subject: `🔑 MATCHGIG VERIFICATION CODE: ${randomCode}`,
        body: `Assalam-o-Alaikum! Your MatchGig app security token is: ${randomCode}. Never share this passkey with anyone. Payout security active.`,
        receivedAt: 'Just Now'
      };
      setSimulatedEmails(prev => [smsEmail, ...prev]);
    }, 850);
  };

  // EMAIL & PASSWORD LOGIN ACTION
  const handleEmailLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError('Missing required email or password parameter.');
      return;
    }

    setIsBusy(true);
    setFormError('');
    setFormSuccess('');

    setTimeout(() => {
      setIsBusy(false);
      // Look up pre-seeded or registered users on state local storage
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (matched) {
        pushAlert(`Device matched. User database verification success: @${matched.username}`);
        
        // Multi-Factor check trigger simulation
        if (twoFactorEnabled) {
          setUserPendingMfaId(matched.id);
          const generatedMfaCode = '4242'; // Static token or simulation helper
          setAuthMode('mfa');
          pushAlert(`2FA Active Challenge issued for user @${matched.username}. Enter passcode 4Code "4242".`);
          
          const alertMail: SimulatedEmail = {
            id: 'em_' + Date.now().toString(),
            subject: '👑 MatchGig 2FA Multi-Factor Verification Trigger',
            body: `Assalam-o-Alaikum, ${matched.name}. Your account is protected with Two-Factor Authentication. Please input the passcode '4242' into the portal prompt.`,
            receivedAt: 'Just Now'
          };
          setSimulatedEmails(prev => [alertMail, ...prev]);
        } else {
          // Direct login success
          setFormSuccess(`Successfully authenticated! Welcome back, ${matched.name}.`);
          onLoginSuccess(matched.id);
        }
      } else {
        setFormError('Login rejected! Invalid credentials. Tip: Select one of the demo users on top left or register a fresh custom account.');
        pushAlert(`Unauthorized login attempt rejected for string: ${email}`);
      }
    }, 1000);
  };

  // PHONE OTP LOGIN ACTION
  const handlePhoneLoginVerify = (e: FormEvent) => {
    e.preventDefault();
    if (!otpSent || !otpCode) {
      setFormError('Please request code via SMS OTP dispatch first.');
      return;
    }

    if (otpCode !== otpSentCode) {
      setFormError('Mismatch! The verification code is incorrect. View the latest code in your Simulated Sandbox Inbox panel.');
      return;
    }

    setIsBusy(true);
    setTimeout(() => {
      setIsBusy(false);
      // Try to find if user registered prior with that phone or create instant onboarding
      const userMail = `phone_${phoneNumber.replace(/\+/g, '').replace(/\s/g, '')}@matchgig.com`;
      const matched = users.find(u => u.email === userMail);

      if (matched) {
        pushAlert(`SMS Identity authorized! Restoring session @${matched.username}`);
        onLoginSuccess(matched.id);
      } else {
        // Go to onboarding with filled values
        setOnboardingEmail(userMail);
        setOnboardingPhone(phoneNumber);
        setOnboardingFullName(phoneNumber);
        setAuthMode('onboarding');
        pushAlert(`No registered account found. Moving to Secured Profile Setup Onboarding.`);
      }
    }, 700);
  };

  // INSTANT ONE-TAP GOOGLE SIGN-IN
  const handleGoogleOneTapLogin = (mailChosen: string) => {
    setIsBusy(true);
    setFormError('');
    setFormSuccess('');

    setTimeout(() => {
      setIsBusy(false);
      const targetUser = users.find(u => u.email.toLowerCase() === mailChosen.toLowerCase()) || users[0];
      pushAlert(`Google Sign-In API: One Tap authorization success for user Email: ${mailChosen}`);
      onLoginSuccess(targetUser.id);
    }, 900);
  };

  // FACE ID / APPLE LOGIN SIMULATOR
  const handleTriggerAppleFaceID = () => {
    setIsFaceScanning(true);
    setFaceScanSuccess(false);
    pushAlert(`iOS Webkit: Instantiated Biometric FaceID Scanner request.`);
    
    setTimeout(() => {
      setFaceScanSuccess(true);
      pushAlert(`iOS Webkit Match: Biometric matches Apple Keychain database ID.`);
      
      setTimeout(() => {
        setIsFaceScanning(false);
        setShowAppleIDPanel(false);
        // Login with default premium User (Fatima) or seed
        onLoginSuccess(users[0]?.id || 'user_1');
      }, 900);
    }, 1400);
  };

  // DIRECT REVERSIBLE GUEST ACCESS
  const handleTriggerGuestMode = () => {
    setIsBusy(true);
    pushAlert(`Limited Guest Mode session activated. Creating safe sandbox authorization.`);

    setTimeout(() => {
      setIsBusy(false);
      // Create guest user in current state dynamically
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      const guestUser: UserType = {
        id: guestId,
        username: 'guest_' + Math.random().toString(36).substring(2, 6),
        name: 'Guest MatchGig Explorer',
        email: 'guest@matchgig-sandbox.com',
        avatar: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&q=80&w=200',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
        role: 'Regular',
        bio: 'Anonymous limited Guest view. Registered credentials required for verified coin wallet withdrawals.',
        skills: ['Browsing', 'Support Test'],
        city: 'Guest City',
        country: 'Worldwide',
        coins: 100, // Safe starter coin amount for sandbox testing
        rating: 5,
        completedJobs: 0,
        badge: 'None',
        experiences: [],
        portfolio: [],
        subscription: 'Free'
      };

      const updated = [...users, guestUser];
      onUpdateUsers(updated);
      onLoginSuccess(guestUser.id);
    }, 600);
  };

  // 2FA VERIFICATION CONFIRMATION
  const handleVerifyTwoFactorPrompt = (e: FormEvent) => {
    e.preventDefault();
    if (mfaSubmittedCode === '4242' && userPendingMfaId) {
      pushAlert(`MFA authentication verification matches standard hash.`);
      onLoginSuccess(userPendingMfaId);
    } else {
      setFormError('Incorrect 2FA authenticator token sequence code. Enter "4242" to simulate.');
    }
  };

  // NEW USER ACTIONS (CREATE ACCOUNT & SMART ONBOARDING FLOW)
  const handleCreateAccountSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!regName || !regUsername || !regEmailOrPhone || !regPassword) {
      setFormError('کی برائے مہربانی تمام مطلوبہ معلومات درج کریں (Please enter all required information.)');
      return;
    }

    const cleanUsername = regUsername.trim().toLowerCase().replace('@', '');
    if (users.some(u => u.username === cleanUsername)) {
      setFormError(`یہ یوزر نیم @${cleanUsername} پہلے سے موجود ہے۔ مختلف منتخب کریں۔ (Username already taken.)`);
      return;
    }

    setIsBusy(true);
    setFormError('');
    setFormSuccess('');

    setTimeout(() => {
      setIsBusy(false);
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setRegOtpSentCode(generatedCode);
      pushAlert(`Secured account draft registration initiated. OTP generated: ${generatedCode}`);
      setFormSuccess(`ہم نے آپ کے نمبر یا ای میل پر او ٹی پی بھیج دیا ہے۔ (OTP verification code sent to ${regEmailOrPhone}!)`);
      
      const otpMail: SimulatedEmail = {
        id: 'em_signup_otp_' + Date.now().toString(),
        subject: `🔑 MatchGig Signup Code: ${generatedCode}`,
        body: `Assalam-o-Alaikum, ${regName}! Use code ${generatedCode} to verify your brand-new MatchGig profile secure credentials.`,
        receivedAt: 'Just Now'
      };
      setSimulatedEmails(prev => [otpMail, ...prev]);
      setAuthMode('otp_signup');
    }, 700);
  };

  const handleVerifySignupOtp = (e: FormEvent) => {
    e.preventDefault();
    if (regOtp !== regOtpSentCode && regRegOtpBackdoor(regOtp)) {
      setFormError('درج کردہ او ٹی پی غلط ہے۔ برائے مہربانی صحیح کوڈ لکھیں۔ (Incorrect OTP setup code.)');
      return;
    }

    setIsBusy(true);
    setFormError('');
    setFormSuccess('');

    setTimeout(() => {
      setIsBusy(false);
      // Pre-fill parameters for Profile setup
      setOnboardingFullName(regName);
      setOnboardingUsername(regUsername.trim().toLowerCase().replace('@', ''));
      if (regEmailOrPhone.includes('@')) {
        setOnboardingEmail(regEmailOrPhone);
        setOnboardingPhone('+92 300 4567891');
      } else {
        setOnboardingEmail(`${regUsername}@matchgig.com`);
        setOnboardingPhone(regEmailOrPhone);
      }
      // If client picked Creator but it maps to Regular or Freelancer
      const mappedRole: UserRole = regRole === 'Creator' ? 'Freelancer' : regRole;
      setOnboardingRole(mappedRole);
      
      pushAlert(`Email/Phone OTP Token approved with credentials.`);
      setFormSuccess('او ٹی پی کامیابی سے تصدیق کر لیا گیا۔ (OTP successfully verified! Setup your smart profile now.)');
      setAuthMode('smart_onboarding');
    }, 600);
  };

  const regRegOtpBackdoor = (otpValue: string) => {
    return otpValue !== '7860'; // backdoor shortcut for developer preview
  };

  const handleSmartOnboardingSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    setIsBusy(true);
    setFormError('');
    
    setTimeout(() => {
      setIsBusy(false);
      const targetUsername = onboardingUsername.trim().toLowerCase().replace('@', '') || regUsername.trim().toLowerCase().replace('@', '');
      
      const targetRole: UserRole = onboardingRole;
      
      // Save selected smart goal to localStorage for personalized dashboard highlights
      localStorage.setItem('matchgig_onboarding_goal', regSmartGoal);
      
      const customUser: UserType = {
        id: 'user_u' + Math.random().toString(36).substring(2, 8),
        username: targetUsername,
        name: onboardingFullName.trim() || regName || 'MatchGig Partner',
        email: onboardingEmail.trim() || `${targetUsername}@matchgig.com`,
        avatar: onboardingAvatar,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
        role: targetRole,
        bio: onboardingBio || `Dedicated to: ${regSmartGoal}. Proudly serving the MatchGig social & freelance community.`,
        skills: onboardingSkills.length > 0 ? onboardingSkills : ['Graphic Design'],
        city: 'Lahore',
        country: onboardingCountry,
        coins: targetRole === 'Client' ? 1200 : 350,
        rating: 5,
        completedJobs: targetRole === 'Freelancer' ? 1 : 0,
        badge: targetRole === 'Freelancer' ? 'Creator' : 'Verified',
        experiences: targetRole === 'Freelancer' ? [{ company: 'MatchGig', role: 'Elite Freelancer', duration: 'Start' }] : [],
        portfolio: [],
        subscription: 'Free'
      };

      const revisedList = [...users, customUser];
      onUpdateUsers(revisedList);
      pushAlert(`Smart onboarding complete! Logged in as: @${customUser.username} [Goal: ${regSmartGoal}]`);
      onLoginSuccess(customUser.id);
    }, 1000);
  };

  // EMAIL RESET LINK CODE SIMULATOR
  const handlePasswordResetSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsBusy(true);
    setTimeout(() => {
      setIsBusy(false);
      setFormSuccess('Simulated recovery password link has been dispatched to your mailbox. Take check of the Simulated Mailbox panel.');
      const resetLink = `https://matchgig.com/reset-password?token=mg_sand_token_${Math.floor(100000 + Math.random() * 900000)}`;
      
      const resetMail: SimulatedEmail = {
        id: 'em_reset_' + Date.now().toString(),
        subject: '🔐 MatchGig Password Reset Key',
        body: `Assalam-o-Alaikum! We received a proposal to adjust your MatchGig credential passkey password. Click validation route linkage to reset it: ${resetLink}`,
        receivedAt: 'Just Now',
        verificationLink: resetLink
      };
      setSimulatedEmails(prev => [resetMail, ...prev]);
    }, 800);
  };

  // ONBOARDING SIGN-UP FORM ACTION
  const handleOnboardingSignupSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const targetUsername = onboardingUsername.trim().toLowerCase().replace('@', '');
    if (!targetUsername) {
      setFormError('Username has formatting discrepancies.');
      return;
    }

    if (users.some(u => u.username === targetUsername)) {
      setFormError('Username tag already taken. Choose an alternative.');
      return;
    }

    setIsBusy(true);
    setTimeout(() => {
      setIsBusy(false);
      
      const customUser: UserType = {
        id: 'user_u' + Math.random().toString(36).substring(2, 8),
        username: targetUsername,
        name: onboardingFullName.trim() || 'MatchGig Creator',
        email: onboardingEmail.trim() || `${targetUsername}@matchgig.com`,
        avatar: onboardingAvatar,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
        role: onboardingRole,
        bio: onboardingBio || 'MatchGig creator and consultant.',
        skills: onboardingSkills.length > 0 ? onboardingSkills : ['Graphic Design'],
        city: 'Lahore',
        country: onboardingCountry,
        coins: onboardingRole === 'Client' ? 1200 : 350,
        rating: 5,
        completedJobs: onboardingRole === 'Freelancer' ? 1 : 0,
        badge: onboardingRole === 'Freelancer' ? 'Creator' : 'Verified',
        experiences: onboardingRole === 'Freelancer' ? [{ company: 'MatchGig', role: 'Elite Creator', duration: '1 Year' }] : [],
        portfolio: [],
        subscription: 'Free'
      };

      const revisedList = [...users, customUser];
      onUpdateUsers(revisedList);
      pushAlert(`Secured registration completed! Welcome, ${customUser.name}`);
      onLoginSuccess(customUser.id);
    }, 1200);
  };

  // UTILITY HELPER
  const toggleSkillTag = (tag: string) => {
    if (onboardingSkills.includes(tag)) {
      setOnboardingSkills(prev => prev.filter(t => t !== tag));
    } else {
      setOnboardingSkills(prev => [...prev, tag]);
    }
  };

  // DEVICE MANAGER ACTION: BLOCK / LOG OUT DEVICE
  const handleDeviceAction = (deviceId: string, action: 'block' | 'approve') => {
    setDeviceLogs(prev => prev.map(d => {
      if (d.id === deviceId) {
        return { 
          ...d, 
          status: action === 'block' ? 'Blocked' : 'Approved' 
        };
      }
      return d;
    }));
    pushAlert(`Device telemetry altered: Device ID ${deviceId} set to status: ${action.toUpperCase()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-neutral-200" id="auth-simulator-container">
      
      {/* Simulation Header Indicators */}
      <div className="text-center space-y-4 mb-8">
        <span className="text-xs font-mono font-black py-1 px-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-full tracking-widest uppercase inline-block">
          🔐 SECURE SECURITY LOBBY & PLATFORM SIMULATOR
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Establish Identity on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-500">MatchGig</span>
        </h2>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Experience our robust multi-platform authentication client. Toggle between smartphone mockups and classic browser sign-ins to test our sandboxed OTPs, FaceID codes, password reset mechanics, and secure device registries.
        </p>

        {/* TOP LEVEL REAL-TIME TEST ACCOUNTS FOR EASY NAVIGATION */}
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block mb-2 font-black">
            ⚡ Quick-Jump Simulated Active Profiles:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {users.slice(0, 4).map((usr) => (
              <button
                key={usr.id}
                onClick={() => {
                  pushAlert(`Quick Bypass: Instantly restoring identity of @${usr.username}`);
                  onLoginSuccess(usr.id);
                }}
                className="bg-neutral-900 hover:bg-neutral-850 hover:border-amber-500/40 p-2 rounded-xl border border-neutral-800 transition flex items-center space-x-2 text-left"
              >
                <img src={usr.avatar} alt={usr.name} className="w-6 h-6 rounded-md object-cover" />
                <div>
                  <span className="text-[10px] block font-extrabold text-white leading-none">@{usr.username}</span>
                  <span className="text-[8px] font-mono text-neutral-500 leading-none">{usr.role}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PLATFORM SELECTOR TABS ACCENTS */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => { setPlatform('web'); setAuthMode('login'); }}
            className={`px-4 py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl border transition flex items-center space-x-2 ${
              platform === 'web' 
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-extrabold shadow-lg' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>🌐 Web Browser Portal</span>
          </button>

          <button
            onClick={() => { setPlatform('android'); setAuthMode('login'); }}
            className={`px-4 py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl border transition flex items-center space-x-2 ${
              platform === 'android' 
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-extrabold shadow-lg' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#00e676]" />
            <span>📱 Android App</span>
          </button>

          <button
            onClick={() => { setPlatform('ios'); setAuthMode('login'); }}
            className={`px-4 py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl border transition flex items-center space-x-2 ${
              platform === 'ios' 
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-extrabold shadow-lg' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>🍏 iPhone (iOS) App</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE INTERACTIVE AUTH PLATFORM SCREEN DESIGN MOCKUPS */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-neutral-900/60 border border-neutral-850 p-4 sm:p-6 rounded-3xl relative overflow-hidden backdrop-blur-md">
            
            {/* PLATFORM CASING GRAPHICS HEADER */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-indigo-400">
                  {platform === 'web' && <Monitor className="w-5 h-5" />}
                  {platform === 'android' && <Smartphone className="w-5 h-5 text-[#00e676]" />}
                  {platform === 'ios' && <Smartphone className="w-5 h-5 text-purple-400" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {platform === 'web' && "MatchGig Client Web Portal v2.6"}
                    {platform === 'android' && "MatchGig-Android client application v4.1"}
                    {platform === 'ios' && "MatchGig Native iOS App Core v4.1"}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    {platform === 'web' && "HTTPS HOST: localhost:3000 // SECURE SSL GATEWAY"}
                    {platform === 'android' && "Google Firebase WebAuth + Gradle Android Bundle"}
                    {platform === 'ios' && "iOS Apple ID Auth & Keychain Enclave Biometrics"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] uppercase font-mono text-neutral-400 font-extrabold">Active Stream</span>
              </div>
            </div>

            {/* ERROR / SUCCESS ALERTS IN APPLICATION VIEW */}
            {formError && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-800 rounded-2xl flex items-center space-x-2.5 text-left text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-900 rounded-2xl flex items-center space-x-2.5 text-left text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* SUB-STATE: ONE-TAP GOOGLE DIALOG ON MOBILE DEVICE DISPLAY */}
            {platform === 'android' && showOneTap && authMode === 'login' && (
              <div className="p-4 mb-4 bg-gradient-to-r from-neutral-950 to-neutral-900 border border-indigo-500/20 rounded-2xl text-left space-y-3 relative overflow-hidden animate-slideUp">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google logo" className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-mono font-bold text-neutral-400">Google One Tap Authorization</span>
                  </div>
                  <button 
                    onClick={() => setShowOneTap(false)} 
                    className="p-1 text-neutral-500 hover:text-white transition rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-extrabold text-white">Sign in with Google to MatchGig</h4>
                <p className="text-[10px] text-neutral-400">Choose a default Google profile credential to connect with Pakistan’s primary MatchGig freelance platform instantly.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleGoogleOneTapLogin('fatima.designer@gmail.com')}
                    className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-800 transition flex items-center space-x-2.5 text-left"
                  >
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Fatima" className="w-7 h-7 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold text-white block truncate leading-none">fatima.designer</span>
                      <span className="text-[9px] text-neutral-500 block truncate leading-none">fatima.designer@gmail.com</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoogleOneTapLogin('imran.contracts@gmail.com')}
                    className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-800 transition flex items-center space-x-2.5 text-left"
                  >
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Imran" className="w-7 h-7 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold text-white block truncate leading-none">imran.contracts</span>
                      <span className="text-[9px] text-neutral-500 block truncate leading-none">imran.contracts@gmail.com</span>
                    </div>
                  </button>
                </div>
                <div className="text-[8px] text-right font-mono text-neutral-500 hover:underline cursor-pointer">
                  Manage Google Account telemetry
                </div>
              </div>
            )}

            {/* VIEW MODE: MULTI-PLATFORM AUTH STATES */}

            {authMode === 'welcome' && (
              <div className="space-y-8 py-6 text-center max-w-lg mx-auto animate-fadeIn">
                <div className="space-y-2">
                  <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-amber-500">
                    MATCHGIG
                  </h1>
                  <p className="text-sm font-semibold tracking-wider text-neutral-400 font-sans uppercase">
                    Connect • Create • Earn
                  </p>
                  <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                    رابطہ کریں • تخلیق کریں • کمائیں - پاکستان کا سب سے بڑا فری لانس اور سوشل میڈیا پلیٹ فارم
                  </p>
                </div>

                <div className="space-y-3.5 pt-6 max-w-sm mx-auto">
                  <button
                    onClick={() => {
                      setFormError('');
                      setFormSuccess('');
                      setAuthMode('login');
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 border border-indigo-500/30"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>🔹 Login (لاگ ان کریں)</span>
                  </button>

                  <button
                    onClick={() => {
                      setRegName('');
                      setRegUsername('');
                      setRegEmailOrPhone('');
                      setRegPassword('');
                      setFormError('');
                      setFormSuccess('');
                      setAuthMode('signup');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-indigo-700/60 to-purple-600/60 hover:from-indigo-600 hover:to-purple-500 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 border border-indigo-500/30"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>🔹 Create Account (اکاؤنٹ بنائیں)</span>
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-neutral-800"></div>
                    <span className="relative z-10 px-3.5 bg-neutral-900/90 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">or continue with</span>
                  </div>

                  <button
                    onClick={() => handleGoogleOneTapLogin('fatima.designer@matchgig.com')}
                    className="w-full py-3 bg-white hover:bg-neutral-100 text-neutral-900 font-extrabold rounded-2xl text-xs transition duration-300 flex items-center justify-center space-x-2.5 border border-neutral-200 shadow"
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google" className="w-4 h-4" />
                    <span>🔹 Continue with Google</span>
                  </button>

                  <button
                    onClick={() => setShowAppleIDPanel(true)}
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold rounded-2xl text-xs border border-neutral-800 transition duration-300 flex items-center justify-center space-x-2.5"
                  >
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.06 1.005 1.45 2.176 3.064 3.743 3.003 1.51-.061 2.083-.974 3.905-.974 1.815 0 2.35.974 3.921.94 1.6-.03 2.636-1.464 3.616-2.894 1.134-1.656 1.603-3.253 1.63-3.336-.057-.025-3.136-1.201-3.167-4.78-.027-2.985 2.45-4.417 2.56-4.484-1.402-2.043-3.564-2.274-4.321-2.336-1.921-.153-3.481 1.011-4.486 1.011zm2.355-3.987c.801-.98 1.34-2.342 1.192-3.704-1.168.048-2.585.779-3.42 1.761-.75.864-1.405 2.25-1.221 3.585 1.3.102 2.637-.643 3.449-1.642z"/>
                    </svg>
                    <span>🔹 Continue with Apple</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('phone');
                      setAuthMode('login');
                    }}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 font-extrabold rounded-2xl text-xs border border-neutral-800 transition duration-300 flex items-center justify-center space-x-2.5"
                  >
                    <Smartphone className="w-4 h-4 text-[#00e676]" />
                    <span>🔹 Continue with Phone Number</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-neutral-850 text-[10px] text-neutral-500 font-mono uppercase">
                  🇵🇰 MatchGig Secure Sandbox Verification Lobby
                </div>
              </div>
            )}

            {authMode === 'signup' && (
              <div className="space-y-6 text-left max-w-md mx-auto animate-fadeIn">
                <div className="space-y-1.5 text-center">
                  <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider">
                    NEW REGISTRATION
                  </span>
                  <h3 className="text-xl font-black text-white">Create Account (نیا اکاؤنٹ بنائیں)</h3>
                  <p className="text-xs text-neutral-400">Join Pakistan's premier creator workspace. Setup in minutes.</p>
                </div>

                <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">نام (Full Name)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bilal Ahmed"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Username (یوزر نیم)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">@</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. bilal_design"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 pl-7 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Email or Phone Number (ای میل یا فون نمبر)</label>
                    <input
                      type="text"
                      required
                      placeholder="babilal@gmail.com or +92 300 4567891"
                      value={regEmailOrPhone}
                      onChange={(e) => setRegEmailOrPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Password (پاس ورڈ)</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter a secure password passkey"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* USER TYPES / ROLES CHOICE */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">My Primary Role Type (رول منتخب کریں)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['Regular', 'Freelancer', 'Creator', 'Client'] as const).map((roleVal) => (
                        <button
                          key={roleVal}
                          type="button"
                          onClick={() => setRegRole(roleVal)}
                          className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition text-center flex flex-col items-center justify-center gap-1 ${
                            regRole === roleVal
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-extrabold shadow'
                              : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="text-sm">
                            {roleVal === 'Regular' && '👤'}
                            {roleVal === 'Freelancer' && '💼'}
                            {roleVal === 'Creator' && '🎨'}
                            {roleVal === 'Client' && '🏢'}
                          </span>
                          <span className="leading-none text-[9px]">
                            {roleVal === 'Regular' && 'Regular'}
                            {roleVal === 'Freelancer' && 'Freelancer'}
                            {roleVal === 'Creator' && 'Creator'}
                            {roleVal === 'Client' && 'Client / Biz'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-2"
                  >
                    <span>اکاؤنٹ بنائیں & او ٹی پی حاصل کریں</span>
                    <span>→</span>
                  </button>
                </form>

                <div className="pt-4 border-t border-neutral-850 flex justify-between items-center text-xs">
                  <span className="text-neutral-500">پہلے سے اکاؤنٹ موجود ہے؟</span>
                  <button onClick={() => setAuthMode('login')} className="text-indigo-400 hover:underline font-bold">
                    لاگ ان کریں (Login here)
                  </button>
                </div>
              </div>
            )}

            {authMode === 'otp_signup' && (
              <div className="space-y-6 text-center max-w-sm mx-auto animate-fadeIn">
                <div className="space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-white">او ٹی پی کی تصدیق (OTP Verification)</h3>
                  <p className="text-xs text-neutral-400 leading-normal">
                    ہم نے آپ کے فراہم کردہ پتے <strong className="text-indigo-400">{regEmailOrPhone}</strong> پر کوڈ بھیجا ہے۔
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    Please lookup under Simulated Mailbox card on the right for passcode! (Or enter backup shortcut '7860')
                  </p>
                </div>

                <form onSubmit={handleVerifySignupOtp} className="space-y-4">
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="او ٹی پی کوڈ درج کریں"
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-805 rounded-xl p-3 text-center text-lg font-mono tracking-widest text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-[#00e676] text-neutral-950 font-extrabold uppercase rounded-xl text-xs tracking-wider transition hover:opacity-90 flex items-center justify-center space-x-2"
                  >
                    {isBusy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>کوڈ ویریفائی کریں (Verify Code)</span>
                  </button>
                </form>

                <div className="pt-2 flex justify-between items-center text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
                      setRegOtpSentCode(generatedCode);
                      pushAlert(`SMS/Email OTP Resent: ${generatedCode}`);
                      const resendMail: SimulatedEmail = {
                        id: 'em_signup_otp_' + Date.now().toString(),
                        subject: `🔑 MatchGig Signup Code Resend: ${generatedCode}`,
                        body: `Assalam-o-Alaikum! Your resent OTP code is ${generatedCode}. Enter this into the active signup box.`,
                        receivedAt: 'Just Now'
                      };
                      setSimulatedEmails(prev => [resendMail, ...prev]);
                      setFormSuccess('نیا او ٹی پی کوڈ روانہ کر دیا گیا ہے۔ (New OTP code resent successfully!)');
                    }}
                    className="text-indigo-400 hover:underline"
                  >
                    Resend Code (دوبارہ بھیجیں)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-neutral-500 hover:text-white"
                  >
                    ← Back / Change details
                  </button>
                </div>
              </div>
            )}

            {authMode === 'smart_onboarding' && (
              <div className="space-y-6 text-left max-w-xl mx-auto animate-fadeIn">
                <div className="space-y-1.5 text-center">
                  <span className="text-[10px] bg-amber-500/15 text-amber-500 font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-widest inline-block">
                    Smart Onboarding (اسمارٹ آن بورڈنگ)
                  </span>
                  <h3 className="text-2xl font-black text-white">آپ MatchGig پر کیا کرنا چاہتے ہیں؟</h3>
                  <p className="text-xs text-neutral-400 leading-normal">
                    What is your primary goal on MatchGig? We will personalize your platform workspace and customized feeds immediately.
                  </p>
                </div>

                <form onSubmit={handleSmartOnboardingSubmit} className="space-y-5">
                  {/* Goal choices cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { goal: 'Earn Money', title: '💰 Earn Money (پیسے کمائیں)', desc: 'Deliver top quality freelance gigs, stream projects, and earn coins directly.' },
                      { goal: 'Hire Talent', title: '🤝 Hire Talent (ٹینلٹ ہائر کریں)', desc: 'Commission elite Pakistani creators, freelancers and design specialists.' },
                      { goal: 'Promote Skills', title: '🎨 Promote Skills (مہارتیں پروموٹ کریں)', desc: 'Publish outstanding portfolios, broadcast screen streams, raise visibility.' },
                      { goal: 'Grow Audience', title: '📈 Grow Audience (آڈینس بڑھائیں)', desc: 'Build streaming views, interact, receive amazing gifts from dedicated fans.' }
                    ].map((item) => (
                      <button
                        key={item.goal}
                        type="button"
                        onClick={() => {
                          setRegSmartGoal(item.goal as any);
                          pushAlert(`Selected Smart Goal: ${item.goal}`);
                        }}
                        className={`p-4 rounded-xl border text-left transition duration-300 relative select-none ${
                          regSmartGoal === item.goal
                            ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-505/30'
                            : 'bg-neutral-950 border-neutral-850 text-neutral-300 hover:bg-neutral-900/60'
                        }`}
                      >
                        <div className="font-bold text-xs mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-200">
                          {item.title}
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                          {item.desc}
                        </p>
                        {regSmartGoal === item.goal && (
                          <span className="absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5 text-white">
                            <CheckCircle2 className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Profile Preset Avatar Customization Step built in */}
                  <div className="space-y-2 pt-2 border-t border-neutral-850">
                    <label className="text-[10px] font-mono uppercase font-black text-neutral-400 block">
                      Choose Your Portrait Avatar (پروفائل تصویر منتخب کریں)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {AVATAR_PRESETS.map((avatarItem, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setOnboardingAvatar(avatarItem.url);
                          }}
                          className={`p-1 bg-neutral-950 border rounded-xl overflow-hidden transition relative ${
                            onboardingAvatar === avatarItem.url ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <img src={avatarItem.url} alt={avatarItem.label} className="w-full h-10 rounded object-cover" />
                          <div className="text-[7.5px] truncate mt-1 text-center text-neutral-400">{avatarItem.label}</div>
                          {onboardingAvatar === avatarItem.url && (
                            <span className="absolute top-1 right-1 bg-amber-500 rounded-full p-0.5 text-neutral-950">
                              <CheckCircle2 className="w-2 h-2" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profile bio input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Display Bio (مختصر تعارف)</label>
                      <input
                        type="text"
                        value={onboardingBio}
                        onChange={(e) => setOnboardingBio(e.target.value)}
                        placeholder="Tell the community about your expertise..."
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Select Platform Role Type</label>
                      <select
                        value={onboardingRole}
                        onChange={(e) => setOnboardingRole(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-xs text-white font-sans focus:border-indigo-500"
                      >
                        <option value="Regular">Regular User</option>
                        <option value="Freelancer">Freelancer Mode</option>
                        <option value="Client">Client Mode (1200 bonus coins)</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills picker */}
                  <div className="space-y-2 pt-2 border-t border-neutral-850">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">Select Skillsets (مہارتیں سلیکٹ کریں)</label>
                    <div className="flex flex-wrap gap-1">
                      {SKILL_POTENTIALS.map((sku) => {
                        const containsTag = onboardingSkills.includes(sku);
                        return (
                          <button
                            key={sku}
                            type="button"
                            onClick={() => toggleSkillTag(sku)}
                            className={`px-2.5 py-1 text-[9px] font-mono rounded border transition ${
                              containsTag
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                                : 'bg-neutral-950 border-neutral-850 text-neutral-500 hover:text-white'
                            }`}
                          >
                            {containsTag ? `✓ ${sku}` : `+ ${sku}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-amber-500 hover:opacity-95 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>لاگ ان ہوں اور بونس کوائنز حاصل کریں (Finish Setup & Login)</span>
                    <span>✓</span>
                  </button>

                  <div className="text-center font-mono text-[9px] text-neutral-500 uppercase">
                    By confirming, you will register @{onboardingUsername} with {onboardingRole === 'Client' ? '1200' : '350'} complimentary test wallet coins!
                  </div>
                </form>
              </div>
            )}

            {authMode === 'login' && (
              <div className="space-y-6">
                
                {/* Method switcher bar within platform view */}
                <div className="flex border-b border-neutral-850 pb-2 gap-4">
                  <button
                    onClick={() => handleTabChange('email')}
                    className={`pb-2 text-xs uppercase font-bold tracking-wider font-mono transition-all ${
                      activeTab === 'email' ? 'text-indigo-400 border-b-2 border-indigo-500 font-extrabold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    📧 Email & Pass
                  </button>

                  <button
                    onClick={() => handleTabChange('phone')}
                    className={`pb-2 text-xs uppercase font-bold tracking-wider font-mono transition-all ${
                      activeTab === 'phone' ? 'text-indigo-400 border-b-2 border-indigo-500 font-extrabold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    📞 Phone SMS OTP
                  </button>

                  <button
                    onClick={() => handleTabChange('social')}
                    className={`pb-2 text-xs uppercase font-bold tracking-wider font-mono transition-all ${
                      activeTab === 'social' ? 'text-indigo-400 border-b-2 border-indigo-500 font-extrabold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ✨ Social Integrations
                  </button>
                </div>

                {/* EMAIL OR PHONE RENDER METHODS */}
                {activeTab === 'email' && (
                  <form onSubmit={handleEmailLoginSubmit} className="space-y-4 max-w-md mx-auto text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-400">Account Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
                        <input
                          type="email"
                          required
                          placeholder="fatima@matchgig.com or imran@matchgig.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-400">Password</label>
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot_password')}
                          className="text-[10px] text-indigo-400 hover:underline font-mono"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Your account passkey (e.g. fatima or imran)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3 top-3 px-1 text-neutral-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* TWO-FACTOR TOGGLE FOR DEMONSTRATION */}
                    <div className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-850 rounded-2xl">
                      <div className="flex items-center space-x-2.5">
                        <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-extrabold text-white block leading-none mb-1">Simulate Two Factor Security (2FA)</span>
                          <span className="text-[9px] text-neutral-400 block font-mono">Forces "4242" entry checks before allowing dashboard sessions</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none border border-neutral-800 ${
                          twoFactorEnabled ? 'bg-indigo-600' : 'bg-neutral-900'
                        }`}
                      >
                        <span className={`absolute top-0.5 left-0.5 block w-4 h-4 rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? 'translate-x-[18px]' : 'translate-x-0'
                        }`}></span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isBusy}
                      className="w-full py-3 bg-indigo-600 hover:bg-teal-500 hover:text-neutral-950 text-white font-extrabold uppercase rounded-xl text-xs tracking-wider transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      {isBusy ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <LogIn className="w-4.5 h-4.5" />}
                      <span>Authorize Secure Web Session</span>
                    </button>
                  </form>
                )}

                {activeTab === 'phone' && (
                  <div className="space-y-4 max-w-md mx-auto text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-400">Mobile Phone Number</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
                          <input
                            type="tel"
                            required
                            placeholder="+92 300 4567891"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-neutral-600 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isBusy || (otpSent && countdown > 0)}
                          className="px-4 bg-neutral-950 border border-neutral-800 hover:border-[#00e676] text-[#00e676] rounded-xl text-xs font-mono transition disabled:opacity-50 font-bold"
                        >
                          {otpSent && countdown > 0 ? `Retry (${countdown}s)` : 'Send OTP'}
                        </button>
                      </div>
                    </div>

                    {otpSent && (
                      <form onSubmit={handlePhoneLoginVerify} className="space-y-4 animate-fadeIn">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-400">SMS Verification Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="Type numerical code received (Look in Simulated Mailbox)..."
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isBusy}
                          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-[#00e676] text-neutral-950 font-extrabold uppercase rounded-xl text-xs tracking-wider transition hover:opacity-90 flex items-center justify-center space-x-2"
                        >
                          {isBusy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                          <span>Authorize Phone Identity</span>
                        </button>
                      </form>
                    )}

                    <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-2xl mt-4">
                      <span className="text-[9px] font-mono uppercase text-neutral-500 block leading-none mb-1">Sandbox Helper Notice:</span>
                      <p className="text-[10px] text-neutral-400 leading-normal">
                        MatchGig supports multi-platform biometric identity checks. If your account is already linked to your phone, we will instantly restore your profile! If new, we'll guide you to pick your country and skillset tags.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-3 max-w-sm mx-auto">
                    <p className="text-center text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-2">Simulate Third-party Authorization Protocols</p>
                    
                    {/* Google OAuth */}
                    <button
                      type="button"
                      onClick={() => handleGoogleOneTapLogin('fatima.designer@matchgig.com')}
                      className="w-full py-3 bg-white hover:bg-neutral-100 text-neutral-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-2.5 border border-neutral-200"
                    >
                      <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google logo" className="w-4 h-4" />
                      <span>Connect with Google Account</span>
                    </button>

                    {/* Apple ID Platform */}
                    <button
                      type="button"
                      onClick={() => setShowAppleIDPanel(true)}
                      className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold text-xs rounded-xl border border-neutral-800 transition flex items-center justify-center space-x-2.5"
                    >
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.06 1.005 1.45 2.176 3.064 3.743 3.003 1.51-.061 2.083-.974 3.905-.974 1.815 0 2.35.974 3.921.94 1.6-.03 2.636-1.464 3.616-2.894 1.134-1.656 1.603-3.253 1.63-3.336-.057-.025-3.136-1.201-3.167-4.78-.027-2.985 2.45-4.417 2.56-4.484-1.402-2.043-3.564-2.274-4.321-2.336-1.921-.153-3.481 1.011-4.486 1.011zm2.355-3.987c.801-.98 1.34-2.342 1.192-3.704-1.168.048-2.585.779-3.42 1.761-.75.864-1.405 2.25-1.221 3.585 1.3.102 2.637-.643 3.449-1.642z"/>
                      </svg>
                      <span>Authorize Sign In with Apple</span>
                    </button>

                    {/* Optional Facebook Login */}
                    <button
                      type="button"
                      onClick={() => {
                        pushAlert(`Facebook OAuth Simulation: Connected safely.`);
                        onLoginSuccess('user_3');
                      }}
                      className="w-full py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-2.5"
                    >
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Facebook Integration (Optional)</span>
                    </button>

                    {/* LIMITED GUEST ACCESS ACTION */}
                    <div className="pt-4 border-t border-neutral-850 mt-4 text-center">
                      <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-2">Want to browse immediately without credentials?</span>
                      <button
                        type="button"
                        onClick={handleTriggerGuestMode}
                        className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 hover:text-[#00e676] text-neutral-400 text-[10px] font-mono font-bold rounded-xl border border-neutral-800 transition"
                      >
                        ⚡ Enter Guest Mode (Limited Access)
                      </button>
                    </div>

                  </div>
                )}

                {/* BOTTOM LINK TO SIGN UP REDIRECT ROUTING */}
                <div className="pt-4 border-t border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-neutral-400">
                  <button
                    onClick={() => setAuthMode('welcome')}
                    className="text-neutral-500 hover:text-white transition duration-200"
                  >
                    ← Back to Welcome Lobby (واپس جائیں)
                  </button>
                  <button
                    onClick={() => {
                      setRegName('');
                      setRegUsername('');
                      setRegEmailOrPhone('');
                      setRegPassword('');
                      setAuthMode('signup');
                    }}
                    className="text-indigo-400 hover:underline font-bold"
                  >
                    Create Account (نیا اکاؤنٹ بنائیں)
                  </button>
                </div>

              </div>
            )}


            {/* STATE 2: APPLE FACE ID PROCESS PANEL ON iOS DEVICES */}
            {showAppleIDPanel && (
              <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-70 flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl max-w-sm w-full text-center space-y-6 animate-slideUp">
                  
                  {/* Apple System Box Header */}
                  <div className="flex items-center justify-center space-x-1">
                    <svg className="w-5 h-5 fill-current text-neutral-400" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.06 1.005 1.45 2.176 3.064 3.743 3.003 1.51-.061 2.083-.974 3.905-.974 1.815 0 2.35.974 3.921.94 1.6-.03 2.636-1.464 3.616-2.894 1.134-1.656 1.603-3.253 1.63-3.336-.057-.025-3.136-1.201-3.167-4.78-.027-2.985 2.45-4.417 2.56-4.484-1.402-2.043-3.564-2.274-4.321-2.336-1.921-.153-3.481 1.011-4.486 1.011zm2.355-3.987c.801-.98 1.34-2.342 1.192-3.704-1.168.048-2.585.779-3.42 1.761-.75.864-1.405 2.25-1.221 3.585 1.3.102 2.637-.643 3.449-1.642z"/>
                    </svg>
                    <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 font-bold">Sign In with Apple ID</span>
                  </div>

                  {/* Face ID animation mockups */}
                  <div className="py-4 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl bg-neutral-950 border-2 text-indigo-400 flex items-center justify-center ${
                        isFaceScanning ? 'animate-pulse border-indigo-500 text-indigo-400' : 'border-neutral-800 text-neutral-500'
                      }`}>
                        <Fingerprint className="w-10 h-10" />
                      </div>
                      
                      {isFaceScanning && (
                        <span className="absolute inset-0 border border-emerald-500 rounded-2xl animate-ping opacity-60"></span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-white">Apple Secure Enclave Biometrics</h4>
                      <p className="text-xs text-neutral-400 mt-1">Scan FaceID credentials to authorize secure platform login sequence.</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      type="button"
                      onClick={handleTriggerAppleFaceID}
                      disabled={isFaceScanning}
                      className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
                    >
                      {isFaceScanning ? "Simulating FaceID camera..." : "Trigger FaceID Scan"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowAppleIDPanel(false)}
                      className="py-2 text-neutral-500 hover:text-white text-[11px] font-mono hover:underline"
                    >
                      Bypass & Cancel
                    </button>
                  </div>

                </div>
              </div>
            )}


            {/* STATE 3: TWO FACTOR AUTH (MFA) OTP SCREEN PROMPT */}
            {authMode === 'mfa' && (
              <div className="max-w-md mx-auto text-left space-y-4 animate-fadeIn">
                <div className="text-center space-y-2 mb-4">
                  <div className="mx-auto w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">Two-Factor Authentication (2FA) Code</h4>
                  <p className="text-xs text-neutral-400">
                    Your MatchGig profile is hardened with 2FA protocol layers. Retrieve the secure pin from your simulated mailbox panel.
                  </p>
                </div>

                <form onSubmit={handleVerifyTwoFactorPrompt} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase font-extrabold">Enter Authenticator Security Token</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter verification pin (Default '4242')"
                      value={mfaSubmittedCode}
                      onChange={(e) => setMfaSubmittedCode(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center text-sm font-mono tracking-widest text-white focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white text-xs font-bold uppercase rounded-xl tracking-wider hover:opacity-90 transition"
                  >
                    Confirm & Authorize Device Fingerprint
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full py-2 text-[10px] font-mono text-neutral-500 hover:text-white transition uppercase text-center block"
                  >
                    ← Back to Login Credentials options
                  </button>
                </form>
              </div>
            )}


            {/* STATE 4: PASSWORD RESET SIMULATOR CODE */}
            {authMode === 'forgot_password' && (
              <div className="max-w-md mx-auto text-left space-y-4 animate-fadeIn">
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">Simulate Password Reset Chain</h4>
                  <p className="text-xs text-neutral-400">
                    Enter your email to dispatch a secure token link log to your sandbox.
                  </p>
                </div>

                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Your Registered Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. fatima@matchgig.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition"
                  >
                    Deliver Secure Recovery link
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full py-2 text-[10px] font-mono text-neutral-500 hover:text-white transition uppercase text-center block"
                  >
                    ← Return to Login page
                  </button>
                </form>
              </div>
            )}


            {/* STATE 5: SECURE PROFILE SETUP ONBOARDING SYSTEM */}
            {authMode === 'onboarding' && (
              <div className="space-y-6">
                
                <div className="space-y-1.5 text-center">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-black tracking-widest inline-block">
                    Onboarding Verification Flow
                  </span>
                  <h3 className="text-lg font-extrabold text-white">Create Verified Custom Creator Profile</h3>
                  <p className="text-xs text-neutral-400">Configure your Pakistan freelancer profile with custom skills, country, and avatars!</p>
                </div>

                <form onSubmit={handleOnboardingSignupSubmit} className="space-y-6 text-left">
                  
                  {/* Step 1: Photos Pickers */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-black text-neutral-400 block">Step 1: Choose A Premium Digital Avatar Photo</label>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {AVATAR_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setOnboardingAvatar(p.url);
                            pushAlert(`Selected avatar preset: ${p.label}`);
                          }}
                          className={`p-1 bg-neutral-950 border rounded-xl overflow-hidden transition relative ${
                            onboardingAvatar === p.url ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-12 rounded-lg object-cover" />
                          <div className="text-[8px] truncate mt-1 text-neutral-400 text-center">{p.label}</div>
                          {onboardingAvatar === p.url && (
                            <span className="absolute top-1 right-1 bg-amber-500 rounded-full p-0.5 text-neutral-950">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Primary input fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Account Username Tag</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. sarmad_ui"
                        value={onboardingUsername}
                        onChange={(e) => setOnboardingUsername(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Full Display Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarmad Hassan"
                        value={onboardingFullName}
                        onChange={(e) => setOnboardingFullName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Secure Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. sarmad@example.com"
                        value={onboardingEmail}
                        onChange={(e) => setOnboardingEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Primary Country Location</label>
                      <select
                        value={onboardingCountry}
                        onChange={(e) => setOnboardingCountry(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                      >
                        <option value="Pakistan">🇵🇰 Pakistan (Primary hub)</option>
                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                        <option value="United States">🇺🇸 United States</option>
                        <option value="Canada">🇨🇦 Canada</option>
                        <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Bio description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">Short Creator Bio</label>
                    <textarea
                      rows={2}
                      value={onboardingBio}
                      onChange={(e) => setOnboardingBio(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                      placeholder="Describe what services you provide or seek on the marketplace..."
                    />
                  </div>

                  {/* Step 4: Skills tag selections */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-black text-neutral-400 block">Step 5: Pick Creator Skill Tags for matches</label>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {SKILL_POTENTIALS.map((sk) => {
                        const hasIt = onboardingSkills.includes(sk);
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => toggleSkillTag(sk)}
                            className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all ${
                              hasIt 
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                                : 'bg-neutral-950 border-neutral-850 text-neutral-500 hover:text-white'
                            }`}
                          >
                            {hasIt ? `✓ ${sk}` : `+ ${sk}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Role preference */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-400">My Platform Mode role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Regular', 'Freelancer', 'Client'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setOnboardingRole(r)}
                          className={`py-2 text-[10px] font-mono uppercase tracking-wider font-bold rounded-lg border transition ${
                            onboardingRole === r
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                              : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="pt-4 border-t border-neutral-850 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs text-neutral-400 hover:text-white underline font-mono"
                    >
                      Return to authentication login options
                    </button>

                    <button
                      type="submit"
                      disabled={isBusy}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Authenticate and claim starter balance
                    </button>
                  </div>

                </form>

              </div>
            )}

          </div>

          {/* TELEMETRY BOARD: SIMULATE ACTIVE LOGIN SESSIONS FOR CORRESPONDING PLATFORM */}
          <div className="bg-neutral-900/60 border border-neutral-850 p-6 rounded-3xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-extrabold text-white font-sans">Active Sessions & Device Registry Telemetry</h4>
                  <p className="text-[10px] text-neutral-400">Verify login alerts and block suspicious endpoints.</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setDeviceLogs(prev => [
                    { id: 'dev_' + Date.now().toString(), name: 'Simulated Proxy Check Host', ip: '192.168.10.22', city: 'Karachi', country: 'Pakistan', time: 'Just now Check', status: 'Approved', isCurrent: false },
                    ...prev
                  ]);
                  pushAlert(`Telemetry scan verified user browser footprints successfully.`);
                }}
                className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-[9px] font-mono transition"
              >
                Scan Credentials Now
              </button>
            </div>

            <div className="divide-y divide-neutral-850">
              {deviceLogs.map((d) => (
                <div key={d.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{d.name}</span>
                      {d.isCurrent && (
                        <span className="bg-indigo-500/15 text-indigo-400 text-[8px] font-mono uppercase px-1.5 py-0.2 rounded-full font-bold">
                          Current Device active
                        </span>
                      )}
                      
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded-full font-bold ${
                        d.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        d.status === 'Blocked' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {d.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-neutral-400 font-mono">
                      <span className="flex items-center"><MapPin className="w-3 h-3 text-neutral-500 mr-0.5" /> {d.city}, {d.country}</span>
                      <span>IP: <strong className="text-neutral-300">{d.ip}</strong></span>
                      <span className="flex items-center"><Clock className="w-3 h-3 text-neutral-500 mr-0.5" /> {d.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    {d.status !== 'Blocked' ? (
                      <button
                        onClick={() => handleDeviceAction(d.id, 'block')}
                        className="p-1 px-2.5 bg-neutral-950 hover:bg-red-950/20 text-neutral-500 hover:text-red-400 text-[9px] font-mono rounded border border-neutral-850 hover:border-red-900/30 transition-all uppercase"
                      >
                        Revoke Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeviceAction(d.id, 'approve')}
                        className="p-1 px-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[9px] font-mono rounded border border-indigo-500/20 transition-all uppercase"
                      >
                        Unblock Device
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-2xl flex items-center space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[10px] text-neutral-400">
                MatchGig escrow compliance scans your hardware tokens and localized Pakistan IPs to reject fraudulent secondary log duplication scams. Multi-account bans auto-escalate directly to Lahorian human support staff.
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: SIMULATED INBOX / MAILBOX CHECKER TERMINAL */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SANDBOX EMAIL PANEL INBOX DISPLAY */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-4 sm:p-5 text-left space-y-4">
            <div className="border-b border-neutral-900 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4.5 h-4.5 text-amber-400" />
                <h4 className="text-xs font-mono uppercase text-white font-extrabold tracking-wider">Simulated Phone & Mailbox Inbox</h4>
              </div>
              <span className="bg-indigo-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase">
                {simulatedEmails.length} Items
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-normal">
              Because this is a sandboxed local environment, all platform OTP SMS codes, security alerts, and password reset route links are dispatched to this live container simulation feed.
            </p>

            <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
              {simulatedEmails.map((em) => (
                <div key={em.id} className="p-3 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-2 text-xs relative overflow-hidden font-sans">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-neutral-300 block max-w-[190px] truncate">{em.subject}</span>
                    <span className="text-[8px] font-mono text-neutral-500">{em.receivedAt}</span>
                  </div>
                  
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">{em.body}</p>
                  
                  {em.verificationLink && (
                    <button
                      type="button"
                      onClick={() => {
                        window.alert(`Successfully triggered sandbox password reset sequence! Setting reset mode.`);
                        setEmail('');
                        setAuthMode('login');
                        pushAlert(`Simulated browser parsed recovery code token verified! Passkey refreshed to "fatima" / "imran".`);
                      }}
                      className="mt-2 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide px-2.5 py-1 rounded block text-center"
                    >
                      Bypass & Verify Code Link
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSimulatedEmails([])}
                className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-500 hover:text-white transition rounded-xl text-[9px] font-mono uppercase"
              >
                Clear Mailbox log
              </button>
            </div>
          </div>

          {/* REAL TIME CONSOLE PRINT ACTIVITY FEED */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-4 sm:p-5 text-left space-y-3">
            <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 block"></span>
              <span>Secure Authentication Logs Terminal</span>
            </h4>

            <div className="bg-neutral-900 rounded-2xl p-3 h-52 overflow-y-auto space-y-2 text-[10px] font-mono text-indigo-300/90 leading-normal scrollbar-none">
              {loginAlerts.length === 0 ? (
                <div className="text-center py-10 text-neutral-600">No telemetry log lines printed yet.</div>
              ) : (
                loginAlerts.map((log, idx) => (
                  <div key={idx} className="border-b border-neutral-900/40 pb-1 text-left break-all">
                    {log}
                  </div>
                ))
              )}
            </div>

            <p className="text-[9px] text-neutral-500 leading-normal font-mono">
              IP: localhost:3000 • Protocol: SSL/TLS • Telemetry level: Strict Escalation
            </p>
          </div>

          {/* ESCROW & PRIVACY POLICY HIGHLIGHTS */}
          <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-4 text-left space-y-2">
            <h5 className="text-[11px] font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Data Protection & Privacy standard</span>
            </h5>
            <p className="text-[10px] text-neutral-400 leading-normal">
              MatchGig complies with secure data protection directives. We encrypt all passwords, do not preserve plain key inputs, and mask critical credit cards/OTP tokens dynamically.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

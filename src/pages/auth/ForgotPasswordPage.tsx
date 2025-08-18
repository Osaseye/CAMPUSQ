import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { FaEnvelope, FaLock, FaShieldAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password, 4: success
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Trigger animation after component mounts
    const animationTimer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(animationTimer);
  }, []);

  // Handle OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Generate a random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedOtp);
      
      // In a real app, this OTP would be sent to the user's email
      console.log(`OTP sent to ${email}: ${generatedOtp}`);
      
      // Set a 2-minute timer for OTP expiry
      setTimer(120);
      
      setStep(2);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!otp) {
      setError('Please enter the OTP sent to your email');
      return;
    }
    
    if (otp !== sentOtp) {
      setError('Invalid OTP, please try again');
      return;
    }
    
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const resendOTP = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Generate a new random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedOtp);
      
      // In a real app, this OTP would be sent to the user's email
      console.log(`New OTP sent to ${email}: ${generatedOtp}`);
      
      // Reset the timer
      setTimer(120);
    }, 1000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-charcoal to-primary-green flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute h-96 w-96 rounded-full bg-white/10 -top-48 -right-48 animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute h-80 w-80 rounded-full bg-white/10 -bottom-40 -left-40 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <div className={`max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden relative transform transition-all duration-700 ${
        animateIn ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 bg-primary-green rounded-l-xl hidden md:flex md:flex-col md:justify-center md:items-center">
            <div className="text-white text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
              <img 
                src={campusqLogo} 
                alt="CampusQ" 
                  className="h-24 mx-auto mb-4 filter drop-shadow-lg transition-transform duration-500 hover:scale-110" 
              />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">Password Reset</h1>
              <p className="text-white/80 text-lg mb-8">Follow the steps to reset your password and regain access to your account</p>
              
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <p className="text-white font-medium mb-3">Password Reset Steps:</p>
                <ul className="space-y-2 text-sm text-white/90 text-left">
                  <li className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-primary-green' : 'bg-white/30 text-white'}`}>1</div>
                    <span>Enter your email address</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-primary-green' : 'bg-white/30 text-white'}`}>2</div>
                    <span>Enter verification code from email</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-white text-primary-green' : 'bg-white/30 text-white'}`}>3</div>
                    <span>Create new password</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-white text-primary-green' : 'bg-white/30 text-white'}`}>4</div>
                    <span>Complete reset process</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8">
            {/* Logo for mobile view */}
            <div className="mb-6 md:hidden">
              <div className="bg-primary-green rounded-lg p-6 mb-6">
              <div className="mb-8 md:hidden">
                            <div className="bg-primary-green rounded-lg p-6 mb-6 flex justify-center">
                            <img 
                              src={campusqLogo} 
                              alt="CampusQ" 
                              className="h-20 filter drop-shadow-lg transition-transform duration-500 hover:scale-110" 
                            />
                            </div>
                          </div>
                
                <h1 className="text-2xl font-bold mb-2 text-white text-center">Password Reset</h1>
                <p className="text-white/80 text-sm mb-4 text-center">Follow the steps to reset your password</p>
                
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-white font-medium mb-2 text-center text-sm">Password Reset Steps:</p>
                  <ul className="space-y-1 text-xs text-white/90 text-left">
                    <li className="flex items-center gap-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-white text-primary-green' : 'bg-white/30 text-white'}`}>1</div>
                      <span>Enter your email address</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-white text-primary-green' : 'bg-white/30 text-white'}`}>2</div>
                      <span>Enter verification code</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-white text-primary-green' : 'bg-white/30 text-white'}`}>3</div>
                      <span>Create new password</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-primary-green">
                {step === 4 ? 'Password Reset Complete' : 'Forgot Password'}
              </h2>
              <p className="mt-2 text-gray-600">
                {step === 1 && 'Enter your email to receive a verification code'}
                {step === 2 && 'Enter the verification code sent to your email'}
                {step === 3 && 'Create a new secure password'}
                {step === 4 && 'Your password has been reset successfully'}
              </p>
            </div>

            {error && (
              <div className="bg-error-red/10 text-error-red p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={handleSendOTP}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                    <FaEnvelope className="text-primary-green" size={14} />
                    <span>Email Address</span>
                  </label>
                  <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 
                  flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1
                  relative overflow-hidden group"
                  disabled={loading}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP}>
                <div className="mb-6">
                  <label htmlFor="otp" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                    <FaShieldAlt className="text-primary-green" size={14} />
                    <span>Verification Code</span>
                  </label>
                  <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                    <input
                      type="text"
                      id="otp"
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                      placeholder="Enter 6-digit verification code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaShieldAlt className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Code expires in: <span className="font-medium">{formatTimer(timer)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={timer > 0 || loading}
                      className={`text-sm ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-green hover:underline'}`}
                    >
                      Resend Code
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mb-6 flex items-start">
                  <div className="text-blue-500 mt-1 mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Demo Mode:</span> For testing purposes, the OTP is: <span className="font-mono font-bold">{sentOtp}</span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 
                  flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1
                  relative overflow-hidden group"
                  disabled={loading}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            )}

            {/* Step 3: Set New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-6">
                  <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                    <FaLock className="text-primary-green" size={14} />
                    <span>New Password</span>
                  </label>
                  <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                    <FaLock className="text-primary-green" size={14} />
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                    <input
                      type="password"
                      id="confirmPassword"
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 
                  flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1
                  relative overflow-hidden group"
                  disabled={loading}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="bg-success-green/10 rounded-full p-5 inline-block">
                    <FaCheckCircle size={50} className="text-success-green" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-success-green mb-4">Password Reset Successful!</h3>
                <p className="text-gray-600 mb-8">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <Link
                  to="/login"
                  className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 
                  flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1
                  relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Return to Login
                </Link>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link 
                to="/login" 
                className="text-gray-500 hover:text-primary-green text-sm flex items-center justify-center gap-1 mx-auto w-fit"
              >
                <FaArrowLeft className="w-3 h-3" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

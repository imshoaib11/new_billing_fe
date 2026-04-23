import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AxiosService from '../Utills/AxiosService';
import ApiRoutes from '../Utills/ApiRoutes';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [focusedOtp, setFocusedOtp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setLoading(true);
    try {
      let res = await AxiosService.post(ApiRoutes.LOGIN.path, {
        email,
        password
      });
      
      if (res.requireOtp) {
        toast.success(res.message || "OTP Sent to Admin Email");
        setStep(2);
        return;
      }
      
      if (res.token) {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.role);
        sessionStorage.setItem('currentUser', res.userName);
      }
      
      toast.success(res.message || "Login Successful");
      console.log("Login Success, navigating to /home");
      navigate('/home', { replace: true });
    } catch (err) {
      console.error("Login Handler Error:", err);
      toast.error(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if(!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      let res = await AxiosService.post(ApiRoutes.VERIFY_OTP.path, {
        email,
        otp
      });
      
      if (res.token) {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.role);
        sessionStorage.setItem('currentUser', res.userName);
      }
      
      toast.success(res.message || "OTP Verified");
      console.log("OTP Verified successfully, navigating to /home");
      navigate('/home', { replace: true });
    } catch (err) {
      console.error("OTP Verification Error:", err);
      toast.error(err.message || "Invalid OTP Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card p-5"
        style={styles.card}
      >
        <div className="text-center mb-5">
          <div style={styles.iconWrapper}>
            <i className={`fa-solid ${step === 1 ? 'fa-lock' : 'fa-shield-halved'} fa-2xl`} style={{color: '#ffffff'}}></i>
          </div>
          <h2 style={{fontWeight: 800, color: '#f8fafc', marginTop: '1.5rem', letterSpacing: '-0.5px'}}>
            {step === 1 ? 'Welcome Back' : 'Verification Required'}
          </h2>
          <p style={{fontSize: '0.95rem', color: '#94a3b8'}}>
            {step === 1 ? 'Sign in to manage your daily bills and inventory.' : 'Enter the 6-digit code sent to your email.'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4" style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-control" 
                id="floatingEmail" 
                placeholder="" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedEmail(true)}
                onBlur={() => setFocusedEmail(false)}
                style={styles.input}
              />
              <label 
                htmlFor="floatingEmail" 
                style={{
                  ...styles.label,
                  opacity: (email || focusedEmail) ? 0 : 1,
                  visibility: (email || focusedEmail) ? 'hidden' : 'visible'
                }}
              >
                Email address
              </label>
            </div>
            <div className="mb-5" style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                id="floatingPassword" 
                placeholder="" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedPassword(true)}
                onBlur={() => setFocusedPassword(false)}
                style={styles.input}
              />
              <label 
                htmlFor="floatingPassword" 
                style={{
                  ...styles.label,
                  opacity: (password || focusedPassword) ? 0 : 1,
                  visibility: (password || focusedPassword) ? 'hidden' : 'visible'
                }}
              >
                Password
              </label>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn w-100 py-3" 
              disabled={loading}
              style={styles.btn}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-5" style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control text-center fs-4 fw-bold" 
                id="floatingOtp" 
                placeholder="" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={() => setFocusedOtp(true)}
                onBlur={() => setFocusedOtp(false)}
                style={{...styles.input, letterSpacing: '8px'}}
                maxLength="6"
              />
              <label 
                htmlFor="floatingOtp" 
                style={{
                  ...styles.label,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  opacity: (otp || focusedOtp) ? 0 : 1,
                  visibility: (otp || focusedOtp) ? 'hidden' : 'visible'
                }}
              >
                6-Digit Security Code
              </label>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn w-100 py-3" 
              disabled={loading}
              style={{...styles.btn, background: '#10b981', color: '#ffffff'}}
            >
              {loading ? 'Verifying...' : 'Submit Code'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a', // Deep slate dark mode
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif'
  },
  card: {
    maxWidth: '420px',
    width: '90%',
    borderRadius: '24px',
    border: '1px solid #1e293b',
    background: '#1e293b',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  iconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)'
  },
  input: {
    borderRadius: '14px',
    border: '2px solid #334155',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    paddingLeft: '20px',
    height: '60px',
    transition: 'all 0.2s ease',
    boxShadow: 'none'
  },
  label: {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    color: '#475569',
    fontWeight: '500',
    pointerEvents: 'none',
    transition: 'all 0.2s ease',
    zIndex: 1
  },
  btn: {
    borderRadius: '14px',
    background: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    fontWeight: '800',
    fontSize: '1.05rem',
    letterSpacing: '0.5px',
    boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.3)',
    textTransform: 'uppercase'
  }
};

export default Login;

import { useState } from 'react';
import { signUp } from '../../utils/supabase';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

const RegisterForm = ({ onSwitchToLogin, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await signUp(email, password, fullName);

      if (signUpError) throw signUpError;

      console.log('Registration successful:', data.user?.email);
      setSuccess(true);
      // If the system auto-logins after signup, we could call onSuccess() here
      // But usually user needs to verify email. Let's keep the success message
      // and add a button to close.
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-brand-400" />
        </div>
        <h3 className="text-xl font-display font-semibold text-white mb-2">
          Check Your Email
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          We've sent a confirmation link to <span className="text-white font-medium">{email}</span>. Please click it to activate your account.
        </p>
        <div className="space-y-3">
          <button
            onClick={onSuccess}
            className="btn-primary w-full py-3"
          >
            Got it, Close
          </button>
          <button
            onClick={onSwitchToLogin}
            className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors block mx-auto"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-2 font-medium">Full Name</label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-premium !pl-12"
            placeholder="John Doe"
            required
            autoComplete="name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2 font-medium">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-premium !pl-12"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2 font-medium">Password</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-premium !pl-12"
            placeholder="••••••••"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1.5 ml-1">
          Must be at least 6 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 mt-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-400 mt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-brand-400 hover:text-brand-300 font-semibold transition-colors decoration-brand-400/30 hover:underline underline-offset-4"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;

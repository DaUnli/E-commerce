import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate(); // For redirecting after login

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // After successful MERN API call:
    console.log("Logged in!");
    navigate('/dashboard'); // Redirect to dashboard
  };

  return (
    <div className={styles.pageWrapper}>
      <form className={styles.formCard} onSubmit={handleLogin}>
        <h2>Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <button type="submit">Go to Dashboard</button>
      </form>
    </div>
  );
};

export default LoginPage;
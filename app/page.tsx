'use client';

import React, { useState } from 'react';
import { init } from '@instantdb/react';

const APP_ID = 'a3e69c07-8647-4e6f-8932-23256a6cf694';

const db = init({ appId: APP_ID });

function App() {
  const { isLoading, user, error } = db.useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Uh oh! {error.message}</div>;
  }
  if (user) {
    return <h1>Hello {user.email}!</h1>;
  }
  return <Login />;
}

function Login() {
  const [sentEmail, setSentEmail] = useState('');
  return (
    <div style={authStyles.container}>
      {!sentEmail ? (
        <Email setSentEmail={setSentEmail} />
      ) : (
        <MagicCode sentEmail={sentEmail} />
      )}
    </div>
  );
}

function Email({ setSentEmail }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSentEmail(email);
    db.auth.sendMagicCode({ email }).catch((err) => {
      alert('Uh oh :' + err.body?.message);
      setSentEmail('');
    });
  };

  return (
    <form onSubmit={handleSubmit} style={authStyles.form}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Let's log you in!</h2>
      <div>
        <input
          style={authStyles.input}
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" style={authStyles.button}>
          Send Code
        </button>
      </div>
    </form>
  );
}

function MagicCode({ sentEmail }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
      alert('Uh oh :' + err.body?.message);
      setCode('');
    });
  };

  return (
    <form onSubmit={handleSubmit} style={authStyles.form}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>
        Okay, we sent you an email! What was the code?
      </h2>
      <div>
        <input
          style={authStyles.input}
          type="text"
          placeholder="123456..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button type="submit" style={authStyles.button}>
        Verify
      </button>
    </form>
  );
}

const authStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: '300px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default App;

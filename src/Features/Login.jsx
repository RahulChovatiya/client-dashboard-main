import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });

            localStorage.setItem('token', response.data.token);

            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials or server error.');
        }
    };

    return (
        <div style={styles.loginContainer}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Login</button>
                {error && <p style={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

const styles = {
    loginContainer: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
};

export default Login;

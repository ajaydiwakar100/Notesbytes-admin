import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { LoginAPI } from '../config';
import Loader from "../layouts/Loader";
import { margin } from '@mui/system';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            setRememberMe(checked);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation (single check)
        if (!email.trim() || !password.trim()) {
            toast.error("Please enter both email and password");
            return;
        }

        setLoading(true);

        try {
            setPassword(e.target.value);
            const { data } = await axios.post(LoginAPI, { email, password });

            console.log("Login Response:", data);

            if (data.status === "success" && data.code === 200) {
                toast.success(data.msg || "Login successful!");
                navigate("/verification-code", {
                    state: { email },
                });
            } else {
                toast.error(data.msg || "Invalid credentials");
            }

        } catch (error) {
            console.error("Login Error:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.msg ||
                "Network error, please try again later";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Use Loader component */}
            <Loader loading={loading} />
            
            {/* Main Page Content */}
            <div className='col-lg-12' style={{ overflow: "hidden" }}> 
                <div className='row' style={{ margin: '-17px' }}>
                    <div className='col-lg-8'>
                        <img src="/admin/images/login-banner.jpg" className='h-100 object-fit-cover w-100'/>
                    </div>
                    <div className="auth-bg-gradient card-img-overlay"></div>
                    <div className='col-lg-4'>
                        <div className='login-page'>
                            <div className="login-box">
                                <div className="login-title-box">
                                    <h4 className="login-title">Welcome to Notebytes    </h4>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email" className="lableclassName">Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            id="email" 
                                            placeholder="Enter Email Address" 
                                            className="form-control"
                                            value={email}
                                            onChange={handleChange}
                                            autoComplete="username"
                                        />
                                    </div>
                                    <div className="form-group position-relative">
                                        <label htmlFor="password" className="lableclassName">
                                            Password
                                        </label>

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            placeholder="Enter Password"
                                            className="form-control"
                                            value={password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                        />

                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                            position: "absolute",
                                            right: "15px",
                                            top: "38px",
                                            cursor: "pointer",
                                            color: "#6c757d",
                                            }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        </div>
                                   
                                    <div className="row " style={{ marginTop: '30px' }}>
                                        <div className="col-lg-6">
                                            <button type="submit" className="btn btn-primary">Send OTP</button>
                                        </div>
                                        <div className="col-lg-6">
                                            <p className="forgot-link">
                                            <a href="/forgot-password">Forgot Password?</a>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>       
                        </div>    
                    </div>
                </div>
            </div>
        </>
        
    )
}
export default Login;
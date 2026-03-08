import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { OTP_VERIFICATION_API } from '../config';
import Loader from "../layouts/Loader";


const OTP = () => {
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'otp') {
            setOTP(value);
        }
    };

    const handleSubmit = async (event) => {
        
        event.preventDefault();
        
        // Check if email and password are not empty
        if (!otp.trim()) {
            // If either field is empty, set an error message and return early
            toast.error('Please enter verification code');
            return;
        }

        if (!email.trim()) {
            toast.error('Something went wrong !');
            return;
        }
        setLoading(true);

        // API handeler 
        try {
            const { data } = await axios.post(OTP_VERIFICATION_API, { email, otp });
            console.log("OTP Verify Response:", data);

            if (data.status === "success" && data.code === 200) {
                toast.success(data.msg || "Verification successful!");
                
                // Extract token and profile
                const token = data.data?.auth_token || null;
                const { password, auth_token, ...profile } = data.data;

                // Save to localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("profile", JSON.stringify(profile));
                localStorage.setItem("isAuthenticated", "true");
                navigate("/dashboard");
            } else {
                toast.error(data.msg || "Invalid verification code!");
            }
        } catch (error) {
            console.error("OTP Verification Error:", error);
            const message =
                error.response?.data?.message ||
                error.response?.data?.msg ||
                "An unexpected error occurred";
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
                                    {/* <h4 className="login-title">Welcome to NotesByte</h4> */}
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email" className="lableclassName">Login OTP</label>
                                        <input 
                                            type="text" 
                                            name="otp" 
                                            id="otp" 
                                            placeholder="Please enter login code" 
                                            className="form-control"
                                            value={otp}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                        <button type="button" className="btn btn-primary">
                                            Resend OTP
                                        </button>
                                    </div>
                                     <div className="-flex justify-content-between">
                                        <p className="back-to-login">
                                            <a href="#" onClick={() => navigate(-1)}>Back to Login</a>
                                        </p>
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
export default OTP;

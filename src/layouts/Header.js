import React, { Component } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LOGOUT_API } from "../config";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const userName = profile?.name || 'Admin'; // default if not found
    const navigate = useNavigate();

    // Generate initials
    const getInitials = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        const initials = names.map(n => n[0].toUpperCase());
        return initials.slice(0, 2).join(''); // first two initials
    };

    const initials = getInitials(userName); // e.g., "SA"

    const handleLogout = () => {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();

        // Remove axios auth header if set
        delete axios.defaults.headers.common["Authorization"];
        toast.success("Logout successful");

        // Redirect & prevent back navigation
        window.location.href = "/login";
    };


    return (
        <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                <li className="nav-item profile-item dropdown">
                  <a className="nav-link d-flex align-items-center" data-toggle="dropdown" href="#">
                        {/* Dynamic initials avatar */}
                        <span
                            className="profile-img bg-red text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '35px', height: '35px', fontWeight: 'bold' }}
                        >
                            {initials}
                        </span>

                        {/* Username */}
                        <span className="profile-name ml-2">{userName}</span>

                        {/* Dropdown icon */}
                        <i className="fas fa-angle-down ml-2"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-lg-1 dropdown-menu-right">

                        <Link to="/profile" className="dropdown-item">
                            <i className="fa fa-user mr-2"></i> Profile
                        </Link>
                        <div className="dropdown-divider"></div>

                        <Link to="/change-password" className="dropdown-item">
                            <i className="fas fa-lock mr-2"></i> Change Password
                        </Link>
                     
                        <div className="dropdown-divider"></div>

                        <Link onClick={handleLogout} className="dropdown-item">
                            <i className="fas fa-sign-out-alt mr-2"></i> Logout
                        </Link>
                        
                    </div>
                   
                </li>
                </ul>
            </nav>
        </div>
    )
}

export default Header;
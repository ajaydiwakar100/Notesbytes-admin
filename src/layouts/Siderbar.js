import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouterProps from './WithRouterProps';

class Sidebar extends Component {
  state = {
    usersMenuOpen: false, // Track if submenu is open
  };

  toggleUsersMenu = () => {
    this.setState((prevState) => ({
      usersMenuOpen: !prevState.usersMenuOpen,
    }));
  };

  render() {
    const { location } = this.props;
    const currentPath = location.pathname;
    const { usersMenuOpen } = this.state;

    // Keep submenu open if current path is inside /users
    const isUsersPath = currentPath.startsWith('/users');

    return (
      <div>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          <a href="#" className="brand-link">
            {/* <img src="/images/logo.png" alt="" className='admin-logo'/> */}
          </a>
          <div className="main-navigation">MAIN NAVIGATION</div>

          <div className="sidebar">
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                 {/* Dashboard */}
                <li className="nav-item">
                  <Link to="/dashboard" className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-tachometer-alt"></i>
                    <p>Dashboard</p>
                  </Link>
                </li>

                {/* Manage Users with Submenu */}
                <li className={`nav-item ${usersMenuOpen || isUsersPath ? 'menu-open' : ''}`}>
                  <a href="#" className={`nav-link ${isUsersPath ? '' : ''}`} onClick={this.toggleUsersMenu}>
                    <i className="nav-icon fas fa-users"></i>
                    <p>
                      Users Management
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview" style={{ display: usersMenuOpen || isUsersPath ? 'block' : 'none' }}>
                    <li className="nav-item">
                      <Link to="/users/buyers" className={`nav-link ${currentPath === '/users/buyers' ? 'active' : ''}`}>
                        <i className="fas fa-users nav-icon"></i>
                        <p>Buyers</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/users/sellers" className={`nav-link ${currentPath === '/users/sellers' ? 'active' : ''}`}>
                        <i className="fas fa-user-tie nav-icon"></i>
                        <p>Sellers</p>
                      </Link>
                    </li>
                    {/* <li className="nav-item">
                      <Link to="/users/refferals"  className={`nav-link ${currentPath === '/users/refferals' ? 'active' : ''}`}>
                         <i className="fas fa-handshake nav-icon"></i>
                        <p>Referrers</p>
                      </Link>
                    </li> */}
                  </ul>
                </li>

                {/* Manage Roles and permission */}
                <li className="nav-item">
                  <Link to="/roles" className={`nav-link ${currentPath.startsWith('/roles') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-key"></i>
                    <p>Roles & Permission</p>
                  </Link>
                </li>

                {/* Manage Sub admin */}
                <li className="nav-item">
                  <Link to="/sub-admins" className={`nav-link ${currentPath.startsWith('/sub-admin') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-user"></i>
                    <p>Sub Admins</p>
                  </Link>
                </li>

                {/* Manage Email Template */}
                <li className="nav-item">
                  <Link to="/email-template" className={`nav-link ${currentPath.startsWith('/email-template') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-envelope"></i>
                    <p>Email Template</p>
                  </Link>
                </li>

                {/* Manage Settings */}
                <li className="nav-item">
                  <Link to="/global-setting" className={`nav-link ${currentPath.startsWith('/global-setting') ? 'active' : ''}`}>
                    <i className="nav-icon fas fa-cog"></i>
                    <p>Golbal Settings</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}

export default withRouterProps(Sidebar);

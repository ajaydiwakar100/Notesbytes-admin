import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouterProps from "./WithRouterProps";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    const currentPath = props.location.pathname;

    this.state = {
      pagesOpen: currentPath.startsWith("/pages"),
      documentsOpen: currentPath.startsWith("/documents"),
    };
  }

  togglePagesMenu = (e) => {
    e.preventDefault();
    this.setState((prev) => ({
      pagesOpen: !prev.pagesOpen,
    }));
  };

  toggleDocumentsMenu = (e) => {
    e.preventDefault();
    this.setState((prev) => ({
      documentsOpen: !prev.documentsOpen,
    }));
  };

  componentDidUpdate(prevProps) {
    const prevPath = prevProps.location.pathname;
    const currentPath = this.props.location.pathname;

    if (prevPath !== currentPath) {
      if (currentPath.startsWith("/pages")) {
        this.setState({ pagesOpen: true });
      }

      if (currentPath.startsWith("/documents")) {
        this.setState({ documentsOpen: true });
      }
    }
  }

  render() {
    const { location } = this.props;
    const currentPath = location.pathname;
    const { pagesOpen, documentsOpen } = this.state;

    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <div className="main-navigation">MAIN NAVIGATION</div>

        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              role="menu"
              data-accordion="false"
            >
              {/* Dashboard */}
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link ${currentPath === "/dashboard" ? "active" : ""}`}
                >
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </Link>
              </li>

              {/* Users */}
              <li className="nav-item">
                <Link
                  to="/users"
                  className={`nav-link ${currentPath.startsWith("/users") ? "active" : ""}`}
                >
                  <i className="nav-icon fas fa-users"></i>
                  <p>User Management</p>
                </Link>
              </li>

              {/* Roles */}
              <li className="nav-item">
                <Link
                  to="/roles"
                  className={`nav-link ${currentPath.startsWith("/roles") ? "active" : ""}`}
                >
                  <i className="nav-icon fas fa-key"></i>
                  <p>Roles & Permission</p>
                </Link>
              </li>

              {/* Pages */}
              <li className={`nav-item ${pagesOpen ? "menu-open" : ""}`}>
                <a
                  href="#"
                  className={`nav-link ${pagesOpen ? "active" : ""}`}
                  onClick={this.togglePagesMenu}
                >
                  <i className="nav-icon fas fa-file-alt"></i>
                  <p>
                    Pages
                    <i className={`right fas fa-angle-${pagesOpen ? "down" : "left"}`}></i>
                  </p>
                </a>

                <ul className="nav nav-treeview" style={{ display: pagesOpen ? "block" : "none" }}>
                  {[
                    { path: "/pages/home", label: "Home Page", icon: "fas fa-home" },
                    { path: "/pages/about-us", label: "About Us", icon: "fas fa-info-circle" },
                    { path: "/pages/sell-notes", label: "Sell Notes", icon: "fas fa-file-invoice-dollar" },
                    { path: "/pages/privacy-policy", label: "Privacy Policy", icon: "fas fa-user-shield" },
                    { path: "/pages/terms-conditions", label: "Terms & Conditions", icon: "fas fa-file-contract" },
                    { path: "/pages/refund", label: "Refund & Cancellation", icon: "fas fa-undo" },
                  ].map((item) => (
                    <li className="nav-item" key={item.path}>
                      <Link
                        to={item.path}
                        className={`nav-link ${currentPath === item.path ? "active" : ""}`}
                      >
                        <i className={`nav-icon ${item.icon}`}></i>
                        <p>{item.label}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Documents */}
              <li className={`nav-item ${documentsOpen ? "menu-open" : ""}`}>
                <a
                  href="#"
                  className={`nav-link ${documentsOpen ? "active" : ""}`}
                  onClick={this.toggleDocumentsMenu}
                >
                  <i className="nav-icon fas fa-folder"></i>
                  <p>
                    Documents
                    <i className={`right fas fa-angle-${documentsOpen ? "down" : "left"}`}></i>
                  </p>
                </a>

                <ul
                  className="nav nav-treeview"
                  style={{ display: documentsOpen ? "block" : "none" }}
                >
                  {[
                    {
                      path: "/documents/purchase-orders",
                      label: "Purchase Document",
                      icon: "fas fa-shopping-cart",
                    },
                    {
                      path: "/documents/upload-documents",
                      label: "Uploaded Document",
                      icon: "fas fa-upload",
                    },
                  ].map((item) => (
                    <li className="nav-item" key={item.path}>
                      <Link
                        to={item.path}
                        className={`nav-link ${currentPath === item.path ? "active" : ""}`}
                      >
                        <i className={`nav-icon ${item.icon}`}></i>
                        <p>{item.label}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Settings */}
              <li className="nav-item">
                <Link
                  to="/global-setting"
                  className={`nav-link ${currentPath.startsWith("/global-setting") ? "active" : ""}`}
                >
                  <i className="nav-icon fas fa-cog"></i>
                  <p>Global Settings</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    );
  }
}

export default withRouterProps(Sidebar);

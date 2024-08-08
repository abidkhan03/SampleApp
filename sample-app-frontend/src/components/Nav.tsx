import { NavLink } from "react-router-dom"


const Nav = () => {
    return (
        <header style={{ padding: '10px 0' }}>
          {/* Use Bootstrap navbar classes */}
          <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#493150" }}>
            <div className="container-fluid">
              <NavLink className="navbar-brand" to="/" style={{ color: 'white', textDecoration: 'none', textAlign: 'center' }}>
                Welcome to the Sample App
              </NavLink>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                      data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                      aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/categories" style={{ color: 'white' }}>
                      Categories
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/products" style={{ color: 'white' }}>
                      Products
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/orders" style={{ color: 'white' }}>
                      Orders
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
    )
}

export default Nav;
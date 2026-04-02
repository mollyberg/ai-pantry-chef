import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/history">History</Link>
    </nav>
  );
};

export default Navbar;
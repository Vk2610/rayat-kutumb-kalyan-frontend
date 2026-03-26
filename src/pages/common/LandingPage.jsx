import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRKYClick = () => {
    navigate('/login', {
        state: 'rkky'
    });
  };

  const handleWelfareFormClick = () => {
    navigate('/login', {
        state: 'welfare'
    });
  };

  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1>Welcome to Welfare Management System</h1>
        <p>Select an option below to get started</p>
      </div>

      <div className="cards-container">
        {/* Card 1: Rayat Kutumbh Kalyan Yojana */}
        <div className="card" onClick={handleRKYClick}>
          <div className="card-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
              <path
                d="M32 16V48M16 32H48"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2>Rayat Kutumbh Kalyan Yojana</h2>
          <p>
            Explore and manage welfare schemes under the Rayat Kutumbh Kalyan Yojana program. 
            Access benefits, eligibility criteria, and application status.
          </p>
          <button className="card-button">Learn More</button>
        </div>

        {/* Card 2: Welfare Form */}
        <div className="card" onClick={handleWelfareFormClick}>
          <div className="card-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="12"
                y="8"
                width="40"
                height="48"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 16H44M20 24H44M20 32H44M20 40H36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2>Welfare Form</h2>
          <p>
            Submit your welfare form application. Fill out the required information 
            to apply for welfare benefits and track your application status.
          </p>
          <button className="card-button">Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import "./start.css"; // ✅ Ensure CSS is imported

export default function WelcomeScreen() {
  return (
    <div className='welcome-screen'>
      {/* Background container (image now set in CSS) */}
      <div className='background-container'></div>

      {/* Content container */}
      <div className='content-container'>
        {/* Logo and tagline */}
        <div className='logo-container'>
          <h1 className='logo'>SmartByte</h1>
          <h2 className='tagline'>
            Enjoy the restaurants you love guilt free!
          </h2>
        </div>

        {/* Buttons */}
        <div className='buttons-container'>
          <a href='/auth/signup' className='signup-button'>
            Sign Up
          </a>

          <div className='account-text'>
            <p>Already have an account?</p>
          </div>

          <a href='/auth/login' className='login-button'>
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}

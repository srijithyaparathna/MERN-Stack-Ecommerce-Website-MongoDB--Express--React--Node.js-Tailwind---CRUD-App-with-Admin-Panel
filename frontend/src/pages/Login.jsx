import { useState } from 'react';

const Login = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const signup = async () => {
    console.log("Signup function executed", formData);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        console.error('Signup failed:', responseData.message || 'Unknown error');
        alert(responseData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  const login = async () => {
    console.log("Login function executed", formData);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        alert(responseData.errors || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert("An error occurred during login. Please check your connection and try again.");
    }
  };

  return (
    <section className="max_padd_container flexCenter flex-col pt-32">
      <div className="max-w-[555px] h-[600px] bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="h3">{state}</h3>
        <div className="flex flex-col gap-4 mt-7">
          {state === "Login" ? (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-md"
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-md"
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <input
                name="username"
                type="text"
                placeholder="Your Name"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-md"
                onChange={handleChange}
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-md"
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-md"
                onChange={handleChange}
              />
            </>
          )}
        </div>
        <button 
          onClick={() => { 
            if (termsAccepted) {
              state === "Login" ? login() : signup(); 
            } else {
              alert("Please accept the terms and conditions.");
            }
          }} 
          className="btn_dark_rounded my-5 w-full rounded-md"
        >
          Continue
        </button>
        {state === "Login" ? (
          <p className="text-black font-bold">
            Don't have an account?{" "}
            <span onClick={() => setState("Sign Up")} className="text-secondary underline cursor-pointer">
              Sign Up
            </span>
          </p>
        ) : (
          <p className="text-black font-bold">
            Already have an account?{" "}
            <span onClick={() => setState("Login")} className="text-secondary underline cursor-pointer">
              Login
            </span>
          </p>
        )}
        <div className="flexCenter mt-6 gap-3">
          <input 
            type="checkbox" 
            id="terms" 
            onChange={handleTermsChange}
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </section>
  );
};

export default Login;

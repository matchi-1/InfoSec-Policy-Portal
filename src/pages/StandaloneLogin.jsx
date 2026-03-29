import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./StandaloneLogin.css";
import emailjs from '@emailjs/browser';


export default function StandaloneLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [view, setView] = useState("login"); // login | forgot | regis

  const initialResetData = {
    kinetiq_email: "",
    valid_email: "",
    code: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const initialRegisInfo = {
    regis_username: "",
    regis_valid_email: "",
    regis_code: "",
    regis_pass: "",
    regis_confirm_pass: "",
  }

  const isNewPassSame = async (newPass) => {
    console.log("checking password");
    console.log("KINETIK EMAIL" + resetData.kinetiq_email);
    console.log("NEW PASS INPUTTED: " + newPass);
    const res = await fetch("http://127.0.0.1:8000/check-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: resetData.kinetiq_email,
        password: newPass,
      }),
    });

    const result = await res.json();
    if (result.success) {

      console.log("MATCHED WITH PASS");
      return true;

    } else {
      console.log("NOT MAECHRC WITH PASS");
      return false;
    }
  };

  const [resetData, setResetData] = useState(initialResetData);
  const [regisInfo, setRegisInfo] = useState(initialRegisInfo);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("just let me in bro");//useState("\u00A0");
  // localStorage.setItem('login_attemtps', '1')
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value.trim() }));
    //setLoginError("");
  };

  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser && location.pathname === "/login") {
        navigate("/", { replace: true });
      }
    } catch (e) {
      console.error("ERROR FOR SOME REASON: ", e);
    }

  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in:", credentials);

    try {
      const lock_date = new Date(localStorage.getItem('login_lock_time'))
      if (new Date() < lock_date) {
        console.log('too many attempts timer, current attempts: ' + localStorage.getItem('login_attempts'))
        console.log('lock lifts at ' + lock_date.toString())
        setLoginError(`* Too many failed login attempts. Please try again in ${Math.ceil((lock_date - new Date()) / 1000)} seconds. *`)
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      if (data.success) {
        localStorage.setItem('login_attempts', '0');
        //console.log("Login successful:", data);
        //localStorage.setItem("user", JSON.stringify(data.data));
        setLoginError("");
        setView("mfa");
        //navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        localStorage.setItem('login_attempts', (parseInt(localStorage.getItem('login_attempts')) + 1).toString())
        console.log('attempts' + localStorage.getItem('login_attempts'))
        if (parseInt(localStorage.getItem('login_attempts')) >= 5 && parseInt(localStorage.getItem('login_attempts')) < 10) {
          var lock_time = new Date();
          lock_time.setMinutes(lock_time.getMinutes() + 1)
          localStorage.setItem('login_lock_time', lock_time.toString())
        } else if (parseInt(localStorage.getItem('login_attempts')) >= 10) {
          console.log('sending to forgot page')
          localStorage.setItem('login_attempts', '0');
          setView('forgot')
        }
        // django error payload
        const { message } = err.response.data;
        console.error("Login failed:", message);
        setLoginError("* " + message + " *");
        //alert(message); // backend error
      } else {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
      }
    }

  };


  const generateAndSendCode = async (email, kinetiq_email, isConfirmCode) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("reset_code", code);
    localStorage.setItem("reset_email", email);
    //console.log("Generated code:", code);

    console.log(`KINETIQ EMAIL :${kinetiq_email}`)
    const templateStr = isConfirmCode
      ? "confirm_code_template"
      : "reset_code_template";

    try {
      emailjs.send("service_fpuj34n", templateStr, {
        code: code,
        email: email,
        kinetiq_email: kinetiq_email,
      });
      console.log(`${templateStr} sent successfully! to: ${email} for ${kinetiq_email} `);

    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Error sending reset code.");
    }



  };

  const checkEmail = async (email) => {
    const response = await fetch("http://127.0.0.1:8000/check-email/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (result.exists) {
      return true;
    }

    else {
      setLoginError("* Invalid Kinetiq email address. *");
      return false;
    }
  };

  const handleChangePassword = async () => {
    //setLoginError(""); // clear any old error
    const savedCode = localStorage.getItem("reset_code");
    const savedEmail = localStorage.getItem("reset_email");

    if (await isNewPassSame(resetData.newPassword)) {
      setLoginError("* New password cannot be the same as the current password. *");
      return;
    }

    // reset code match
    if (resetData.code !== savedCode) {
      setLoginError("* Invalid code. Please try again.* ");
      return;
    }

    // reset email match
    if (resetData.valid_email !== savedEmail) {
      setLoginError("* Email does not match the code. Please check and try again. *");
      return;
    }

    // check password length
    if (resetData.newPassword.length < 8) {
      setLoginError("* Password must be at least 8 characters long. *");
      return;
    }

    // check if the new password and confirm password match
    if (resetData.newPassword !== resetData.confirmNewPassword) {
      setLoginError("* Passwords do not match! *");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetData.kinetiq_email,
          newPassword: resetData.newPassword,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setLoginError(`Password change for ${resetData.kinetiq_email} successful.`);
        localStorage.removeItem("reset_code");
        localStorage.removeItem("reset_email");
        setResetData(initialResetData);
        setView("login");
      } else {
        setLoginError("Error: " + result.error);
      }
    } catch (error) {
      setLoginError("* Something went wrong. Please try again. *");
    }
  };

  const isLoginActive = view === "login" || view === "forgot";

  return (
    <div className="login-container">
      <div className="login-wrapper">


        <div className="login-tabs" role="tablist" aria-label="Auth tabs">
          <button
            type="button"
            className={`tab ${isLoginActive ? "active" : ""}`}
            onClick={() => setView("login")}
            role="tab"
            aria-selected={isLoginActive}
          >
            Login
          </button>

          <button
            type="button"
            className={`tab ${view === "regis" ? "active" : ""}`}
            onClick={() => setView("regis")}
            role="tab"
            aria-selected={view === "regis"}
          >
            Register
          </button>
        </div>

        <div className="login-bottom">
          <div className="login-card">
            <h2>
              {view === "login" && "Welcome Back"}
              {view === "forgot" && "Reset your password"}
              {view === "regis" && "Sign Up"}
            </h2>


            {view === "login" && (
              <>
                <div className="login-form">

                  <form className="login-info-form"
                    onSubmit={handleLogin}>
                    <h4>
                      Username/Email
                    </h4>
                    <i>
                      <input
                        type="text"
                        name="email"
                        placeholder="Email/Username"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                      />
                    </i>
                    <h4>
                      Password
                    </h4>
                    <i>

                      <div className="password-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={credentials.password}
                          onChange={handleChange}
                          required
                        />
                        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                              <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                              <path fill="none" stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                              <circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </i>

                    <div className="login-options">
                      <a href="#" className="forgot-password" onClick={() => { setView("forgot"); /*setLoginError("");*/ }}>
                        <i>Forgot password?
                        </i>
                      </a>
                    </div>

                    {/* TODO: REMOVE THIS LATER, JUST FOR TESTING PURPOSES */}
                    <a href="#" onClick={() => { navigate("/");; /*setLoginError("");*/ }}>
                      <p className="login-error">{loginError}</p>
                    </a>

                    <div className="login-btn-div">
                      <button type="submit" className="login-btn">Login</button>
                    </div>

                  </form>

                </div>
              </>

            )}

            { /* ----------------- FORGORR ----------------- */}
            {view === "forgot" && (
              <>
                {/*<p className="login-pass-details">Enter your email. We’ll send a code to reset your password.</p>*/}
                <div className="reset-form">

                  <form
                    className="reset-info-form"
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const isValidEmail = /^[^\s@]+@[^\s@]+\.(com)$/.test(resetData.valid_email);
                      if (!isValidEmail) {
                        setLoginError("* Please enter a valid email address *");
                        return;
                      }

                      const isValidKinetiqAcc = /^[\w.%+-]+@kinetiq\.ph$/.test(resetData.kinetiq_email);
                      if (!isValidKinetiqAcc) {
                        setLoginError("* Please enter a valid Kinetiq email address *");
                        return;
                      }

                      /*
                      const emailExists = await checkEmail(resetData.kinetiq_email);
                      if (!emailExists) {
                        setLoginError("* Invalid Kinetiq email address. *");
                        return;
                      }
                        */
                      //setLoginError(""); // clear any old error   

                      //generateAndSendCode(resetData.valid_email, resetData.kinetiq_email); // send the code to the email
                      setView("reset");

                    }}
                  >

                    <div className="reset-info-inner">
                      <div className="reset-info-form-left">

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                          <h4 style={{ width: "70%" }}>
                            Valid Email Address </h4>
                          <h4 style={{ width: "30%" }}>
                            Email Code</h4>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                          <input
                            type="email"
                            name="username"
                            placeholder="Enter your email"
                            value={resetData.valid_email}
                            onChange={(e) => {
                              setResetData({ ...resetData, valid_email: e.target.value });

                            }}
                            required
                            style={{ width: "70%", margin: "0 0.5rem .3rem 0", height: "auto" }}
                          />
                          <input
                            type="text"
                            name="email"
                            placeholder="Code"
                            value={resetData.code}
                            onChange={(e) => {
                              setResetData({ ...resetData, code: e.target.value });
                            }}
                            required
                            style={{ width: "30%", marginBottom: "0.3rem", height: "auto" }}
                          />

                        </div>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%", marginBottom: "2rem" }}>
                          <a style={{ width: "70%" }}>
                            Send Code
                          </a>
                          <a style={{ width: "30%", opacity: "0.5" }}>
                            Resend Code? 50s

                          </a>
                        </div>

                      </div>

                      <div className="reset-info-form-right">
                        <div style={{ flexDirection: "column", width: "100%", marginTop: "2%" }}>
                          <div style={{ flexDirection: "row", display: "flex" }}>
                            <h4>Password </h4>

                          </div>
                          <div className="password-wrapper">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="password"
                              placeholder="New Password"
                              value={resetData.newPassword}
                              onChange={(e) => {
                                setResetData({ ...resetData, newPassword: e.target.value });
                              }}
                              required
                              style={{ color: "#204C8B" }}
                            />
                            <span className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                  <circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </span>
                          </div>

                        </div>

                        <div style={{ flexDirection: "column", width: "100%", marginTop: "2.5rem" }}>
                          <h4>Confirm Password: </h4>
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter new Password"
                            value={resetData.confirmNewPassword}
                            onChange={(e) => {
                              setResetData({ ...resetData, confirmNewPassword: e.target.value });
                            }}
                            required

                          />
                        </div>

                      </div>
                    </div>


                    <a href="#" onClick={() => { navigate("/");; /*setLoginError("");*/ }}>
                      {loginError && <p className="login-error">{loginError}</p>}
                    </a>

                    <div className="button-back-container">
                      <button type="submit" className="login-btn"
                        style={{ width: "auto", padding: "0.4rem 1.5rem" }}>
                        Change password
                      </button>
                      <button
                        type="button"
                        className="back-btn"
                        onClick={() => {
                          //setLoginError("");
                          setView("login");
                        }}
                      >
                        Back
                      </button>
                    </div>
                  </form>

                </div>
              </>
            )}

            { /* ----------------- REGISTER ----------------- */}
            {view === "regis" && (
              <>
              <div className = "regis-form">
                <form
                  className="regis-info-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const isValidEmail = /^[^\s@]+@[^\s@]+\.(com)$/.test(resetData.valid_email);
                    if (!isValidEmail) {
                      setLoginError("* Please enter a valid email address *");
                      return;
                    }
                    //setLoginError(""); // clear any old error
                    generateAndSendCode(resetData.valid_email, credentials.email, true); // send the code to the email
                    setView("mfaVerify");

                  }}
                >
                  <div className="regis-info-inner">

                    <div className="regis-info-form-left" style = {{marginTop: "0"}}>
                      <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        Username
                        <span className="infoWrap" tabIndex={0} aria-label="Password requirements">
                          <img className="infoIcon" src="../public/icons/i-icon.png" alt="" />
                          <span className="tooltip">
                            Placeholder ehe <br></br>Placeholder ehe<br></br>
                            Placeholder ehe <br></br>Placeholder ehe
                          </span>
                        </span>
                      </h4>

                      <input
                        type="text"
                        name="username"
                        placeholder="Enter your preferred username"
                        value={regisInfo.regis_username}
                        onChange={(e) => {
                          setRegisInfo({ ...regisInfo, regis_username: e.target.value });
                          //setLoginError("");
                        }}
                        required
                        style={{ color: 'gray', marginBottom: "0" }}
                      />

                      <div style={{ display: "flex", flexDirection: "row", width: "100%", marginTop: "2.5rem" }}>
                        <h4 style={{ width: "70%" }}>
                          Valid Email Address </h4>
                        <h4 style={{ width: "30%" }}>
                          Email Code</h4>
                      </div>

                      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <input
                          type="email"
                          name="username"
                          placeholder="Enter your email"
                          value={regisInfo.regis_valid_email}
                          onChange={(e) => {
                            setRegisInfo({ ...regisInfo, regis_valid_email: e.target.value });

                          }}
                          required
                          style={{ width: "70%", margin: "0 0.5rem .3rem 0", height: "auto" }}
                        />
                        <input
                          type="text"
                          name="email"
                          placeholder="Code"
                          value={regisInfo.regis_code}
                          onChange={(e) => {
                            setRegisInfo({ ...regisInfo, regis_code: e.target.value });
                          }}
                          required
                          style={{ width: "30%", marginBottom: "0.3rem", height: "auto" }}
                        />

                      </div>

                      <div style={{ display: "flex", flexDirection: "row", width: "100%", marginBottom: "2rem" }}>
                        <a style={{ width: "70%" }}>
                          Send Code
                        </a>
                        <a style={{ width: "30%", opacity: "0.5" }}>
                          Resend Code? 50s

                        </a>
                      </div>
                    </div>

                    <div className="regis-info-form-right">
                      <div style={{ flexDirection: "column", width: "100%" }}>
                        <div style={{ flexDirection: "row", display: "flex" }}>
                            <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              Password
                              <span className="infoWrap" tabIndex={0} aria-label="Password requirements">
                                <img className="infoIcon" src={`${import.meta.env.BASE_URL}icons/tooltip.png`} alt="" />
                                <span className="tooltip">
                                  Use at least 8 characters, <br></br>
                                  with a mix of letters and numbers.<br></br>
                                  Use at least 8 characters, <br></br>
                                  with a mix of letters and numbers.<br></br>
                                </span>
                              </span>
                            </h4>

                        </div>
                        <div className="password-wrapper">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="password"
                            placeholder="New Password"
                            value={regisInfo.regis_pass}
                            onChange={(e) => {
                              setRegisInfo({ ...regisInfo, regis_pass: e.target.value });
                            }}
                            required
                            style={{ color: "#204C8B" }}
                          />
                          <span className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="none" stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                <circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </span>
                        </div>

                      </div>


                      <div style={{ flexDirection: "column", width: "100%", marginTop: "2.5rem" }}>
                        <h4>Confirm Password: </h4>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Re-enter new Password"
                          value={regisInfo.regis_confirm_pass}
                          onChange={(e) => {
                            setRegisInfo({ ...regisInfo, regis_confirm_pass: e.target.value });
                          }}
                          required

                        />
                      </div>

                    </div>

                    </div>

                    {loginError && <p className="login-error">{loginError}</p>}
                    <div className="button-back-container">

                      <button type="submit" className="login-btn">
                        Register
                      </button>


                    </div>
                  
                </form>
              </div>
                
              </>
            )}


            {/* TODO: CHECK IF THER SOMETHING USEFUL HERE BEFORE REMOVING (inaccessible) */}
            {view === "mfaVerify" && (
              <>
                <h2>Enter Your Code</h2>
                <p className="login-pass-details">
                  We’ve sent a 6-digit code to <strong>{resetData.valid_email}</strong>.
                </p>
                <form
                  className="code-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // grab the input named "code" directly from the form
                    const code = e.target.elements.code.value.trim();
                    const savedCode = localStorage.getItem("reset_code");

                    if (code === savedCode) {
                      try {
                        const response = await axios.post("http://127.0.0.1:8000/login/", {
                          email: credentials.email,
                          password: credentials.password,
                        });

                        const data = response.data;
                        if (data.success) {
                          localStorage.setItem('login_attempts', '0');
                          console.log("Login successful:", data);
                          localStorage.setItem("user", JSON.stringify(data.data));
                          navigate("/");
                        }
                      }
                      catch (e) {
                        console.error("Login error:", e);
                        alert("Something went wrong. Please try again.");
                      }

                    } else {
                      setLoginError("* Incorrect code, please try again *");
                    }
                  }}
                >
                  <label>
                    Confirmation Code:
                    <input
                      type="text"
                      name="code"
                      placeholder="123456"
                      maxLength={6}
                      required
                      // optional: force numeric keyboard on mobile
                      inputMode="numeric"
                      pattern="\d{6}"
                    />
                  </label>
                  {loginError && <p className="login-error">{loginError}</p>}
                  <div className="button-back-container">

                    <button type="submit" className="login-btn">
                      Verify Code
                    </button>

                    <button
                      type="button"
                      className="back-btn"
                      onClick={() => {
                        //setLoginError("");
                        setView("login");
                        credentials.email = "";
                        credentials.password = "";
                      }}
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              </>
            )}



          </div>


        </div>
        {/*<div className="login-right">
          <img src="/icons/logo4.png" alt="Kinetiq Logo" className="kinetiq-logo" />
        </div>*/}
      </div>
    </div>
  );
}

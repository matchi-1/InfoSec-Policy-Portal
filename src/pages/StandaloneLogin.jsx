import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./StandaloneLogin.module.css";
import emailjs from "@emailjs/browser";

export default function StandaloneLogin() {

  // remove this after backend fix (this is for ez bypass)
  const quickFillLogin = (email, password) => {
    setCredentials({ email, password });
    setLoginError("");
  };

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
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
  };

  const [resetData, setResetData] = useState(initialResetData);
  const [regisInfo, setRegisInfo] = useState(initialRegisInfo);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value.trim() }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser && location.pathname === "/login") {
        navigate("/", { replace: true });
      }
    } catch (e) {
      console.error("ERROR FOR SOME REASON: ", e);
    }
  }, [location.pathname, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in:", credentials);

    try {
      const lock_date = new Date(localStorage.getItem("login_lock_time"));

      if (new Date() < lock_date) {
        console.log(
          "too many attempts timer, current attempts: " +
          localStorage.getItem("login_attempts")
        );
        console.log("lock lifts at " + lock_date.toString());
        setLoginError(
          `* Too many failed login attempts. Please try again in ${Math.ceil(
            (lock_date - new Date()) / 1000
          )} seconds. *`
        );
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      if (data.success) {
        localStorage.setItem("login_attempts", "0");
        setLoginError("");
        setView("mfa");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        localStorage.setItem(
          "login_attempts",
          (parseInt(localStorage.getItem("login_attempts")) + 1).toString()
        );

        console.log("attempts" + localStorage.getItem("login_attempts"));

        if (
          parseInt(localStorage.getItem("login_attempts")) >= 5 &&
          parseInt(localStorage.getItem("login_attempts")) < 10
        ) {
          const lock_time = new Date();
          lock_time.setMinutes(lock_time.getMinutes() + 1);
          localStorage.setItem("login_lock_time", lock_time.toString());
        } else if (parseInt(localStorage.getItem("login_attempts")) >= 10) {
          console.log("sending to forgot page");
          localStorage.setItem("login_attempts", "0");
          setView("forgot");
        }

        const { message } = err.response.data;
        console.error("Login failed:", message);
        setLoginError("* " + message + " *");
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

    console.log(`KINETIQ EMAIL :${kinetiq_email}`);

    const templateStr = isConfirmCode
      ? "confirm_code_template"
      : "reset_code_template";

    try {
      emailjs.send("service_fpuj34n", templateStr, {
        code,
        email,
        kinetiq_email,
      });
      console.log(
        `${templateStr} sent successfully! to: ${email} for ${kinetiq_email} `
      );
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Error sending reset code.");
    }
  };

  const checkEmail = async (email) => {
    const response = await fetch("http://127.0.0.1:8000/check-email/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (result.exists) {
      return true;
    } else {
      setLoginError("* Invalid Kinetiq email address. *");
      return false;
    }
  };

  const handleChangePassword = async () => {
    const savedCode = localStorage.getItem("reset_code");
    const savedEmail = localStorage.getItem("reset_email");

    if (await isNewPassSame(resetData.newPassword)) {
      setLoginError(
        "* New password cannot be the same as the current password. *"
      );
      return;
    }

    if (resetData.code !== savedCode) {
      setLoginError("* Invalid code. Please try again.* ");
      return;
    }

    if (resetData.valid_email !== savedEmail) {
      setLoginError(
        "* Email does not match the code. Please check and try again. *"
      );
      return;
    }

    if (resetData.newPassword.length < 8) {
      setLoginError("* Password must be at least 8 characters long. *");
      return;
    }

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
        setLoginError(
          `Password change for ${resetData.kinetiq_email} successful.`
        );
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
    <div className={styles["login-container"]}>
      <div className={styles["login-wrapper"]}>
        <div
          className={styles["login-tabs"]}
          role="tablist"
          aria-label="Auth tabs"
        >
          <button
            type="button"
            className={`${styles.tab} ${isLoginActive ? styles.active : ""}`}
            onClick={() => setView("login")}
            role="tab"
            aria-selected={isLoginActive}
          >
            Login
          </button>

          <button
            type="button"
            className={`${styles.tab} ${view === "regis" ? styles.active : ""}`}
            onClick={() => setView("regis")}
            role="tab"
            aria-selected={view === "regis"}
          >
            Register
          </button>
        </div>

        <div className={styles["login-bottom"]}>
          <div className={styles["login-card"]}>
            <h2>
              {view === "login" && "Welcome Back"}
              {view === "forgot" && "Reset your password"}
              {view === "regis" && "Sign Up"}
            </h2>

            {view === "login" && (
              <div className={`${styles["login-form"]} ${styles.formPanel} ${styles.panelFromLeft}`}>
                <form
                  className={styles["login-info-form"]}
                  onSubmit={handleLogin}
                >
                  <h4>Username/Email</h4>

                  <input
                    type="text"
                    name="email"
                    placeholder="Email/Username"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />

                  <h4>Password</h4>

                  <div className={styles["password-wrapper"]}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />

                    <span
                      className={styles["eye-icon"]}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                          />
                          <circle
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            cx="12"
                            cy="12"
                            r="3"
                          />
                        </svg>
                      )}
                    </span>
                  </div>

                  <div className={styles["login-options"]}>
                    <a
                      href="#"
                      className={styles["forgot-password"]}
                      onClick={(e) => {
                        e.preventDefault();
                        setView("forgot");
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  {loginError && (
                    <p className={styles["login-error"]}>{loginError}</p>
                  )}

                  <div className={styles["login-btn-div"]}>
                    <button type="submit" className={styles["login-btn"]}>
                      Login
                    </button>
                  </div>
                </form>
              </div>
            )}

            {view === "forgot" && (
              <div className={`${styles["reset-form"]} ${styles.formPanel} ${styles.panelFromBottom}`}>
                <form
                  className={styles["reset-info-form"]}
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const isValidEmail =
                      /^[^\s@]+@[^\s@]+\.(com)$/.test(resetData.valid_email);
                    if (!isValidEmail) {
                      setLoginError("* Please enter a valid email address *");
                      return;
                    }

                    const isValidKinetiqAcc =
                      /^[\w.%+-]+@kinetiq\.ph$/.test(resetData.kinetiq_email);
                    if (!isValidKinetiqAcc) {
                      setLoginError(
                        "* Please enter a valid Kinetiq email address *"
                      );
                      return;
                    }

                    setView("reset");
                  }}
                >
                  <div className={styles["reset-info-inner"]}>
                    <div className={styles["reset-info-form-left"]}>
                      <div className={styles.rowHeader}>
                        <h4 className={styles.primaryCol}>Valid Email Address</h4>
                        <h4 className={styles.secondaryCol}>Email Code</h4>
                      </div>

                      <div className={styles.splitRow}>
                        <input
                          type="email"
                          name="username"
                          placeholder="Enter your email"
                          value={resetData.valid_email}
                          onChange={(e) => {
                            setResetData({
                              ...resetData,
                              valid_email: e.target.value,
                            });
                          }}
                          required
                          className={styles.primaryCol}
                        />

                        <input
                          type="text"
                          name="email"
                          placeholder="Code"
                          value={resetData.code}
                          onChange={(e) => {
                            setResetData({
                              ...resetData,
                              code: e.target.value,
                            });
                          }}
                          required
                          className={styles.secondaryCol}
                        />
                      </div>

                      <div className={styles.linkRow}>
                        <a href="#" className={styles.primaryCol}>
                          Send Code
                        </a>
                        <a
                          href="#"
                          className={`${styles.secondaryCol} ${styles.mutedLink}`}
                        >
                          Resend Code? 50s
                        </a>
                      </div>
                    </div>

                    <div className={styles["reset-info-form-right"]}>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldHeader}>
                          <h4>Password</h4>
                        </div>

                        <div className={styles["password-wrapper"]}>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="password"
                            placeholder="New Password"
                            value={resetData.newPassword}
                            onChange={(e) => {
                              setResetData({
                                ...resetData,
                                newPassword: e.target.value,
                              });
                            }}
                            required
                          />

                          <span
                            className={styles["eye-icon"]}
                            onClick={() =>
                              setShowNewPassword(!showNewPassword)
                            }
                          >
                            {showNewPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                                />
                                <circle
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  cx="12"
                                  cy="12"
                                  r="3"
                                />
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className={`${styles.fieldGroup} ${styles.topSpaced}`}>
                        <h4>Confirm Password:</h4>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Re-enter new Password"
                          value={resetData.confirmNewPassword}
                          onChange={(e) => {
                            setResetData({
                              ...resetData,
                              confirmNewPassword: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {loginError && (
                    <p className={styles["login-error"]}>{loginError}</p>
                  )}

                  <div className={styles["button-back-container"]}>
                    <button
                      type="submit"
                      className={`${styles["login-btn"]} ${styles.autoWidthButton}`}
                    >
                      Change password
                    </button>

                    <button
                      type="button"
                      className={styles["back-btn"]}
                      onClick={() => {
                        setView("login");
                      }}
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
            )}

            {view === "regis" && (
              <div className={`${styles["regis-form"]} ${styles.formPanel} ${styles.panelFromRight}`}>
                <form
                  className={styles["regis-info-form"]}
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const isValidEmail =
                      /^[^\s@]+@[^\s@]+\.(com)$/.test(resetData.valid_email);

                    if (!isValidEmail) {
                      setLoginError("* Please enter a valid email address *");
                      return;
                    }

                    generateAndSendCode(
                      resetData.valid_email,
                      credentials.email,
                      true
                    );
                    setView("mfaVerify");
                  }}
                >
                  <div className={styles["regis-info-inner"]}>
                    <div className={styles["regis-info-form-left"]}>
                      <h4 className={styles.labelWithInfo}>
                        Username
                        <span
                          className={styles.infoWrap}
                          tabIndex={0}
                          aria-label="Password requirements"
                        >
                          <img
                            className={styles.infoIcon}
                            src="../public/icons/i-icon.png"
                            alt=""
                          />
                          <span className={styles.tooltip}>
                            Placeholder ehe <br />
                            Placeholder ehe
                            <br />
                            Placeholder ehe <br />
                            Placeholder ehe
                          </span>
                        </span>
                      </h4>

                      <input
                        type="text"
                        name="username"
                        placeholder="Enter your preferred username"
                        value={regisInfo.regis_username}
                        onChange={(e) => {
                          setRegisInfo({
                            ...regisInfo,
                            regis_username: e.target.value,
                          });
                        }}
                        required
                        className={styles.noBottomMargin}
                      />

                      <div className={`${styles.rowHeader} ${styles.topSpaced}`}>
                        <h4 className={styles.primaryCol}>Valid Email Address</h4>
                        <h4 className={styles.secondaryCol}>Email Code</h4>
                      </div>

                      <div className={styles.splitRow}>
                        <input
                          type="email"
                          name="username"
                          placeholder="Enter your email"
                          value={regisInfo.regis_valid_email}
                          onChange={(e) => {
                            setRegisInfo({
                              ...regisInfo,
                              regis_valid_email: e.target.value,
                            });
                          }}
                          required
                          className={styles.primaryCol}
                        />

                        <input
                          type="text"
                          name="email"
                          placeholder="Code"
                          value={regisInfo.regis_code}
                          onChange={(e) => {
                            setRegisInfo({
                              ...regisInfo,
                              regis_code: e.target.value,
                            });
                          }}
                          required
                          className={styles.secondaryCol}
                        />
                      </div>

                      <div className={styles.linkRow}>
                        <a href="#" className={styles.primaryCol}>
                          Send Code
                        </a>
                        <a
                          href="#"
                          className={`${styles.secondaryCol} ${styles.mutedLink}`}
                        >
                          Resend Code? 50s
                        </a>
                      </div>
                    </div>

                    <div className={styles["regis-info-form-right"]}>
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldHeader}>
                          <h4 className={styles.labelWithInfo}>
                            Password
                            <span
                              className={styles.infoWrap}
                              tabIndex={0}
                              aria-label="Password requirements"
                            >
                              <img
                                className={styles.infoIcon}
                                src={`${import.meta.env.BASE_URL}icons/tooltip.png`}
                                alt=""
                              />
                              <span className={styles.tooltip}>
                                Use at least 8 characters, <br />
                                with a mix of letters and numbers.
                                <br />
                                Use at least 8 characters, <br />
                                with a mix of letters and numbers.
                                <br />
                              </span>
                            </span>
                          </h4>
                        </div>

                        <div className={styles["password-wrapper"]}>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="password"
                            placeholder="New Password"
                            value={regisInfo.regis_pass}
                            onChange={(e) => {
                              setRegisInfo({
                                ...regisInfo,
                                regis_pass: e.target.value,
                              });
                            }}
                            required
                          />

                          <span
                            className={styles["eye-icon"]}
                            onClick={() =>
                              setShowNewPassword(!showNewPassword)
                            }
                          >
                            {showNewPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                                />
                                <circle
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  cx="12"
                                  cy="12"
                                  r="3"
                                />
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className={`${styles.fieldGroup} ${styles.topSpaced}`}>
                        <h4>Confirm Password:</h4>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Re-enter new Password"
                          value={regisInfo.regis_confirm_pass}
                          onChange={(e) => {
                            setRegisInfo({
                              ...regisInfo,
                              regis_confirm_pass: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {loginError && (
                    <p className={styles["login-error"]}>{loginError}</p>
                  )}

                  <div className={styles["button-back-container"]}>
                    <button type="submit" className={styles["login-btn"]}>
                      Register
                    </button>
                  </div>
                </form>
              </div>
            )}

            {view === "mfaVerify" && (
              <>
                <h2>Enter Your Code</h2>

                <p className={styles["login-pass-details"]}>
                  We’ve sent a 6-digit code to{" "}
                  <strong>{resetData.valid_email}</strong>.
                </p>

                <form
                  className={`${styles["code-form"]} ${styles.formPanel} ${styles.panelFromRight}`}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const code = e.target.elements.code.value.trim();
                    const savedCode = localStorage.getItem("reset_code");

                    if (code === savedCode) {
                      try {
                        const response = await axios.post(
                          "http://127.0.0.1:8000/login/",
                          {
                            email: credentials.email,
                            password: credentials.password,
                          }
                        );

                        const data = response.data;

                        if (data.success) {
                          localStorage.setItem("login_attempts", "0");
                          console.log("Login successful:", data);
                          localStorage.setItem(
                            "user",
                            JSON.stringify(data.data)
                          );
                          navigate("/");
                        }
                      } catch (e) {
                        console.error("Login error:", e);
                        alert("Something went wrong. Please try again.");
                      }
                    } else {
                      setLoginError("* Incorrect code, please try again *");
                    }
                  }}
                >
                  <label className={styles.codeLabel}>
                    Confirmation Code:
                    <input
                      type="text"
                      name="code"
                      placeholder="123456"
                      maxLength={6}
                      required
                      inputMode="numeric"
                      pattern="\d{6}"
                    />
                  </label>

                  {loginError && (
                    <p className={styles["login-error"]}>{loginError}</p>
                  )}

                  <div className={styles["button-back-container"]}>
                    <button type="submit" className={styles["login-btn"]}>
                      Verify Code
                    </button>

                    <button
                      type="button"
                      className={styles["back-btn"]}
                      onClick={() => {
                        setView("login");
                        setCredentials({ email: "", password: "" });
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
      </div>
    </div>
  );
}
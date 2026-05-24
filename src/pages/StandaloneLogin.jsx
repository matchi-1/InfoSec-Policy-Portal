import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./StandaloneLogin.module.css";
import tooltipIcon from "../public/icons/tooltip.png";

export default function StandaloneLogin() {

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [view, setView] = useState("login"); // login | forgot | regis

  const initialResetData = {
    valid_email: "",
    code: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const initialRegisInfo = {
    regis_firstName: "",
    regis_lastName: "",
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
  const [loginMessageType, setLoginMessageType] = useState("error"); 

  const [regisStep, setRegisStep] = useState("details"); 

  const backendBaseUrl =
  (import.meta.env.VITE_BACKEND_API_BASE || "http://127.0.0.1:8000").replace(
    /\/$/,
    "",
  );

  const ALLOW_DEV_EMAIL_BYPASS =
    import.meta.env.VITE_ALLOW_EMAIL_DEV_BYPASS === "true";

  const REGISTER_CODE_COOLDOWN_SECONDS = 60;
  const [regisCodeSent, setRegisCodeSent] = useState(false);
  const [regisEmailVerified, setRegisEmailVerified] = useState(false);
  const [regisSendingCode, setRegisSendingCode] = useState(false);
  const [regisResendSeconds, setRegisResendSeconds] = useState(0);
  const [regisDevBypass, setRegisDevBypass] = useState(false);

  const [forgotStep, setForgotStep] = useState("email");
  // email | reset

  const RESET_CODE_COOLDOWN_SECONDS = 60;
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [resetSendingCode, setResetSendingCode] = useState(false);
  const [resetResendSeconds, setResetResendSeconds] = useState(0);



  /*const isNewPassSame = async (newPass) => {
    console.log("checking password");
    console.log("EMAIL" + resetData.valid_email);
    console.log("NEW PASS INPUTTED: " + newPass);

    const res = await fetch("http://127.0.0.1:8000/check-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: resetData.valid_email,
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
*/
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

  useEffect(() => {
    if (regisResendSeconds <= 0) return;

    const timer = setTimeout(() => {
      setRegisResendSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [regisResendSeconds]);

  useEffect(() => {
    if (resetResendSeconds <= 0) return;

    const timer = setTimeout(() => {
      setResetResendSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [resetResendSeconds]);

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
        setLoginMessageType("error");
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
        localStorage.setItem('login_attempts', '0');
        console.log("Login successful:", data);
        localStorage.setItem("user", JSON.stringify(data.data));
        setLoginError("");
        //setView("mfa");
        navigate("/");
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
          setLoginError("");
          setView("forgot");
        }

        const { message } = err.response.data;
        console.error("Login failed:", message);
        setLoginMessageType("error");
        setLoginError("* " + message + " *");
      } else {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleChangePassword = async () => {
    if (!isResetFormReady) {
      setLoginMessageType("error");
      setLoginError(`* ${resetFormDisabledReason || "Please fill up all the forms"} *`);
      return;
    }

    const verified = await handleVerifyResetCode();
    if (!verified) return;

    try {
      const res = await fetch(`${backendBaseUrl}/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetData.valid_email,
          newPassword: resetData.newPassword,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setLoginMessageType("success");
        setLoginError(`Password change for ${resetData.valid_email} successful.`);

        setResetData(initialResetData);
        setResetCodeSent(false);
        setResetResendSeconds(0);
        setForgotStep("email");
        setView("login");
      } else {
        setLoginMessageType("error");
        setLoginError(`* ${result.message || "Something went wrong."} *`);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Something went wrong. Please try again.";

      setLoginMessageType("error");
      setLoginError(`* ${msg} *`);
    }
  };

  const isLoginActive = view === "login" || view === "forgot";


  const isRegisEmailValid = /^[^\s@]+@[^\s@]+\.(com)$/.test(
    (regisInfo.regis_valid_email || "").trim(),
  );

  const isRegisPasswordValid = /(?=.*[A-Za-z])(?=.*\d).{8,}/.test(
    regisInfo.regis_pass || "",
  );

  const isRegisDetailsFilled =
    (regisInfo.regis_firstName || "").trim() &&
    (regisInfo.regis_lastName || "").trim() &&
    (regisInfo.regis_valid_email || "").trim() &&
    regisInfo.regis_pass &&
    regisInfo.regis_confirm_pass;

  const isRegisDetailsReady =
    isRegisDetailsFilled &&
    isRegisEmailValid &&
    isRegisPasswordValid &&
    regisInfo.regis_pass === regisInfo.regis_confirm_pass;

  const detailsDisabledReason = !isRegisDetailsFilled
    ? "Please fill up all the forms"
    : !isRegisEmailValid
      ? "Please enter a valid email address"
      : !isRegisPasswordValid
        ? "Password must be at least 8 characters and include letters and numbers"
        : regisInfo.regis_pass !== regisInfo.regis_confirm_pass
          ? "Passwords do not match"
          : "";

  const isRegisVerificationReady =
    regisDevBypass ||
    (regisCodeSent && (regisInfo.regis_code || "").trim());

  const verifyDisabledReason = !regisCodeSent && !regisDevBypass
    ? "Please send the email code first"
    : !regisDevBypass && !(regisInfo.regis_code || "").trim()
      ? "Please enter the verification code"
      : "";

  const handleSendRegisterCode = async () => {
    if (!isRegisEmailValid) {
      setLoginError("* Please enter a valid email address first *");
      return false;
    }

    if (regisResendSeconds > 0 || regisSendingCode) return false;

    try {
      setRegisSendingCode(true);
      setLoginError("");

      const resp = await axios.post(`${backendBaseUrl}/auth/send-code/`, {
        email: regisInfo.regis_valid_email,
        purpose: "register",
      });

      if (resp.data.success) {
        setRegisCodeSent(true);
        setRegisEmailVerified(false);
        setRegisResendSeconds(
          resp.data.cooldown_seconds || REGISTER_CODE_COOLDOWN_SECONDS,
        );
        setLoginMessageType("success");
        setLoginError("* Verification code sent. Please check your email. *");
        return true;
      }

      return false;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to send verification code.";
      
      setLoginMessageType("error");
      setLoginError(`* ${msg} *`);
      return false;
    } finally {
      setRegisSendingCode(false);
    }
  };

  const handleVerifyRegisterCode = async () => {
    if (regisDevBypass) return true;

    try {
      const resp = await axios.post(`${backendBaseUrl}/auth/verify-code/`, {
        email: regisInfo.regis_valid_email,
        code: regisInfo.regis_code,
        purpose: "register",
      });

      if (resp.data.success) {
        setRegisEmailVerified(true);
        return true;
      }
      setLoginMessageType("error");
      setLoginError(`* ${resp.data.message || "Invalid verification code"} *`);
      return false;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Invalid verification code.";
      
      setLoginMessageType("error");
      setLoginError(`* ${msg} *`);
      return false;
    }
  };

  const handleVerifyResetCode = async () => {
    try {
      const resp = await axios.post(`${backendBaseUrl}/auth/verify-code/`, {
        email: resetData.valid_email,
        code: resetData.code,
        purpose: "reset_password",
      });

      if (resp.data.success) {
        return true;
      }

      setLoginMessageType("error");
      setLoginError(`* ${resp.data.message || "Invalid verification code"} *`);
      return false;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Invalid verification code.";

      setLoginMessageType("error");
      setLoginError(`* ${msg} *`);
      return false;
    }
  };


  const handleDevBypassRegisterCode = () => {
    if (!ALLOW_DEV_EMAIL_BYPASS) return;

    setRegisDevBypass(true);
    setRegisCodeSent(true);
    setRegisEmailVerified(true);
    setRegisResendSeconds(0);
    setRegisInfo((prev) => ({
      ...prev,
      regis_code: "DEV-BYPASS",
    }));
    setLoginMessageType("success");
    setLoginError("* Dev bypass enabled for email verification. *");
  };


  const handleRegisterDetailsSubmit = async () => {
    if (!isRegisDetailsReady) {
      setLoginMessageType("error");
      setLoginError(`* ${detailsDisabledReason || "Please fill up all the forms"} *`);
      return;
    }

    const sent = await handleSendRegisterCode();

    if (sent) {
      setRegisStep("verify");
    }
  };

  const handleFinalRegisterSubmit = async () => {
    if (!isRegisVerificationReady) {
      setLoginMessageType("error");
      setLoginError(`* ${verifyDisabledReason || "Please enter the verification code"} *`);
      return;
    }

    const verified = await handleVerifyRegisterCode();
    if (!verified) return;

    try {
      const resp = await axios.post(`${backendBaseUrl}/register/`, {
        first_name: regisInfo.regis_firstName,
        last_name: regisInfo.regis_lastName,
        email: regisInfo.regis_valid_email,
        password: regisInfo.regis_pass,
        confirm_password: regisInfo.regis_confirm_pass,
        dev_bypass: regisDevBypass,
      });

      if (resp.data.success) {
        localStorage.setItem("user", JSON.stringify(resp.data.data));
        setLoginError("");
        navigate("/");
      } else {
        setLoginError(`* ${resp.data.message || "Registration failed"} *`);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Something went wrong. Please try again.";

      setLoginError(`* ${msg} *`);
    }
  };

  const isResetEmailValid = /^[^\s@]+@[^\s@]+\.(com)$/.test(
    (resetData.valid_email || "").trim(),
  );

  const isResetPasswordValid = /(?=.*[A-Za-z])(?=.*\d).{8,}/.test(
    resetData.newPassword || "",
  );

  const isResetEmailReady =
    (resetData.valid_email || "").trim() && isResetEmailValid;

  const resetEmailDisabledReason = !(resetData.valid_email || "").trim()
    ? "Please enter your email address"
    : !isResetEmailValid
      ? "Please enter a valid email address"
      : "";

  const isResetFormReady =
    resetCodeSent &&
    (resetData.code || "").trim() &&
    resetData.newPassword &&
    resetData.confirmNewPassword &&
    isResetPasswordValid &&
    resetData.newPassword === resetData.confirmNewPassword;

  const resetFormDisabledReason = !resetCodeSent
    ? "Please send the email code first"
    : !(resetData.code || "").trim()
      ? "Please enter the verification code"
      : !resetData.newPassword || !resetData.confirmNewPassword
        ? "Please fill up all the forms"
        : !isResetPasswordValid
          ? "Password must be at least 8 characters and include letters and numbers"
          : resetData.newPassword !== resetData.confirmNewPassword
            ? "Passwords do not match"
            : "";
            
  const handleSendResetCode = async () => {
    if (!isResetEmailValid) {
      setLoginMessageType("error");
      setLoginError("* Please enter a valid email address first *");
      return false;
    }

    if (resetResendSeconds > 0 || resetSendingCode) return false;

    try {
      setResetSendingCode(true);
      setLoginError("");

      const resp = await axios.post(`${backendBaseUrl}/auth/send-code/`, {
        email: resetData.valid_email,
        purpose: "reset_password",
      });

      if (resp.data.success) {
        setResetCodeSent(true);
        setResetResendSeconds(
          resp.data.cooldown_seconds || RESET_CODE_COOLDOWN_SECONDS,
        );

        setLoginMessageType("success");
        setLoginError("* Verification code sent. Please check your email. *");

        return true;
      }

      return false;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to send verification code.";

      setLoginMessageType("error");
      setLoginError(`* ${msg} *`);
      return false;
    } finally {
      setResetSendingCode(false);
    }
  };


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
            onClick={() => {
              setView("login");
              setLoginError("");
            }}
            role="tab"
            aria-selected={isLoginActive}
          >
            Login
          </button>

          <button
            type="button"
            className={`${styles.tab} ${view === "regis" ? styles.active : ""}`}
            onClick={() => {
              setView("regis");
              setLoginError("");
            }}
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
              {view === "regis" && regisStep === "details" && "Sign Up"}
              {view === "regis" && regisStep !== "details" && "Verify Email"}
            </h2>

            {view === "login" && (
              <div className={`${styles["login-form"]} ${styles.formPanel} ${styles.panelFromLeft}`}>
                <form
                  className={styles["login-info-form"]}
                  onSubmit={handleLogin}
                >
                  <h4>Email</h4>

                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
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
                        setLoginError("");
                        setLoginMessageType("error");
                        setResetData(initialResetData);
                        setResetCodeSent(false);
                        setResetResendSeconds(0);
                        setForgotStep("email");
                        setView("forgot");
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  {loginError && (
                        <p
                          className={`${styles["login-error"]} ${
                        loginMessageType === "success" ? styles["login-success"] : ""
                      }`}
                        >
                          {loginError}
                        </p>
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

                    if (forgotStep === "email") {
                      if (!isResetEmailReady) {
                        setLoginMessageType("error");
                        setLoginError(`* ${resetEmailDisabledReason || "Please enter your email address"} *`);
                        return;
                      }

                      const sent = await handleSendResetCode();

                      if (sent) {
                        setForgotStep("reset");
                      }

                      return;
                    }

                    await handleChangePassword();
                  }}
                >
                  {forgotStep === "email" ? (
                    <>
                      <div className={styles.forgotEmailPanel}>
                        <p className={styles.verifyEmailText}>
                          Enter the email address linked to your account. We’ll send a
                          verification code you can use to reset your password.
                        </p>


                        <div style={{ width: "80%", alignSelf: "center" }}>
                          <input
                          
                          type="email"
                          placeholder="Enter your email"
                          value={resetData.valid_email}
                          onChange={(e) => {
                            setResetData({
                              ...resetData,
                              valid_email: e.target.value,
                              code: "",
                            });
                            setResetCodeSent(false);
                            setResetResendSeconds(0);
                          }}
                          required
                        />
                        </div>
                        
                      </div>

                      {loginError && (
                        <p
                          className={`${styles["login-error"]} ${
                            loginMessageType === "success" ? styles["login-success"] : ""
                          }`}
                        >
                          {loginError}
                        </p>
                      )}

                      <div className={styles["button-back-container"]}>
                        <button type="submit" className={styles["login-btn"]}>
                          {resetSendingCode ? "Sending..." : "Continue"}
                        </button>

                        <button
                          type="button"
                          className={styles["back-btn"]}
                          onClick={() => {
                            setLoginError("");
                            setResetData(initialResetData);
                            setResetCodeSent(false);
                            setResetResendSeconds(0);
                            setForgotStep("email");
                            setView("login");
                          }}
                        >
                          Back
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.forgotResetPanel}>
                        <p className={styles.verifyEmailText}>
                          We sent a verification code to{" "}
                          <strong>{resetData.valid_email}</strong>. Enter the code below
                          within 10 minutes, then set your new password.
                        </p>

                        <div style = {{width:"50%", alignSelf:"center" }}>
                        
                        <input
                          type="text"
                          placeholder="Enter verification code"
                          value={resetData.code}
                          onChange={(e) => {
                            setResetData({
                              ...resetData,
                              code: e.target.value,
                            });
                          }}
                          className={styles.verifyCodeInput}
                          required
                        />

                        </div>

                        <div className={styles.resendRow}>
                          <button
                            type="button"
                            className={styles.resendCodeButton}
                            onClick={handleSendResetCode}
                            disabled={resetResendSeconds > 0 || resetSendingCode}
                          >
                            {resetSendingCode
                              ? "Sending..."
                              : resetResendSeconds > 0
                                ? `Resend code in ${resetResendSeconds}s`
                                : "Resend code"}
                          </button>
                        </div>

                        <div className={styles.resetPasswordFields}>
                          <div className={styles.fieldGroup}>
                            
                            
                            <h4 className={styles.labelWithInfo}>
                                Password
                                <span
                                  className={styles.infoWrap}
                                  tabIndex={0}
                                  aria-label="Password requirements"
                                >
                                  <img
                                    className={styles.infoIcon}
                                    src={tooltipIcon}
                                    alt="Tooltip"
                                  />
                                  <span className={styles.tooltip}>
                                    Use at least 8 characters, <br />
                                    with a mix of letters and numbers.
                                    <br />
                                  </span>
                                </span>
                              </h4>


                            <div className={styles["password-wrapper"]}>
                              <input
                                type={showNewPassword ? "text" : "password"}
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
                                onClick={() => setShowNewPassword(!showNewPassword)}
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

                          <div className={styles.fieldGroup}>
                            <h4>Confirm Password</h4>

                            <input
                              type="password"
                              placeholder="Re-enter new password"
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
                        <p
                          className={`${styles["login-error"]} ${
                            loginMessageType === "success" ? styles["login-success"] : ""
                          }`}
                        >
                          {loginError}
                        </p>
                      )}

                      <div className={`${styles["button-back-container"]} ${styles.verifyButtonStack}`}>
                        <button type="submit" className={styles["login-btn"]}>
                          Change Password
                        </button>

                        <button
                          type="button"
                          className={styles["back-btn"]}
                          onClick={() => {
                            setLoginError("");
                            setForgotStep("email");
                          }}
                        >
                          Back
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}



            {view === "regis" && (
              <div className={`${styles["regis-form"]} ${styles.formPanel} ${styles.panelFromRight}`}>
                <form
                  className={styles["regis-info-form"]}
                  onSubmit={async (e) => {
                    e.preventDefault();

                    if (regisStep === "details") {
                      await handleRegisterDetailsSubmit();
                    } else {
                      await handleFinalRegisterSubmit();
                    }
                  }}
                >
                  {regisStep === "details" ? (
                    <>
                      <div className={styles["regis-info-inner"]}>
                        <div className={styles["regis-info-form-left"]}>
                          <div className={styles.rowHeaderEqual}>
                            <h4 className={styles.primaryCol}>First Name</h4>
                            <h4 className={styles.secondaryCol}>Last Name</h4>
                          </div>

                          <div className={styles.splitRowEqual}>
                            <input
                              type="text"
                              placeholder="Enter your first name"
                              value={regisInfo.regis_firstName}
                              onChange={(e) => {
                                setRegisInfo({
                                  ...regisInfo,
                                  regis_firstName: e.target.value,
                                });
                              }}
                              required
                              className={styles.primaryCol}
                            />

                            <input
                              type="text"
                              placeholder="Enter your last name"
                              value={regisInfo.regis_lastName}
                              onChange={(e) => {
                                setRegisInfo({
                                  ...regisInfo,
                                  regis_lastName: e.target.value,
                                });
                              }}
                              required
                              className={styles.secondaryCol}
                            />
                          </div>

                          <div className={`${styles.fieldGroup} ${styles.topSpaced}`}>
                            <h4>Valid Email Address</h4>

                            <input
                              type="email"
                              placeholder="Enter your email"
                              value={regisInfo.regis_valid_email}
                              onChange={(e) => {
                                setRegisInfo({
                                  ...regisInfo,
                                  regis_valid_email: e.target.value,
                                  regis_code: "",
                                });
                                setRegisCodeSent(false);
                                setRegisEmailVerified(false);
                                setRegisDevBypass(false);
                                setRegisResendSeconds(0);
                                setRegisStep("details");
                              }}
                              required
                            />
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
                                    src={tooltipIcon}
                                    alt="Tooltip"
                                  />
                                  <span className={styles.tooltip}>
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
                                onClick={() => setShowNewPassword(!showNewPassword)}
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
                        <p
                          className={`${styles["login-error"]} ${
                        loginMessageType === "success" ? styles["login-success"] : ""
                      }`}
                        >
                          {loginError}
                        </p>
                      )}

                      <div className={styles["button-back-container"]}>
                        <button type="submit" className={styles["login-btn"]}>
                          {regisSendingCode ? "Sending..." : "Register"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.registerVerifyPanel}>
                        {//<h3 className={styles.verifyTitle}>Verify your email</h3>
                        }
                        <p className={styles.verifyEmailText}>
                          We sent a verification code to{" "}
                          <strong>{regisInfo.regis_valid_email}</strong>. Enter the code below within 10 minutes to
                          confirm your email address.
                        </p>

                        <div style={{ width: "70%", alignSelf: "center" }}>
                          <input
                          type="text"
                          placeholder="Enter verification code"
                          value={regisInfo.regis_code}
                          onChange={(e) => {
                            setRegisInfo({
                              ...regisInfo,
                              regis_code: e.target.value,
                            });
                            setRegisEmailVerified(false);
                          }}
                          disabled={regisDevBypass}
                          className={`${styles.verifyCodeInput} ${
                            regisDevBypass ? styles.disabledInput : ""
                          }`}
                        />

                          </div>



                        
                        

                        <div className={styles.resendRow}>
                          <button
                            type="button"
                            className={styles.resendCodeButton}
                            onClick={handleSendRegisterCode}
                            disabled={regisResendSeconds > 0 || regisSendingCode}
                          >
                            {regisSendingCode
                              ? "Sending..."
                              : regisResendSeconds > 0
                                ? `Resend code in ${regisResendSeconds}s`
                                : "Resend code"}
                          </button>
                        </div>

                        {/*ALLOW_DEV_EMAIL_BYPASS && (
                          <button
                            type="button"
                            className={styles.devBypassLink}
                            onClick={handleDevBypassRegisterCode}
                          >
                            Dev exit: bypass email verification
                          </button>
                        )*/}

                        {loginError && (
                        <p
                          className={`${styles["login-error"]} ${
                        loginMessageType === "success" ? styles["login-success"] : ""
                      }`}
                        >
                          {loginError}
                        </p>
                      )}

                      <div className={`${styles["button-back-container"]} ${styles.verifyButtonStack}`}>
                        <button type="submit" className={styles["login-btn"]}>
                          Register
                        </button>

                        <button
                          type="button"
                          className={styles["back-btn"]}
                          onClick={() => {
                            setLoginError("");
                            setRegisStep("details");
                          }}
                        >
                          Back
                        </button>
                      </div>

                      </div>

                      
                    </>
                  )}
                </form>
              </div>
            )}

           
          </div>
        </div>
      </div>
    </div>
  );
}
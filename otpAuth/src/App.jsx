import "./index.css";
import { useState } from "react";
import { app } from "./firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

export default function App() {
  const countryCode = "+91";
  const [phoneNumber, setPhoneNumber] = useState(countryCode);
  const [OTP, setOTP] = useState("");
  // console.log(phoneNumber);
  const auth = getAuth();

  const generateRecaptchVerifier = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: response => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        },
      }
    );
  };

  const verifyOTP = e => {
    let otp = e.target.value;
    setOTP(otp);
    if (otp.length === 6) {
      console.log(OTP);
      const confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then(result => {
          // User signed in successfully.
          const user = result.user;
          // console.log("successfully");
          toast.success("Login Successfully");
          // ...
        })
        .catch(error => {
          // User couldn't sign in (bad verification code?)
          // ...
          console.log(error);
          console.log("error");
        });
    }
  };

  const handleInputChange = e => {
    e.preventDefault();
    console.log(e.target.value);
    setPhoneNumber(e.target.value);
  };

  const requestOTP = e => {
    e.preventDefault();
    generateRecaptchVerifier();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch(error => {
        // Error; SMS not sent
        // ...
        console.log(error);
      });
  };

  return (
    <div className="App">
      <form>
        <h1>Sign In With Phone Number</h1>
        <label htmlFor="phoneNumber">Phone</label>
        <input
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={e => handleInputChange(e)}
        />
        <button onClick={e => requestOTP(e)}>Request OTP</button>

        <p>please enter your otp</p>
        <input
          type="text"
          maxLength={6}
          value={OTP}
          onChange={e => verifyOTP(e)}
        />
        <button onClick={e => e.preventDefault()}>Login</button>
        <h1>{OTP}</h1>
        <div id="recaptcha-container"></div>
      </form>
      <ToastContainer />
    </div>
  );
}

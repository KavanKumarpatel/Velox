import React, { useEffect, useState } from "react";
import "../../Css/admin.css";
import { usePassword } from "../../hooks/InputValidator";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  // const isAdmin = false;

  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [pass, setpass] = useState("");

  const signInSubmitHandler = (e) => {
    e.preventDefault();

    dispatch(adminLogin(pass));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div className="container" id="container" style={{ width: "300px" }}>
      <div className="form-container sign-in">
        <form onSubmit={signInSubmitHandler}>
          <h1>Admin Log In</h1>
          <span>Use your Passkey to Login</span>
          <input
            type="password"
            placeholder="passkey"
            value={pass}
            onChange={(e) => setpass(e.currentTarget.value)}
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

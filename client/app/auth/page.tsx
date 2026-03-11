"use client";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          borderRadius: 12,
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          border: "1px solid rgba(139,105,20,0.2)",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--navy)",
            marginBottom: 10,
          }}
        >
          {isLogin ? "Login to E-Bench" : "Create Account"}
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "var(--text-light)",
            marginBottom: 25,
          }}
        >
          Access AI powered legal intelligence
        </p>

        {!isLogin && (
          <input
            placeholder="Full Name"
            style={inputStyle}
          />
        )}

        <input
          placeholder="Email"
          type="email"
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          style={inputStyle}
        />

        <button
          style={{
            width: "100%",
            background: "linear-gradient(135deg,#8B6914,#C4963A)",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: 6,
            fontWeight: 600,
            marginTop: 10,
            cursor: "pointer",
          }}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
          }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{
              marginLeft: 6,
              color: "#C4963A",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 14,
};
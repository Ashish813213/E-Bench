"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"user" | "consultant">("user");
  const router = useRouter();

  const themeColor = "#C8B48A";
  const themeDark = "#8D7A55";
  const themeBorder = "#E7D9BE";

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
          width: "100%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: 12,
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          border: `1px solid ${themeBorder}`,
        }}
      >
        {/* User Type Toggle */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "30px",
            borderBottom: `2px solid ${themeBorder}`,
            paddingBottom: "16px",
          }}
        >
          <button
            onClick={() => setUserType("user")}
            style={{
              flex: 1,
              padding: "10px",
              background: userType === "user" ? themeColor : "transparent",
              color: userType === "user" ? "#fff" : themeDark,
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            User
          </button>
          <button
            onClick={() => setUserType("consultant")}
            style={{
              flex: 1,
              padding: "10px",
              background: userType === "consultant" ? themeColor : "transparent",
              color: userType === "consultant" ? "#fff" : themeDark,
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Consultant
          </button>
        </div>

        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: themeDark,
            marginBottom: 10,
          }}
        >
          {isLogin 
            ? `Login as ${userType === "consultant" ? "Consultant" : "User"}`
            : `Register as ${userType === "consultant" ? "Consultant" : "User"}`
          }
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "var(--text-light)",
            marginBottom: 25,
          }}
        >
          {userType === "consultant" 
            ? "Access advanced legal tools and connect with clients"
            : "Access AI powered legal intelligence"
          }
        </p>

        {/* Full Name - shown only on register */}
        {!isLogin && (
          <input
            placeholder="Full Name"
            style={inputStyle}
          />
        )}

        {/* Email */}
        <input
          placeholder="Email"
          type="email"
          style={inputStyle}
        />

        {/* Password */}
        <input
          placeholder="Password"
          type="password"
          style={inputStyle}
        />

        {/* Consultant-specific fields */}
        {userType === "consultant" && !isLogin && (
          <>
            <input
              placeholder="License Number"
              style={inputStyle}
            />
            <input
              placeholder="Bar Registration"
              style={inputStyle}
            />
            <select
              defaultValue=""
              style={{
                ...inputStyle,
                cursor: "pointer",
              }}
            >
              <option value="" disabled>
                Select Specialization
              </option>
              <option value="criminal">Criminal Law</option>
              <option value="civil">Civil Law</option>
              <option value="corporate">Corporate Law</option>
              <option value="family">Family Law</option>
              <option value="intellectual">Intellectual Property</option>
              <option value="labor">Labor Law</option>
              <option value="tax">Tax Law</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Professional Summary (Max 200 characters)"
              maxLength={200}
              style={{
                ...inputStyle,
                minHeight: "80px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </>
        )}

        {/* Submit Button */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${themeDark}, ${themeColor})`,
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: 6,
            fontWeight: 600,
            marginTop: 16,
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: 16,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(200, 180, 138, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {/* Toggle Login/Register */}
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
              color: themeColor,
              cursor: "pointer",
              fontWeight: 600,
              transition: "color 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = themeDark;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = themeColor;
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
  border: "1px solid #E7D9BE",
  fontSize: 14,
  boxSizing: "border-box" as const,
};
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logoSih.svg";
import styles from "./MainSideBar.module.css";
import { LogOut } from "lucide-react";
import { User, MessageCircle, Upload, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import AuthAxios from "../../utils/authaxios";
import toast from "react-hot-toast";
import { MoonIcon, SunIcon } from "lucide-react";
import AccessibilityButton from "../AccessibilityButton";

const MainSideBar = ({setContrast}) => {
  const location = useLocation();
  const router = useNavigate();

  // Initialize dark mode state from localStorage
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Effect to apply theme on component mount and when dark state changes
  useEffect(() => {
    if (dark) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Theme toggle handler
  const darkModeHandler = () => {
    setDark(prevDark => !prevDark);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-w-[70px] dark:bg-PrimaryBlack bg-DarkBlue flex flex-col items-center py-4 justify-between">
      <div>
        <img
          src={logo}
          style={{ marginLeft: "-2px" }}
          className={styles.logo}
          alt=""
        />
        <div
          style={{
            marginTop: "100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          {/* Home */}
          <div
            className={`${styles.logoDiv} ${
              isActive("/") && !isActive("/upload") && !isActive("/notebook")
                ? "bg-PrimaryBlue p-1.5 rounded-xl"
                : ""
            }`}
            onClick={() => {
              router("/");
            }}
          >
            <MessageCircle
              size={27}
              color={`${
                isActive("/") && !isActive("/upload") && !isActive("/notebook")
                  ? "white"
                  : "gray"
              }`}
            />
          </div>

          {/* Upload */}
          <div
            className={`${styles.logoDiv} ${
              isActive("/upload") ? "bg-PrimaryBlue p-1.5 rounded-xl" : ""
            }`}
            onClick={() => {
              router("/upload");
            }}
          >
            <Upload
              size={27}
              color={`${isActive("/upload") ? "white" : "gray"}`}
            />
          </div>

          {/* Notebook */}
          <div
            className={`${styles.logoDiv} ${
              isActive("/notebook") ? "bg-PrimaryBlue p-1.5 rounded-xl" : ""
            }`}
            onClick={() => {
              router("/notebook");
            }}
          >
            <NotebookPen
              size={27}
              color={`${isActive("/notebook") ? "white" : "gray"}`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="text-white">
          <button onClick={darkModeHandler}>
            {dark ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>

        <div>
          <AccessibilityButton setIsContrast={setContrast} white={true} />
        </div>

        <div
          onClick={async () => {
            const response = await AuthAxios.get("/auth/logout");
            const data = response.data;
            if (data.success) {
              toast.success("Logged out successfully");
              router("/landing");
            }
          }}
        >
          <LogOut size={30} color="white" />
        </div>
        <div
          style={{
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            backgroundColor: "#FFA500",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <User size={25} color="white" />
        </div>
      </div>
    </div>
  );
};

export default MainSideBar;
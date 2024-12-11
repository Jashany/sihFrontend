import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logoSih.svg";
import styles from "./MainSideBar.module.css";
import { LogOut } from "lucide-react";
import { User, MessageCircle, Upload, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import AuthAxios from "../../utils/authaxios";
import toast from "react-hot-toast";
import {ToggleRight, ToggleLeft} from 'lucide-react';


const MainSideBar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");

  useEffect(() => {
    setActive(location.pathname);
    console.log(location.pathname);
  }, [location.pathname]);

  const router = useNavigate();

 
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className={styles.main}>
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
      <div>

            <div>
              {
                mode === "dark" ? <ToggleRight size={30} color="white" onClick={async () => {
                  await localStorage.setItem("mode", "light");
                  setMode("light");
                }} /> : <ToggleLeft size={30} color="white" onClick={async () => {
                  await localStorage.setItem("mode", "dark");
                  setMode("dark");
                }} />
              }
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

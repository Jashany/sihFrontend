import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logoSih.svg";
import styles from "./MainSideBar.module.css";
import { LogOut } from "lucide-react";
import { User, MessageCircle, Upload, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";

const MainSideBar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
    console.log(location.pathname);
  }, [location.pathname]);

  const router = useNavigate();

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
            contentJustify: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <div
            className={`${styles.logoDiv} ${
              active === "/upload" || active === "/notebook"
                ? ""
                : "bg-PrimaryBlue p-1.5 rounded-xl "
            }`}

            onClick={()=>{
              router("/")
            }}

          >
            <MessageCircle
              size={27}
              color={`${
                active === "/upload" || active === "/notebook"
                  ? "gray"
                  : "white"
              }`}
            />
          </div>
          <div
            className={`${styles.logoDiv} ${
              active === "/upload" ? "bg-PrimaryBlue p-1.5 rounded-xl" : ""
            }`}

            onClick={()=>{
              router("/upload")
            }}
          >
            <Upload
              size={27}
              color={`${active === "/upload" ? "white" : "gray"}`}
            />
          </div>
          <div
            className={`${styles.logoDiv} ${
              active === "/notebook" ? "bg-PrimaryBlue p-1.5 rounded-xl " : ""
            }`}

            onClick={()=>{
              router("/notebook")
            }}
          >
            <NotebookPen
              size={27}
              color={`${active === "/notebook" ? "white" : "gray"}`}
            />
          </div>
        </div>
      </div>
      <div>
        <LogOut size={30} color="white" />
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

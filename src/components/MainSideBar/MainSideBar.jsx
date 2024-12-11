import logo from "../../assets/logoSih.svg";
import styles from "./MainSideBar.module.css";
import { LogOut } from "lucide-react";
import { User,MessageCircle,Upload,NotebookPen } from "lucide-react";

const MainSideBar = () => {
  return (
    <div className={styles.main}>
      <div >
        <img src={logo} style={{marginLeft:"-2px"}} className={styles.logo} alt="" />
        <div  style={{marginTop:"100px",display:"flex",flexDirection:"column",gap:"30px"}}>
        <div className={styles.logoDiv}>
        <MessageCircle size={27} color="white" />
        </div>
        <div className={styles.logoDiv}>
        <Upload size={27} color="white" />
        </div>
        <div className={styles.logoDiv}>
        <NotebookPen size={27} color="white" />
        </div>
        </div>
      </div>
      <div>
        <LogOut size={30} color="white" />
        <div style={{
            height:"30px",
            width:"30px",
            borderRadius:"50%",
            backgroundColor:"#FFA500",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",

        }}>
          <User size={25} color="white" />
        </div>
      </div>
    </div>
  );
};

export default MainSideBar;

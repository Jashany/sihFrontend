import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Component & Utility Imports
import AuthAxios from "../../utils/authaxios";
import AccessibilityButton from "../AccessibilityButton";
import logo from "../../assets/logoSih.svg";

// Icon Imports
import {
  LogOut,
  User,
  MessageCircle,
  NotebookPen,
  MoonIcon,
  SunIcon,
  Languages,
  Menu,
  X,
} from "lucide-react";

const MainSideBar = ({ setContrast }) => {
  const location = useLocation();
  const router = useNavigate();

  // State for mobile menu, language dropdown, and theme
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [language, setLanguage] = useState(() => localStorage.getItem("targetLanguage") || "English");

  // Effect to apply theme class to the body
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const darkModeHandler = () => setDark((prevDark) => !prevDark);
  const isActive = (path) => location.pathname === path;

  const handleLanguageChange = (lang) => {
    localStorage.setItem("targetLanguage", lang);
    setLanguage(lang);
    window.location.reload(); // Refresh to apply language changes globally
  };

  const handleLogout = async () => {
    try {
      const response = await AuthAxios.get("/auth/logout");
      if (response.data.success) {
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        router("/");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Language options
  const languageOptions = {
    en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu",
    bn: "Bengali", mr: "Marathi", pu: "Punjabi", gu: "Gujarati",
    or: "Oriya", as: "Assamese", ka: "Kannada", ma: "Malayalam",
    ur: "Urdu", sa: "Sanskrit", ne: "Nepali", bh: "Bhojpuri",
  };

  // Navigation items
  const navItems = [
    {
      path: "/chat",
      icon: MessageCircle,
      label: "Chat",
      // A more robust active check for nested routes
      isActive: location.pathname.startsWith("/chat") && !location.pathname.startsWith("/chat/notebook"),
    },
    {
      path: "/chat/notebook",
      icon: NotebookPen,
      label: "Notebook",
      isActive: location.pathname.startsWith("/chat/notebook"),
    },
  ];

  // Reusable UI component for sidebar content
  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Top Section: Logo, Language, and Nav */}
      <div className="flex-grow mx-auto">
        {isMobile && (
          <div className="flex items-center mx-auto mb-10">
            {/* <span className="text-white text-xl font-bold hidden lg:block">Menu</span> */}
            <button onClick={toggleMenu} className="text-white mx-auto">
              <X size={28} />
            </button>
          </div>
        )}
        <img
          src={logo}
          onClick={() => router("/")}
          className={`cursor-pointer ${isMobile ? 'h-10 w-10 mx-auto' : 'h-12 w-12'}`}
          alt="Logo"
        />

        {/* Language Selector */}
        <div className="relative mt-5 flex justify-center">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Languages size={30} color="white" />
          </button>
          {showLanguageDropdown && (
            <div className={`absolute bg-white text-black p-2 mt-12 rounded-lg shadow-lg w-36 z-20 ${isMobile ? 'left-1/2 -translate-x-1/2' : 'left-full ml-3'}`}>
              <ul className="max-h-60 overflow-y-auto">
                {Object.values(languageOptions).map((name) => (
                  <li
                    key={name}
                    className="cursor-pointer py-1.5 px-3 hover:bg-gray-200 rounded text-sm"
                    onClick={() => handleLanguageChange(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-16 flex flex-col items-center gap-6">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                item.isActive ? "bg-PrimaryBlue" : "hover:bg-PrimaryBlue/50"
              }`}
              onClick={() => {
                router(item.path);
                if (isMobile) toggleMenu();
              }}
              title={item.label}
            >
              <item.icon size={27} color={item.isActive ? "white" : "gray"} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="flex flex-col items-center gap-5">
        <button
          onClick={darkModeHandler}
          className="text-white p-2 rounded-full hover:bg-white/10"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark ? <SunIcon size={24} /> : <MoonIcon size={24} />}
        </button>

        <AccessibilityButton setIsContrast={setContrast} white={true} />

        <button
          onClick={handleLogout}
          className="text-white p-2 rounded-full hover:bg-red-500/50"
          title="Logout"
        >
          <LogOut size={28} />
        </button>

        <div
          className="h-[30px] w-[30px] rounded-full bg-orange-500 flex justify-center items-center"
          title="User Profile"
        >
          <User size={20} color="white" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* --- Hamburger Button for Mobile --- */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-DarkBlue/80 dark:bg-PrimaryBlack/80 text-white  rounded-full backdrop-blur-sm"
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* --- Mobile Slide-Out Menu --- */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          onClick={toggleMenu}
        ></div>
        {/* Menu Panel */}
        <div className="relative w-fit h-full bg-DarkBlue dark:bg-PrimaryBlack py-6 px-4">
          {renderSidebarContent(true)}
        </div>
      </div>

      {/* --- Desktop Sidebar --- */}
      <div className="hidden lg:flex min-w-[70px] dark:bg-PrimaryBlack bg-DarkBlue py-4">
        <div className="w-full">
          {renderSidebarContent(false)}
        </div>
      </div>
    </>
  );
};

export default MainSideBar;
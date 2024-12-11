import { useState } from "react";
import search from "../../assets/svgs/search.svg";

export function SearchBar({ onSearch }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-3.5 py-2 gap-0.5">
      <div className="relative flex bg-PrimaryGrayLight text-PrimaryGrayTextLight px-3 rounded-lg">
        {/* Conditionally render the SVG based on input focus */}
        {!isFocused && <img src={search} alt="searchicon" />}
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-PrimaryGrayLight text-PrimaryGrayTextDark placeholder:text-PrimaryGrayTextDark rounded-lg pl-1 pr-10 py-2"
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}  // Set focused state to true
          onBlur={() => setIsFocused(false)}  // Reset focused state to false
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { translateToLanguage } from "../../services/LanguageEnglish";

export function UserMessage({ content, user }) {
  const [translatedContent, setTranslatedContent] = useState(content);
  const [loading, setLoading] = useState(false);
  const targetLang = localStorage.getItem("targetLanguage") || "hi";

  useEffect(() => {
    const translateContent = async () => {
      setLoading(true);
      try {
        const translatedText = await translateToLanguage(content, targetLang);
        setTranslatedContent(translatedText);
      } catch (error) {
        console.error("Error translating content: ", error);
        setTranslatedContent(content);
      }
      setLoading(false);
    };

    if (content) {
      translateContent();
    }
  }, [content, targetLang]);

  return (
    // Responsive Padding: Simplified padding for better mobile display.
    <div className={`flex justify-end dark:bg-PrimaryGrayDark bg-SecondaryWhite rounded-xl p-3`}>
      {/* Responsive Alignment & Spacing: Use flex-row-reverse to keep avatar on the right. Better padding and gap on mobile. */}
      <div className="max-w-6xl flex flex-row-reverse items-start gap-3">
        <div className="my-auto">
          {user.image ? (
            <img src={user.image} alt="user avatar" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-2 flex items-center justify-center">
              <User size={20} className="text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>
        <div>
          {/* Responsive Text Padding: Reduced padding for mobile. */}
          <div className="rounded-lg px-2 py-1 sm:px-4 sm:py-3 text-right">
            <h1 className="dark:text-PrimaryGrayTextDark text-DarkBlue font-semibold">You</h1>
            <p className="dark:text-gray-200 text-PrimaryGrayDark whitespace-pre-wrap mt-1">
              {loading ? "Translating..." : translatedContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
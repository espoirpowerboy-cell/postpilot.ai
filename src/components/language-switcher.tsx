"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
      <button
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          language === "en"
            ? "bg-accent text-white"
            : "text-muted hover:bg-sidebar-hover"
        }`}
        title={t("common.english")}
      >
        <Globe className="h-3 w-3" />
        EN
      </button>
      <button
        onClick={() => setLanguage("fr")}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          language === "fr"
            ? "bg-accent text-white"
            : "text-muted hover:bg-sidebar-hover"
        }`}
        title={t("common.french")}
      >
        <Globe className="h-3 w-3" />
        FR
      </button>
    </div>
  );
}

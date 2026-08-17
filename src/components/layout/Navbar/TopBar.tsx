import type { WebsiteSettings } from "@/types/settings";
import { ThemeSwitcher } from "@/components/layout/Theme";
import { NavbarContact } from "./NavbarContact";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarSocial } from "./NavbarSocial";
import { SearchButton } from "./SearchButton";
export function TopBar({ settings }: { settings: WebsiteSettings }) { return <header className="website-topbar"><div className="container h-100 d-flex align-items-center justify-content-between gap-3"><NavbarLogo settings={settings} /><div className="d-flex align-items-center gap-4"><NavbarContact settings={settings} /><div className="reference-social d-flex align-items-center gap-3"><NavbarSocial links={settings.socialLinks} /><SearchButton variant="topbar" /><ThemeSwitcher /></div></div></div></header>; }

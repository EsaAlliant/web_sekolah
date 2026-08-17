import type { WebsiteSettings } from "@/types/settings";
import { MainNavbar } from "./MainNavbar";
export function Navbar({ settings }: { settings: WebsiteSettings }) { return <MainNavbar items={settings.navigation} />; }

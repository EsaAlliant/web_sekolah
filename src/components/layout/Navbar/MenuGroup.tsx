import type { NavigationItem } from "@/types/settings";
import { MegaDropdown } from "./MegaDropdown";
import { MenuItem } from "./MenuItem";
export function MenuGroup({ item, active }: { item: NavigationItem; active: boolean }) { return item.children?.length ? <MegaDropdown item={item} active={active} /> : <MenuItem item={item} active={active} />; }

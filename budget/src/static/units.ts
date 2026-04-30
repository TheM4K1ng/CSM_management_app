export type Unit = {
    id: string;
    name: string;
    icon?: string;
    rootSysId: string
};

export const UNITS:Unit[] = [
    { id: 'ממר"ם', name: 'ממר"ם', rootSysId: "root-0001", icon: "/chat-bubble.png" },
  { id: 'מצפ"ן', name: 'מצפ"ן', rootSysId: "root-0002", icon: "/koren.png" },
  { id: 'מעו"ף', name: 'מעו"ף', rootSysId: "root-0003", icon: "/cyber-attack.png" },
]
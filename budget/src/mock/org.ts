export type System = { 
    id: string;
    name: string;
    icon?: string; 
    description?: string; 
}
export type Team = { id: string; name: string; systems?: System[]};
export type Mador = { id: string; name: string; teams: Team[] };
export type Anaf = { id: string; name: string; madorim: Mador[] };
export type OrgTree = { anafim: Anaf[] };

export const orgByUnitId: Record<string, OrgTree> = {
  "1": {
    anafim: [
      {
        id: "idf-cts",
        name: "ענן מבצעי",
        madorim: [
          {
            id: "mador-cj-cts",
            name: "מדור CJ",
            teams: [
              { id: "team-noc", name: "NOC", systems: [
                { id: "sys-budget", name: "Budget API", icon: undefined },
                { id: "sys-collector", name: "Collector", icon: undefined },
                { id: "sys-ui", name: "UI Portal", icon: undefined },
              ]},
              { id: "team-csm", name: "CSM" },
              { id: "team-sa", name: "SA" },
            ],
          }, {
            id: "mador-core-cts",
            name: "מדור Core",
            teams: [
                { id: "team-compute-cts", name: "Compute"},
                { id: "team-ecosystem-cts", name: "Ecosystem"},
                { id: "team-storage-cts", name: "Storage"},
                { id: "team-network-cts", name: "Network"},
            ]
          }
        ],
      },
    ],
  },

  "2": {
    anafim: [
      {
        id: "anaf-sec",
        name: "Security",
        madorim: [
          {
            id: "madar-soc",
            name: "SOC",
            teams: [{ id: "team-c", name: "Team C" }],
          },
        ],
      },
    ],
  },

  "3": {
    anafim: [
      {
        id: "anaf-eng",
        name: "Engineering",
        madorim: [
          {
            id: "madar-platform",
            name: "Platform",
            teams: [
              { id: "team-d", name: "Team D" },
              { id: "team-e", name: "Team E" },
            ],
          },
        ],
      },
    ],
  },
};

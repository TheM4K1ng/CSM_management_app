export type Team = {
  id: number;
  name: string;
};

export type Mador = {
  id: number;
  name: string;
  teams: Team[];
};

export type Anaf = {
  id: number;
  name: string;
  madorim: Mador[];
};

export type UnitOrg = {
  unitId: number;
  anafim: Anaf[];
};

export type TeamRef = {
    unitId: number;
    anafId: number;
    madorId: number;
    teamId: number;
}
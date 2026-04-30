// import type { Anaf, Mador, Team, UnitOrg } from "../types/org";

// export const sumTeam = (t: Team) => ({
//     used: t.usedBudget,
//     total: t.totalBudget
// });

// export const sumMador = (m: Mador) => {
//   return m.teams.reduce(
//     (acc, t) => {
//       acc.used += t.usedBudget;
//       acc.total += t.totalBudget;
//       return acc;
//     },
//     { used: 0, total: 0 }
//   );
// };

// export const sumAnaf = (a: Anaf) => {
//   return a.madorim.reduce(
//     (acc, m) => {
//       const s = sumMador(m);
//       acc.used += s.used;
//       acc.total += s.total;
//       return acc;
//     },
//     { used: 0, total: 0 }
//   );
// };

// export const sumUnitOrg = (u: UnitOrg) => {
//   return u.anafim.reduce(
//     (acc, a) => {
//       const s = sumAnaf(a);
//       acc.used += s.used;
//       acc.total += s.total;
//       return acc;
//     },
//     { used: 0, total: 0 }
//   );
// };

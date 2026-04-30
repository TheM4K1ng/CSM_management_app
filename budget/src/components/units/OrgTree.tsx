// import { useMemo, useState } from "react";
// import type { UnitOrg, Anaf, Mador, Team } from "../../types/org";
// import { sumAnaf, sumMador } from "../../utils/orgAgg";

// type OrgTreeProps = {
//     org: UnitOrg;
//     onSelectTeam?: (team: Team) => void;
// };

// export function OrgTree({org, onSelectTeam}: OrgTreeProps){
//     const [openAnafId, setOpenAnafId] = useState<string | null>(null);
//     const [openMadorId, setOpenMadorId] = useState<string | null>(null);

//     const anafim = org.anafim;

//     const openAnaf = useMemo(
//         () => anafim.find(a => a.id === openAnafId) ?? null,[anafim, openAnafId]
//     );

//     const openMador = useMemo(() => {
//         if (!openAnaf) return null;
//         return openAnaf.madorim.find(m => m.id === openMadorId) ?? null;
//     }, [openAnaf, openMadorId]);

//     const handleAnafClick = (anaf: Anaf) => {
//         setOpenAnafId(prev => (prev === anaf.id ? null : anaf.id));
//         setOpenMadorId(null); //reset deeper level tree upon opening another anaf
//     };

//     const handleMadarClick = (mador: Mador) => {
//         setOpenMadorId(prev => (prev === mador.id ? null : mador.id));
//     };

//     return (
//         <div className="org-tree">
//             <div className="org-level">
//                 <div className="org-level-title">ענפים</div>

//                 <div className="org-list">
//                     {anafim.map(anaf => {
//                         const s = sumAnaf(anaf);
//                         const pct = s.total > 0 ? Math.round((s.used / s.total) * 100) : 0;

//                         return (
//                             <button
//                             key={anaf.id}
//                             type="button"
//                             className={`org-row ${openAnafId === anaf.id ? "active" : ""}`}
//                             onClick={() => handleAnafClick(anaf)}
//                             >
//                                 <div className="org-row-main">
//                                     <span className="org-name">{anaf.name}</span>
//                                     <span className="org-meta">
//                                         ${s.used.toLocaleString()} / ${s.total.toLocaleString()}
//                                     </span>
//                                 </div>

//                                 <div className="org-row-sub">
//                                     <div className="org-bar">
//                                         <div className="org-bar-fill" style={{width: `${pct}%`}}></div>
//                                         </div>
//                                         <span className="org-pct">{pct}%</span>
//                                 </div>
//                             </button>
//                         )
//                     })}
//                 </div>
//             </div>

//                     {openAnaf && (
//                         <div className="oeg-level">
//                             <div className="org-level-title">
//                                 מדורים - {openAnaf.name}
//                             </div>

//                             <div className="org-list">
//                                 {openAnaf.madorim.map(mador => {
//                                     const s = sumMador(mador);
//                                     const pct = s.total > 0 ? Math.round((s.used / s.total) * 100) : 0;

//                                     return (
//                                         <button
//                                         key={mador.id}
//                                         type="button"
//                                         className={`org-row ${openMadorId === mador.id ? "active" : ""}`}
//                                         onClick={() => handleMadarClick(mador)}
//                                         >
//                                             <div className="org-row-main">
//                                                 <span className="org-name">{mador.name}</span>
//                                                 <span className="org-meta">
//                                                     ${s.used.toLocaleString()} / ${s.total.toLocaleString()}
//                                                 </span>
//                                             </div>
//                                             <div className="org-row-sub">
//                                                 <div className="org-bar">
//                                                     <div className="org-bar-fill" style={{width: `${pct}%`}}></div>
//                                                     </div>
//                                                     <span className="org-pct">{pct}%</span>
//                                             </div>
//                                         </button>
//                                     )
//                                 })}
//                             </div>
//                         </div>
//                     )}

//                     {openMador && (
//         <div className="org-level">
//           <div className="org-level-title">צוותים — {openMador.name}</div>

//           <div className="org-list">
//             {openMador.teams.map((team) => {
//               const pct =
//                 team.totalBudget > 0
//                   ? Math.round((team.usedBudget / team.totalBudget) * 100)
//                   : 0;

//               return (
//                 <button
//                   key={team.id}
//                   type="button"
//                   className="org-row"
//                   onClick={() => onSelectTeam?.(team)}
//                 >
//                   <div className="org-row-main">
//                     <span className="org-name">{team.name}</span>
//                     <span className="org-meta">
//                       ${team.usedBudget.toLocaleString()} / $
//                       {team.totalBudget.toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="org-row-sub">
//                     <div className="org-bar">
//                       <div className="org-bar-fill" style={{ width: `${pct}%` }} />
//                     </div>
//                     <span className="org-pct">{pct}%</span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//         </div>
//     )
// }
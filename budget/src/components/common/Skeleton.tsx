type TopBarProps = {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export function TopBar({ isSidebarOpen, onOpenSidebar}: TopBarProps) {
  return (
    <header className="topbar">
      <h1>Units Overview</h1>

      <div className="topbar-actions">
        {/* {!isSidebarOpen && (
          <button className="icon-button" onClick={onOpenSidebar} type="button">
            Units →
             </button>
        )} */}

        <input placeholder="Search unit..." />
        <button>Filter</button>
      </div>
    </header>
  );
}

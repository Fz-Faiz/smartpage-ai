import "./Setting.css";

export default function Setting({ dark, setDark, goBack }) {
  const toggleDark = () => {
    const next = !dark;
    setDark(next);

    // SAVE immediately
    chrome.storage.sync.set({ darkMode: next });
  };

  return (
    <div className={`settings-container ${dark ? "dark" : ""}`}>
      <button className="back-btn" onClick={goBack}>
        ← Back
      </button>

      <h3>Appearance</h3>

      <div className="toggle-row">
        <span>Dark Mode</span>

        <label className="switch">
          <input
            type="checkbox"
            checked={dark}
            onChange={toggleDark}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
}

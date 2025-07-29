import React from "react";

/**
 * PUBLIC_INTERFACE
 * Minimal sidebar navigation for tags (aka notebooks) and search.
 * - "tags" should be an array of strings
 * - "activeTag" is the selected tag
 * - "onTagSelect(tag)" is called when new tag is selected (null for "All Notes")
 * - "onSearch(query)" is called when search value changes
 */
function Sidebar({ tags = [], activeTag, onTagSelect, onSearch, searchQuery }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <input
          type="search"
          className="input search-input"
          placeholder="Search notes..."
          value={searchQuery || ""}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="sidebar-section">
        <h3>Notebooks</h3>
        <ul className="sidebar-list">
          <li
            className={!activeTag ? "selected" : ""}
            onClick={() => onTagSelect(null)}
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            All Notes
          </li>
          {tags.map(tag => (
            <li
              key={tag}
              className={activeTag === tag ? "selected" : ""}
              onClick={() => onTagSelect(tag)}
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;

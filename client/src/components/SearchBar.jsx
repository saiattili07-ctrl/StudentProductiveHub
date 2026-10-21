import { useEffect, useState } from "react";

function SearchBar({ value, onSearch, placeholder = "Search..." }) {
  const [text, setText] = useState(value || "");

  // Keep the box in sync when the parent resets the search
  useEffect(() => {
    setText(value || "");
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(text.trim());
  };

  const handleClear = () => {
    setText("");
    onSearch("");
  };

  return (
    <form className="d-flex gap-2" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className="form-control"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Search"
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
      {value && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </form>
  );
}

export default SearchBar;
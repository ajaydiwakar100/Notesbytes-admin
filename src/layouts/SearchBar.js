const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="box-search-field">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search"
        className="form-control"
      />
      {/* <i className="fa fa-search" aria-hidden="true"></i> */}
    </div>
  );
};

export default SearchBar;

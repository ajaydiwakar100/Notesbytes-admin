const Loader = ({ loading }) => {
  return (
    <div className={`page-loader ${loading ? "active" : ""}`}>
      <div className="spinner"></div>
    </div>
  );
};


export default Loader;

function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 Not Found</h1>
      <p style={styles.message}>
        ❌ The page you are looking for does not exist.
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#ff4d4f",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#555",
  },
};

export default NotFound;

import "./Heading.css";

const Heading = () => {
  return (
    <div>
      <h1>
        <span style={{ color: "yellow" }}>Dijkstra&apos;s</span>{" "}
        <span style={{ color: "#AAFF00" }}>Mouse</span>
      </h1>
      <p>🧱 Build walls in the maze by clicking and dragging, but don’t worry—🐭 our clever mouse uses Dijkstra's algorithm to always find the shortest path to the 🧀!</p>
    </div>
  );
};

export default Heading;

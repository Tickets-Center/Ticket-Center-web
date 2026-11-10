import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";

/**
 * Shared shell for the 404 and Unauthorized routes.
 */
export default function StatusPage({ title, message }) {
  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1>{title}</h1>
        <p>{message}</p>
        <Link to="/" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
          Return home
        </Link>
      </div>
    </>
  );
}

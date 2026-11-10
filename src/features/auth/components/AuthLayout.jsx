import "../auth.css";

/**
 * Shared split-screen shell used by every authentication page.
 */
export default function AuthLayout({ description, children, showLeft = true }) {
  return (
    <div className="fb-container">
      {showLeft && (
        <div className="fb-left">
          <h1>ticket center</h1>
          <p>{description}</p>
        </div>
      )}

      <div className="fb-right">
        <div className="login-box">{children}</div>
      </div>
    </div>
  );
}

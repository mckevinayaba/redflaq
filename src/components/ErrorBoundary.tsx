import { Component, ReactNode, ErrorInfo } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F0EB", fontFamily: "'Syne', sans-serif" }}>
          <div style={{ maxWidth: 480, padding: "2rem", textAlign: "center" }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#1F1F1F", marginBottom: 12 }}>
              Something went wrong.
            </h1>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24, lineHeight: 1.7 }}>
              An unexpected error occurred. Please return to the home page and try again.
            </p>
            <a
              href="/"
              style={{ display: "inline-block", background: "#7C3AED", color: "#FFFFFF", padding: "10px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}
            >
              Return to Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

import { Component } from "react";
import { logger } from "../utils/logger";
import { Box, Heading } from "@chakra-ui/react";

const errorContainerStyle = {
  padding: "2rem",
  margin: "1rem",
  backgroundColor: "#fee2e2",
  border: "1px solid #ef4444",
  borderRadius: "0.5rem",
  color: "#7f1d1d",
};

const errorTitleStyle = {
  margin: "0 0 1rem 0",
  fontSize: "1.25rem",
};

const errorDetailsStyle = {
  margin: "1rem 0",
  padding: "1rem",
  backgroundColor: "#fff",
  borderRadius: "0.25rem",
  fontSize: "0.875rem",
  overflowX: "auto",
};

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("React Error Boundary caught an error", {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box style={errorContainerStyle}>
          <Heading style={errorTitleStyle} as="h2">
            Something went wrong
          </Heading>
          <p>The application encountered an unexpected error.</p>
          <pre style={errorDetailsStyle}>{this.state.error?.toString()}</pre>
        </Box>
      );
    }

    return this.props.children;
  }
}

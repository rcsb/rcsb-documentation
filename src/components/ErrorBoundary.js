import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

//   handleGoHome = () => {
//     this.setState({ hasError: false }); // Reset the error state
//     this.props.history.push('/doc-search'); // Redirect to the HomePage
//   }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>We're sorry for the inconvenience. Please try refreshing the page, or contact support if the problem persists.</p>
          {/* <button onClick={this.handleGoHome} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Go to HomePage
          </button> */}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

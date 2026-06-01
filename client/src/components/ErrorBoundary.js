import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error, info) { console.error('ErrorBoundary:', error, info); }

  render() {
    if (this.state.hasError) return (
      <div className="error-boundary">
        <div className="error-boundary-icon">😕</div>
        <h2>משהו השתבש</h2>
        <p>אירעה שגיאה בלתי צפויה</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>רענן דף</button>
      </div>
    );
    return this.props.children;
  }
}

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-600">Algo salió mal</h1>
                    <p className="mt-4 text-gray-700">{this.state.error?.toString()}</p>
                    <button
                        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded"
                        onClick={() => window.location.reload()}
                    >
                        Recargar página
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

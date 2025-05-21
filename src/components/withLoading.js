import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * A higher-order component that adds loading functionality to any component
 * @param {React.Component} WrappedComponent - The component to wrap with loading functionality
 * @param {Object} options - Configuration options
 * @param {boolean} options.fullPage - Whether to show the loading spinner over the full page
 * @param {string} options.loadingText - The text to display while loading
 * @returns {React.Component} - The wrapped component with loading functionality
 */
const withLoading = (WrappedComponent, options = {}) => {
  const { fullPage = false, loadingText = 'Loading...' } = options;

  return function WithLoadingComponent(props) {
    const [loading, setLoading] = useState(false);

    // Creating functions to control loading state
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    // Utility function for loading during async operations
    const withLoadingAsync = async (asyncFn) => {
      startLoading();
      try {
        return await asyncFn();
      } finally {
        stopLoading();
      }
    };

    // Enhanced props with loading utilities
    const enhancedProps = {
      ...props,
      loading,
      startLoading,
      stopLoading,
      withLoadingAsync,
    };

    if (loading) {
      return (
        <>
          <LoadingSpinner fullPage={fullPage} text={loadingText} />
          {!fullPage && <WrappedComponent {...enhancedProps} />}
        </>
      );
    }

    return <WrappedComponent {...enhancedProps} />;
  };
};

export default withLoading;

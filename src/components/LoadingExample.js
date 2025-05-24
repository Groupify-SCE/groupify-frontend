import React from 'react';
import withLoading from './withLoading';

/**
 * Example component that demonstrates how to use the withLoading HOC
 * This component isn't meant to be used directly in the application,
 * but serves as a reference for how to use the withLoading HOC
 */
const ExampleComponent = ({
  loading,
  startLoading,
  stopLoading,
  withLoadingAsync,
}) => {
  // Example of using the loading state directly
  const handleClickDirectLoading = () => {
    startLoading();
    // Simulate an asynchronous operation
    setTimeout(() => {
      stopLoading();
    }, 2000);
  };

  // Example of using the withLoadingAsync utility
  const handleClickAsyncLoading = async () => {
    await withLoadingAsync(async () => {
      // Simulate a data fetching operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true, data: 'Example data' };
    });
  };

  return (
    <div className="example-component">
      <h2>Loading Example</h2>
      <p>Current loading state: {loading ? 'Loading...' : 'Not loading'}</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={handleClickDirectLoading}>
          Start Direct Loading (2s)
        </button>

        <button onClick={handleClickAsyncLoading}>
          Start Async Loading (2s)
        </button>
      </div>

      <p style={{ marginTop: '1rem' }}>
        <strong>Note:</strong> This component is just a reference for how to use
        the withLoading HOC. In real usage, you would:
      </p>

      <ul>
        <li>Import withLoading in your component file</li>
        <li>Create your component as usual</li>
        <li>Export the component wrapped with withLoading</li>
        <li>Use the loading props in your component</li>
      </ul>

      <pre
        style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      >
        {`
// Example usage in real components:
import withLoading from './withLoading';

const MyComponent = ({ withLoadingAsync, ...props }) => {
  
  const fetchData = async () => {
    const result = await withLoadingAsync(async () => {
      // Your API call here
      const response = await api.getData();
      return response.data;
    });
    
    // Process result here
  };
  
  return (
    <div>
      {/* Your component JSX */}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};

// Export with loading capabilities
export default withLoading(MyComponent, { 
  fullPage: false,
  loadingText: 'Loading data...'
});
        `}
      </pre>
    </div>
  );
};

// Wrap the component with the withLoading HOC
export default withLoading(ExampleComponent, {
  fullPage: false,
  loadingText: 'Example loading...',
});

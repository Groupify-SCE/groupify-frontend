import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/CriteriaSection.style.css';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const CriteriaSection = ({ projectId }) => {
  const [criteria, setCriteria] = useState([]);
  const [originalCriteria, setOriginalCriteria] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasFetched = useRef(false);

  // Fetch the list of criteria from the server
  const handleGetCriteria = useCallback(
    async (forceFetch = false) => {
      // Skip redundant fetches if we already have the data and it's not a forced fetch
      if (hasFetched.current && !forceFetch) {
        console.log('Skipping criteria fetch - data already loaded');
        if (isInitialLoad) setIsInitialLoad(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching criteria for project:', projectId);
        const result = await projectService.getAllCriteria(projectId);
        if (result.status === StatusCodes.OK) {
          const { response } = await result.json();
          console.log('Criteria data loaded:', response?.length || 0, 'items');
          setCriteria(response);
          setOriginalCriteria(response);
          hasFetched.current = true;
        } else {
          toast.error('Failed to get criteria');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching criteria');
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    [projectId, isInitialLoad]
  );

  // Fetch once on mount or whenever projectId changes
  useEffect(() => {
    // Reset fetched state when projectId changes
    if (projectId) {
      hasFetched.current = false;
      handleGetCriteria();
    }

    return () => {
      // Clean up when component unmounts
      hasFetched.current = false;
    };
  }, [projectId, handleGetCriteria]);

  // Track whether the user has made unsaved edits
  useEffect(() => {
    setIsDirty(JSON.stringify(criteria) !== JSON.stringify(originalCriteria));
  }, [criteria, originalCriteria]);

  // Add a new empty criterion
  const handleAddCriterion = async () => {
    setLoading(true);
    try {
      const result = await projectService.addCriterion(
        projectId,
        `Criterion ${criteria.length + 1}`
      );
      if (result.status === StatusCodes.OK) {
        // Instead of refetching, we can just update local state if the server provides the new item
        // Or force a fetch to make sure we get the complete updated list
        handleGetCriteria(true);
      } else {
        toast.error('Failed to add criterion');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding criterion');
      setLoading(false);
    }
  };

  // Delete a criterion by ID
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const result = await projectService.deleteCriterion(id);
      if (result.status === StatusCodes.OK) {
        // Optimistically update the UI without refetching
        const updatedCriteria = criteria.filter((c) => c._id !== id);
        setCriteria(updatedCriteria);
        setOriginalCriteria(updatedCriteria);
        setLoading(false);
        toast.success('Criterion deleted successfully');
      } else {
        toast.error('Failed to delete criterion');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting criterion');
      setLoading(false);
    }
  };

  // Save any edits back to the server
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const originalMap = originalCriteria.reduce((acc, curr) => {
        acc[curr._id] = curr;
        return acc;
      }, {});

      // Track if any updates failed
      let hasError = false;

      // Gather all promises to update criteria
      const updatePromises = criteria.map(async (criterion) => {
        const orig = originalMap[criterion._id];
        if (!orig) return null;

        if (criterion.name !== orig.name || criterion.range !== orig.range) {
          const result = await projectService.updateCriteria(
            criterion._id,
            criterion.name,
            criterion.range
          );

          if (result.status !== StatusCodes.OK) {
            hasError = true;
          }
        }
        return criterion;
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      if (hasError) {
        toast.error('Failed to save some criteria');
        // Force fetch to get the correct state
        handleGetCriteria(true);
      } else {
        toast.success('Criteria saved successfully');
        // Just update the originalCriteria to match current criteria
        // to mark as not dirty anymore, without a refetch
        setOriginalCriteria([...criteria]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating criteria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criteria-page-container">
      {isInitialLoad && loading && (
        <div className="criteria-loading-overlay">
          <LoadingSpinner text="Loading criteria..." />
        </div>
      )}

      {!isInitialLoad && loading && (
        <div className="criteria-loading-overlay">
          <LoadingSpinner text="Updating criteria..." />
        </div>
      )}

      {/* Add-box */}
      <div className="criterion-box add-box" onClick={handleAddCriterion}>
        <span className="plus-sign">+</span>
      </div>

      {/* List of criteria */}
      {criteria.map((criterion) => (
        <div className="criterion-box" key={criterion._id}>
          <label>Criterion Name</label>
          <input
            type="text"
            value={criterion.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              setCriteria((prev) =>
                prev.map((c) =>
                  c._id === criterion._id ? { ...c, name: e.target.value } : c
                )
              );
            }}
            disabled={loading}
          />

          <label>Type</label>
          <select
            value={criterion.range.toString()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const newRange = Number(e.target.value);
              setCriteria((prev) =>
                prev.map((c) =>
                  c._id === criterion._id ? { ...c, range: newRange } : c
                )
              );
            }}
            disabled={loading}
          >
            <option value="1">Boolean</option>
            <option value="10">0-10</option>
            <option value="50">0-50</option>
            <option value="100">0-100</option>
          </select>

          {/* Delete button */}
          <button
            className="delete-button"
            onClick={(e) => handleDelete(e, criterion._id)}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18v2H3z" />
              <path d="M5 8h14l-1.5 12H6.5z" />
              <path d="M9 2h6v2H9z" />
            </svg>
          </button>
        </div>
      ))}

      {criteria.length === 0 && !loading && (
        <div className="no-criteria-message">
          No criteria defined yet. Click the + to add one.
        </div>
      )}

      {/* Save button appears only when edits exist */}
      {isDirty && (
        <button
          className="update-button"
          onClick={handleUpdate}
          disabled={loading}
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default CriteriaSection;

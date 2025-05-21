import React, { useState, useEffect, useCallback } from 'react';
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

  // Fetch the list of criteria from the server
  const handleGetCriteria = useCallback(async () => {
    setLoading(true);
    try {
      const result = await projectService.getAllCriteria(projectId);
      if (result.status === StatusCodes.OK) {
        const { response } = await result.json();
        setCriteria(response);
        setOriginalCriteria(response);
      } else {
        toast.error('Failed to get criteria');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching criteria');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch once on mount or whenever projectId changes
  useEffect(() => {
    handleGetCriteria();
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
        handleGetCriteria();
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
        handleGetCriteria();
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
      for (const criterion of criteria) {
        const orig = originalMap[criterion._id];
        if (!orig) continue;
        if (criterion.name !== orig.name || criterion.range !== orig.range) {
          const result = await projectService.updateCriteria(
            criterion._id,
            criterion.name,
            criterion.range
          );
          if (result.status !== StatusCodes.OK) {
            toast.error('Failed to save criteria');
            setLoading(false);
            return;
          }
        }
      }
      toast.success('Criteria saved successfully');
      handleGetCriteria();
    } catch (err) {
      console.error(err);
      toast.error('Error updating criteria');
      setLoading(false);
    }
  };

  return (
    <div className="criteria-page-container">
      {loading && (
        <div className="criteria-loading-overlay">
          <LoadingSpinner text="Loading criteria..." />
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

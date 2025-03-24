import React, { useState, useEffect } from 'react';
import '../styles/CriteriaSection.style.css';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

const CriteriaSection = ({ projectId }) => {
  const [criteria, setCriteria] = useState([]);
  const [originalCriteria, setOriginalCriteria] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    handleGetCriteria();
  }, []);

  useEffect(() => {
    setIsDirty(JSON.stringify(criteria) !== JSON.stringify(originalCriteria));
  }, [criteria, originalCriteria]);

  const handleGetCriteria = async () => {
    try {
      const result = await projectService.getAllCriteria(projectId);
      if (result.status === StatusCodes.OK) {
        const data = await result.json();
        setCriteria(data.response);
        setOriginalCriteria(data.response);
      } else {
        toast.error('Failed to get criteria');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching criteria');
    }
  };

  const handleAddCriterion = async () => {
    try {
      const result = await projectService.addCriterion(
        projectId,
        `Criterion ${criteria.length + 1}`
      );
      if (result.status === StatusCodes.OK) {
        handleGetCriteria();
      } else {
        toast.error('Failed to add criterion');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding criterion');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const result = await projectService.deleteCriterion(id);
      if (result.status === StatusCodes.OK) {
        handleGetCriteria();
      } else {
        toast.error('Failed to delete criterion');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting criterion');
    }
  };

  const handleUpdate = async () => {
    try {
      const originalMap = originalCriteria.reduce((acc, curr) => {
        acc[curr._id] = curr;
        return acc;
      }, {});
      for (const criterion of criteria) {
        if (
          criterion.name !== originalMap[criterion._id].name ||
          criterion.range !== originalMap[criterion._id].range
        ) {
          const result = await projectService.updateCriteria(
            criterion._id,
            criterion.name,
            criterion.range
          );
          if (result.status !== StatusCodes.OK) {
            toast.error('Failed to save criteria');
            return;
          }
        }
      }
      toast.success('Criteria saved successfully');
      handleGetCriteria();
    } catch (err) {
      console.error(err);
      toast.error('Error updating criteria');
    }
  };

  return (
    <div className="criteria-page-container">
      {/* Plus Box */}
      <div className="criterion-box add-box" onClick={handleAddCriterion}>
        <span className="plus-sign">+</span>
      </div>

      {/* Criteria Boxes */}
      {criteria.map((criterion) => (
        <div className="criterion-box" key={criterion._id}>
          <label>Criterion Name</label>
          <input
            type="text"
            value={criterion.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const updatedCriteria = criteria.map((c) =>
                c._id === criterion._id ? { ...c, name: e.target.value } : c
              );
              setCriteria(updatedCriteria);
            }}
          />

          <label>Type</label>
          <select
            value={criterion.range.toString()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const updatedValue = Number(e.target.value);
              const updatedCriteria = criteria.map((c) =>
                c._id === criterion._id ? { ...c, range: updatedValue } : c
              );
              setCriteria(updatedCriteria);
            }}
          >
            <option value="1">Boolean</option>
            <option value="10">0-10</option>
            <option value="50">0-50</option>
            <option value="100">0-100</option>
          </select>

          {/* Smaller trash icon at bottom-left */}
          <button
            className="delete-button"
            onClick={(e) => handleDelete(e, criterion._id)}
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

      {isDirty && (
        <button className="update-button" onClick={handleUpdate}>
          Save Changes
        </button>
      )}
    </div>
  );
};

export default CriteriaSection;

import React, { useState, useEffect } from 'react';
import '../styles/CriteriaSection.style.css';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

const CriteriaSection = ({ projectId }) => {
  const [criteria, setCriteria] = useState([]);

  useEffect(() => {
    handleGetCriteria();
  });

  const handleGetCriteria = async () => {
    const result = await projectService.getAllCriteria(projectId);
    if (result.status === StatusCodes.OK) {
      const data = await result.json();
      setCriteria(data.response);
    } else {
      toast.error('Failed to get criteria');
    }
  };

  const handleAddCriterion = async () => {
    const result = await projectService.addCriterion(
      projectId,
      `Criterion ${criteria.length + 1}`
    );
    if (result.status === StatusCodes.OK) {
      handleGetCriteria();
    } else {
      toast.error('Failed to add criterion');
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    // TODO: Implement delete
  };

  const handleCubeClick = (id) => {
    // TODO: Implement cube click
  };

  return (
    <div className="criteria-page-container">
      {/* Plus Box */}
      <div className="criterion-box add-box" onClick={handleAddCriterion}>
        <span className="plus-sign">+</span>
      </div>

      {/* Criteria Boxes */}
      {criteria.map((criterion) => (
        <div
          className="criterion-box"
          key={criterion._id}
          onClick={() => handleCubeClick(criterion._id)}
        >
          <label>Criterion Name</label>
          <input
            type="text"
            value={criterion.name}
            readOnly
            onClick={(e) => e.stopPropagation()}
          />

          <label>Range</label>
          <input
            type="text"
            value={`${criterion.range}`}
            readOnly
            onClick={(e) => e.stopPropagation()}
          />

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
    </div>
  );
};

export default CriteriaSection;

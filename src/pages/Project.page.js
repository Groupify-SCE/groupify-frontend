import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import projectService from '../services/project.service';
import '../styles/ProjectPage.style.css';
import ConfirmDeletion from '../components/ConfirmDeletion';
import { StatusCodes } from 'http-status-codes';

function ProjectPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    handleGetAll();
  }, []);

  const handleAddProject = async () => {
    const result = await projectService.create();
    if (result.status === StatusCodes.OK) {
      handleGetAll();
      toast.success('Created Project Successfully');
    } else {
      toast.error('Failled Creating Project');
    }
  };

  const handleGetAll = async () => {
    const result = await projectService.getAll();
    const data = await result.json();
    if (result.status === StatusCodes.OK) {
      setProjects(data.response);
    } else {
      toast.error(data.response);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    toast.info(
      <ConfirmDeletion
        onConfirm={async () => {
          toast.dismiss();
          const result = await projectService.delete(id);
          if (result.status === StatusCodes.OK) {
            toast.success('Deleted Project Successfully');
            setProjects((prev) => prev.filter((proj) => proj._id !== id));
          } else {
            toast.error('Failled deleting Project');
          }
        }}
        onCancel={() => toast.dismiss()}
      />,
      {
        autoClose: false,
        closeButton: false,
        position: 'top-center',
        style: { marginTop: '8rem' },
      }
    );
  };

  const handleCubeClick = (id) => {
    navigate(`/project-management/${id}`);
  };

  return (
    <div className="project-page-container">
      {/* Plus Box */}
      <div className="project-box add-box" onClick={handleAddProject}>
        <span className="plus-sign">+</span>
      </div>

      {/* Project Cards */}
      {projects.map((project) => (
        <div
          className="project-box"
          key={project._id}
          onClick={() => handleCubeClick(project._id)}
        >
          <label>Project Name</label>
          <input
            type="text"
            value={project.name}
            readOnly
            onClick={(e) => e.stopPropagation()}
          />

          <label>Participants</label>
          <input
            type="text"
            value={`${project.registrants}/${project.participants}`}
            readOnly
            onClick={(e) => e.stopPropagation()}
          />

          {/* Smaller trash icon at bottom-left */}
          <button
            className="delete-button"
            onClick={(e) => handleDelete(e, project._id)}
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
}

export default ProjectPage;

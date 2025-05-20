import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProjectManagementPage.style.css';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import CriteriaSection from '../contexts/Criteria.section';
import ParticipantsSection from '../contexts/Participants.section';
import ParticipantsViewSection from '../contexts/ParticipantsView.Section';
import algoService from '../services/algo.service';

function ProjectManagementPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('criteria');
  const [project, setProject] = useState({
    _id: id,
    user: '',
    name: '',
    participants: 0,
    registrants: 0,
    group_size: 0,
    preferences: 0,
    groups: false,
  });

  useEffect(() => {
    const fetchProject = async () => {
      const result = await projectService.get(id);
      const data = await result.json();
      if (result.status === StatusCodes.OK) {
        setProject(data.response);
      } else {
        toast.error('Failed to fetch project details');
      }
    };

    fetchProject();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await projectService.update(
      project._id,
      project.name,
      project.participants,
      project.group_size
    );
    if (result.status === StatusCodes.OK) {
      toast.success('Project updated successfully');
    } else {
      toast.error('Failed to update project');
    }
  };

  const handleCreateGroups = async () => {
    try {
      const result = await algoService.runAlgorithm(id);
      if (result.status === StatusCodes.OK) {
        toast.success('Groups created successfully');
        setProject({ ...project, groups: true });
      } else {
        toast.error('Failed to create groups');
      }
    } catch (error) {
      toast.error('Failed to create groups');
    }
  };

  return (
    <div className="project-management-page">
      {/* Top Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'criteria' ? 'active' : ''}`}
          onClick={() => setActiveTab('criteria')}
        >
          Criteria
        </button>
        <button
          className={`tab-button ${activeTab === 'viewParticipants' ? 'active' : ''}`}
          onClick={() => setActiveTab('viewParticipants')}
        >
          Participants
        </button>
        <button
          className={`tab-button ${activeTab === 'editParticipants' ? 'active' : ''}`}
          onClick={() => setActiveTab('editParticipants')}
        >
          Edit Participants
        </button>
      </div>

      <div className="main-content">
        {/* Left side: main area */}
        <div className="main-area">
          {activeTab === 'criteria' && <CriteriaSection projectId={id} />}
          {activeTab === 'editParticipants' && (
            <ParticipantsSection projectId={id} />
          )}
          {activeTab === 'viewParticipants' && (
            <ParticipantsViewSection projectId={id} />
          )}
        </div>

        {/* Right side: fields from your attached image, in English */}
        <div className="project-details-sidebar">
          <div className="detail-field">
            <label>Project name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              maxLength={100}
            />
          </div>

          <div className="detail-field">
            <label>Amount of participants</label>
            <input
              type="number"
              value={project.participants}
              onChange={(e) =>
                setProject({ ...project, participants: e.target.value })
              }
              min={1}
            />
          </div>

          <div className="detail-field">
            <label>Number of registrants</label>
            <input
              type="number"
              value={project.registrants}
              onChange={(e) =>
                setProject({ ...project, registrants: e.target.value })
              }
              disabled
            />
          </div>

          <div className="detail-field">
            <label>Group size</label>
            <input
              type="number"
              value={project.group_size}
              onChange={(e) =>
                setProject({ ...project, group_size: e.target.value })
              }
              min={1}
              max={project.participants}
            />
          </div>

          <div className="detail-field">
            <label>Amount of preferences</label>
            <input
              type="number"
              value={project.preferences}
              onChange={(e) =>
                setProject({ ...project, preferences: e.target.value })
              }
              min={0}
              max={project.group_size}
            />
          </div>

          {project.code && (
            <div className="detail-field">
              <label>Code</label>
              <input
                type="text"
                value={project.code.slice(0, 4) + '-' + project.code.slice(4)}
                disabled
              />
            </div>
          )}

          <button className="big-button" onClick={handleUpdate}>
            Save
          </button>
          {project.groups && <button className="big-button">See Groups</button>}
          <button className="big-button" onClick={handleCreateGroups}>
            {project.groups ? 'Recreate Groups' : 'Create Groups'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectManagementPage;

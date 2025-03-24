import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProjectManagementPage.style.css';

function ProjectManagementPage() {
  const { id } = useParams(); // e.g. /project-management/:id
  const navigate = useNavigate();

  // Tab state: "criteria" | "participants" | "editParticipants"
  const [activeTab, setActiveTab] = useState('criteria');

  // Right-side input states (in English)
  const [projectNameInput, setProjectNameInput] = useState(`Project #${id}`);
  const [idNumberInput, setIdNumberInput] = useState('');
  const [participantsCount, setParticipantsCount] = useState(3);
  const [registrantsCount, setRegistrantsCount] = useState(0);
  const [groupSize, setGroupSize] = useState(0);
  const [preferencesCount, setPreferencesCount] = useState(0);

  // Participant data
  const [participants, setParticipants] = useState([
    {
      firstName: 'John',
      lastName: 'Doe',
      id: '111111111',
      status: 'Active',
      criteria: ['', '', ''],
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      id: '222222222',
      status: 'Pending',
      criteria: ['', '', ''],
    },
  ]);

  // Toggle participant status (Active <-> Pending)
  const toggleStatus = (index) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index].status =
        updated[index].status === 'Active' ? 'Pending' : 'Active';
      return updated;
    });
  };

  // Add participant popup (in Edit Participants tab)
  const [showParticipantPopup, setShowParticipantPopup] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newID, setNewID] = useState('');

  const handleAddParticipant = () => {
    if (!newFirstName.trim() || !newLastName.trim() || !newID.trim()) return;
    const newP = {
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      id: newID.trim(),
      status: 'Pending',
      criteria: ['', '', ''],
    };
    setParticipants([...participants, newP]);
    setNewFirstName('');
    setNewLastName('');
    setNewID('');
    setShowParticipantPopup(false);
  };

  // Edit participant's 3 criteria
  const [showEditCriteriaPopup, setShowEditCriteriaPopup] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [tempCriteria, setTempCriteria] = useState(['', '', '']);

  const handleEditParticipantCriteria = (index) => {
    setEditIndex(index);
    setTempCriteria([...participants[index].criteria]);
    setShowEditCriteriaPopup(true);
  };

  const handleSaveParticipantCriteria = () => {
    if (editIndex < 0) return;
    setParticipants((prev) => {
      const updated = [...prev];
      updated[editIndex].criteria = [...tempCriteria];
      return updated;
    });
    setShowEditCriteriaPopup(false);
    setEditIndex(-1);
  };

  // Delete a participant (in Edit Participants)
  const handleDeleteParticipant = (index) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  // Global Criteria tab
  const [criteria, setCriteria] = useState([]);
  const [showCriteriaPopup, setShowCriteriaPopup] = useState(false);
  const [newCriterion, setNewCriterion] = useState('');
  const [newCriterionType, setNewCriterionType] = useState('');

  const handleAddCriterion = () => {
    if (newCriterion.trim() === '' || newCriterionType.trim() === '') return;
    const criterion = {
      id: Date.now(),
      name: newCriterion.trim(),
      type: newCriterionType.trim(),
    };
    setCriteria([...criteria, criterion]);
    setNewCriterion('');
    setNewCriterionType('');
    setShowCriteriaPopup(false);
  };

  const handleDeleteCriterion = (criterionId) => {
    setCriteria((prev) => prev.filter((c) => c.id !== criterionId));
  };

  // Possibly for navigation
  const handleCubeClick = (projId) => {
    navigate(`/project-management/${projId}`);
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
          className={`tab-button ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
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
          {/* CRITERIA TAB */}
          {activeTab === 'criteria' && (
            <div className="criteria-tab">
              <div className="criteria-grid">
                {/* Plus Cube for adding a new global criterion */}
                <div
                  className="criterion-box add-box"
                  onClick={() => setShowCriteriaPopup(true)}
                >
                  <span className="plus-sign">+</span>
                </div>

                {/* Display each global criterion as a box */}
                {criteria.map((crit) => (
                  <div key={crit.id} className="criterion-box">
                    <button
                      className="criterion-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCriterion(crit.id);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 6h18v2H3z" />
                        <path d="M5 8h14l-1.5 12H6.5z" />
                        <path d="M9 2h6v2H9z" />
                      </svg>
                    </button>
                    <div className="criterion-fields">
                      <label>Criterion</label>
                      <div className="criterion-field-value">{crit.name}</div>
                      <label>Criterion Type</label>
                      <div className="criterion-field-value">{crit.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PARTICIPANTS TAB (status toggles, no add button) */}
          {activeTab === 'participants' && (
            <div className="participants-tab">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, index) => (
                    <tr key={index}>
                      <td>{p.firstName}</td>
                      <td>{p.lastName}</td>
                      <td>{p.id}</td>
                      <td
                        onClick={() => toggleStatus(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        {p.status === 'Active' ? (
                          <span style={{ color: 'green', fontSize: '1.2rem' }}>
                            ✔
                          </span>
                        ) : (
                          <span style={{ color: 'red', fontSize: '1.2rem' }}>
                            ✘
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EDIT PARTICIPANTS TAB */}
          {activeTab === 'editParticipants' && (
            <div className="edit-participants-tab">
              <h3>Edit Participants</h3>
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>First Name (Delete)</th>
                    <th>Last Name</th>
                    <th>ID</th>
                    <th>Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, index) => (
                    <tr key={index}>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <button
                            className="delete-participant-btn"
                            onClick={() => handleDeleteParticipant(index)}
                          >
                            Delete
                          </button>
                          <span>{p.firstName}</span>
                        </div>
                      </td>
                      <td>{p.lastName}</td>
                      <td>{p.id}</td>
                      <td>
                        {p.criteria.some((c) => c.trim())
                          ? p.criteria.join(', ')
                          : 'No Criteria'}{' '}
                        <button
                          className="edit-criteria-btn"
                          onClick={() => {
                            setEditIndex(index);
                            setTempCriteria([...p.criteria]);
                            setShowEditCriteriaPopup(true);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="add-participant-btn"
                onClick={() => setShowParticipantPopup(true)}
              >
                Add Participant
              </button>
            </div>
          )}
        </div>

        {/* Right side: fields from your attached image, in English */}
        <div className="project-details-sidebar">
          <div className="detail-field">
            <label>Project name</label>
            <input
              type="text"
              value={projectNameInput}
              onChange={(e) => setProjectNameInput(e.target.value)}
            />
          </div>

          <div className="detail-field">
            <label>ID number</label>
            <input
              type="text"
              value={idNumberInput}
              onChange={(e) => setIdNumberInput(e.target.value)}
            />
          </div>

          <div className="detail-field">
            <label>Number of participants</label>
            <input
              type="number"
              value={participantsCount}
              onChange={(e) => setParticipantsCount(e.target.value)}
            />
          </div>

          <div className="detail-field">
            <label>Number of registrants</label>
            <input
              type="number"
              value={registrantsCount}
              onChange={(e) => setRegistrantsCount(e.target.value)}
            />
          </div>

          <div className="detail-field">
            <label>Group size</label>
            <input
              type="number"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
            />
          </div>

          <div className="detail-field">
            <label>Number of preferences</label>
            <input
              type="number"
              value={preferencesCount}
              onChange={(e) => setPreferencesCount(e.target.value)}
            />
          </div>

          <button className="big-button">Save</button>
          <button className="big-button">Create groups</button>
        </div>
      </div>

      {/* ================= Popups ================= */}

      {/* 1) Popup for adding a new global criterion */}
      {showCriteriaPopup && (
        <div
          className="popup-overlay"
          onClick={() => setShowCriteriaPopup(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {/* X button top-right */}
            <button
              className="popup-close-btn"
              onClick={() => setShowCriteriaPopup(false)}
            >
              X
            </button>

            <h2>Add Criterion</h2>
            <div className="popup-fields">
              <label>Criterion</label>
              <input
                type="text"
                placeholder="Enter criterion..."
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
              />
              <label>Criterion Type</label>
              <input
                type="text"
                placeholder="Enter criterion type..."
                value={newCriterionType}
                onChange={(e) => setNewCriterionType(e.target.value)}
              />
            </div>
            <div className="popup-footer">
              <button onClick={handleAddCriterion} className="popup-save-btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2) Popup for adding a new participant (Edit Participants tab) */}
      {showParticipantPopup && (
        <div
          className="popup-overlay"
          onClick={() => setShowParticipantPopup(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {/* X button top-right */}
            <button
              className="popup-close-btn"
              onClick={() => setShowParticipantPopup(false)}
            >
              X
            </button>

            <h2>Add Participant</h2>
            <div className="popup-fields">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter first name..."
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter last name..."
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
              <label>ID</label>
              <input
                type="text"
                placeholder="Enter ID..."
                value={newID}
                onChange={(e) => setNewID(e.target.value)}
              />
            </div>
            <div className="popup-footer">
              <button onClick={handleAddParticipant} className="popup-save-btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3) Popup for editing a participant's 3 criteria (Edit Participants) */}
      {showEditCriteriaPopup && editIndex >= 0 && (
        <div
          className="popup-overlay"
          onClick={() => setShowEditCriteriaPopup(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {/* X button top-right */}
            <button
              className="popup-close-btn"
              onClick={() => setShowEditCriteriaPopup(false)}
            >
              X
            </button>

            <h2>
              {participants[editIndex].firstName}{' '}
              {participants[editIndex].lastName}
            </h2>
            <div className="popup-fields">
              <label>Criterion 1</label>
              <input
                type="text"
                value={tempCriteria[0]}
                onChange={(e) => {
                  const updated = [...tempCriteria];
                  updated[0] = e.target.value;
                  setTempCriteria(updated);
                }}
              />
              <label>Criterion 2</label>
              <input
                type="text"
                value={tempCriteria[1]}
                onChange={(e) => {
                  const updated = [...tempCriteria];
                  updated[1] = e.target.value;
                  setTempCriteria(updated);
                }}
              />
              <label>Criterion 3</label>
              <input
                type="text"
                value={tempCriteria[2]}
                onChange={(e) => {
                  const updated = [...tempCriteria];
                  updated[2] = e.target.value;
                  setTempCriteria(updated);
                }}
              />
            </div>
            <div className="popup-footer">
              <button
                onClick={handleSaveParticipantCriteria}
                className="popup-save-btn"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectManagementPage;

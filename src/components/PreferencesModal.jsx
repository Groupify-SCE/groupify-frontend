import React from 'react';
import '../styles/PreferencesModal.style.css';

export default function PreferencesModal({
  show,
  onClose,
  participants,
  maxPreferences,
  selectedParticipant,
  onSelectParticipant,
  participantId,
  onChangeId,
  preferences,
  onChangePreferences,
  onSubmit,
  error,
}) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 data-testid="preferences-modal-title">Select Your Preferences</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Select Your Name:</label>
          <select
            value={selectedParticipant}
            onChange={(e) => onSelectParticipant(e.target.value)}
          >
            <option value="">Select...</option>
            {participants.map((p) => (
              <option key={p._id} value={p._id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Your ID:</label>
          <input
            type="number"
            placeholder="Enter your ID"
            value={participantId}
            onChange={onChangeId}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Select Preferences (up to {maxPreferences}):</label>
          <select
            multiple
            value={preferences.map((p) => p._id)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (opt) =>
                participants.find((p) => p._id === opt.value)
              ).filter((p) => p && p._id !== selectedParticipant);
              if (selected.length <= maxPreferences) {
                onChangePreferences(selected);
              }
            }}
          >
            {participants
              .filter((p) => p._id !== selectedParticipant)
              .map((p) => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
          </select>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSubmit}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

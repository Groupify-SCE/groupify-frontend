import React from 'react';
import '../styles/Groups.css';

const GroupGrid = ({ groups }) => {
  const checkPreferencesStatus = (member, groupMembers) => {
    if (!member.preferences || member.preferences.length === 0)
      return 'matched';

    const hasPreferredMember = member.preferences.some((prefId) =>
      groupMembers.some((groupMember) => groupMember.id === prefId)
    );

    return hasPreferredMember ? 'matched' : 'unmatched';
  };

  return (
    <div className="grid-container">
      {groups.map((group, index) => (
        <div key={index} className="group-card">
          <h2 className="group-title">Group {index + 1}</h2>
          <div className="member-list">
            {group.map((member) => {
              const preferencesStatus = checkPreferencesStatus(member, group);
              return (
                <div
                  key={member.id}
                  className={`member-item ${preferencesStatus === 'unmatched' ? 'unmatched' : ''}`}
                >
                  <div className={`status-indicator ${preferencesStatus}`} />
                  <div className="member-content">
                    <span className="member-name">{member.name}</span>
                    <span className="member-tz">{member.tz}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupGrid;

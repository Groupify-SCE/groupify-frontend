import React, { useState, useEffect } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import '../styles/CriteriaEditorForm.css'; // נוסיף גם CSS מותאם

const CriteriaEditorForm = ({ participant, onClose, onSave }) => {
  const [criteria, setCriteria] = useState({
    teamwork: 0,
    punctuality: 0,
    initiative: 0,
  });

  useEffect(() => {
    if (participant?.criteria) {
      setCriteria(participant.criteria);
    }
  }, [participant]);

  const handleChange = (field, value) => {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // await projectService.updateCriteria(participant._id, criteria);
      toast.success('Criteria saved!');
      onSave(criteria);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save criteria');
    }
  };

  return (
    <div className="criteria-form">
      <div className="criteria-field">
        <label>Teamwork</label>
        <InputNumber
          value={criteria.teamwork}
          onValueChange={(e) => handleChange('teamwork', e.value)}
          min={0}
          max={10}
          showButtons
          inputClassName="input-compact"
        />
      </div>
      <div className="criteria-field">
        <label>Punctuality</label>
        <InputNumber
          value={criteria.punctuality}
          onValueChange={(e) => handleChange('punctuality', e.value)}
          min={0}
          max={10}
          showButtons
          inputClassName="input-compact"
        />
      </div>
      <div className="criteria-field">
        <label>Initiative</label>
        <InputNumber
          value={criteria.initiative}
          onValueChange={(e) => handleChange('initiative', e.value)}
          min={0}
          max={10}
          showButtons
          inputClassName="input-compact"
        />
      </div>
      <div className="button-wrapper">
        <Button
          label="Save"
          icon="pi pi-check"
          onClick={handleSave}
          className="p-button-sm p-button-primary full-width"
        />
      </div>
    </div>
  );
};

export default CriteriaEditorForm;

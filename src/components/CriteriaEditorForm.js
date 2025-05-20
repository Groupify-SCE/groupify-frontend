import React, { useState, useEffect } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import projectService from '../services/project.service';
import '../styles/CriteriaEditorForm.css';

const CriteriaEditorForm = ({ participant, onClose, onSave }) => {
  const [criteriaDefs, setCriteriaDefs] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState({});

  useEffect(() => {
    if (!participant?.projectId || !participant?._id) return;

    projectService
      .getAllCriteria(participant.projectId)
      .then(async (res) => {
        const data = await res.json();
        const defs = data.response || [];
        setCriteriaDefs(defs);

        try {
          const critJson = await projectService.getParticipantCriteria(
            participant._id
          );
          const valuesList = critJson.response || [];

          const filled = {};
          valuesList.forEach((item) => {
            const key = item.criterion?.toString?.() || item.criterion;
            filled[key] = item.value;
          });

          defs.forEach((c) => {
            const idStr = c._id?.toString?.();
            if (!(idStr in filled)) {
              filled[idStr] = 0;
            }
          });

          setCriteriaValues(filled);
        } catch (err) {
          toast.error('Could not load existing criteria values');
        }
      })
      .catch((err) => {
        toast.error('Could not load criteria');
      });
  }, [participant]);

  const handleChange = (id, value) => {
    setCriteriaValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      await projectService.submitParticipantCriteria(
        participant._id,
        criteriaValues
      );
      toast.success('Criteria saved!');
      onSave(criteriaValues);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save criteria');
    }
  };

  return (
    <div className="criteria-form">
      {Array.isArray(criteriaDefs) &&
        criteriaDefs.map((c) => {
          const idStr = c._id?.toString?.();
          return (
            <div className="criteria-field" key={idStr}>
              <label>{c.name}</label>
              <InputNumber
                value={criteriaValues?.[idStr] ?? 0}
                onValueChange={(e) => handleChange(idStr, e.value)}
                min={0}
                max={c.range}
                showButtons
                inputClassName="input-compact"
              />
            </div>
          );
        })}

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

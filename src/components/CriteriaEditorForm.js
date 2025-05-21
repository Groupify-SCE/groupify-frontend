import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import projectService from '../services/project.service';
import '../styles/CriteriaEditorForm.css';
import LoadingSpinner from './LoadingSpinner';

const CriteriaEditorForm = ({ participant, onClose, onSave, onLoad }) => {
  const [criteriaDefs, setCriteriaDefs] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!participant || !participant.projectId) {
      toast.error('Invalid participant data');
      setLoading(false);
      if (onLoad) onLoad();
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Fetching criteria for project:', participant.projectId);
        const res = await projectService.getAllCriteria(participant.projectId);
        const data = await res.json();
        const defs = data.response || [];
        setCriteriaDefs(defs);
        console.log('Criteria definitions loaded:', defs.length);

        // Fill in values with defaults first (all zeros)
        const defaultValues = {};
        defs.forEach((c) => {
          const idStr = c._id?.toString?.();
          defaultValues[idStr] = 0;
        });

        try {
          console.log(
            'Fetching criteria values for participant:',
            participant._id
          );
          const critJson = await projectService.getParticipantCriteria(
            participant._id
          );
          const valuesList = critJson.response || [];
          console.log('Criteria values loaded:', valuesList.length);

          // Then override with actual values
          valuesList.forEach((item) => {
            const key = item.criterion?.toString?.() || item.criterion;
            defaultValues[key] = item.value;
          });
        } catch (err) {
          console.error('Failed to load participant criteria values:', err);
          toast.error('Could not load existing criteria values');
        }

        setCriteriaValues(defaultValues);
      } catch (err) {
        console.error('Failed to load criteria definitions:', err);
        toast.error('Could not load criteria');
      } finally {
        setLoading(false);
        if (onLoad) onLoad();
      }
    };

    loadData();
  }, [participant, onLoad]);

  const handleChange = (id, value) => {
    setCriteriaValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading criteria data..." />;
  }

  return (
    <div className="criteria-form">
      {Array.isArray(criteriaDefs) && criteriaDefs.length > 0 ? (
        criteriaDefs.map((c) => {
          const idStr = c._id?.toString?.();
          return (
            <div className="criteria-field" key={idStr}>
              <label>{c.name}</label>
              <input
                type="number"
                placeholder={c.name}
                value={criteriaValues?.[idStr] ?? 0}
                onChange={(e) => handleChange(idStr, e.target.value)}
                min={0}
                max={c.range}
              />
            </div>
          );
        })
      ) : (
        <div className="no-criteria-message">
          No criteria found for this project.
        </div>
      )}

      <div className="button-wrapper">
        <Button
          label="Save"
          onClick={handleSave}
          className="p-button-primary full-width"
        />
      </div>
    </div>
  );
};

export default CriteriaEditorForm;

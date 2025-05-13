import React, { useState, useEffect } from 'react';
import '../styles/ParticipantsSection.style.css';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import AddParticipantForm from '../components/AddParticipantForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import CriteriaEditorForm from '../components/CriteriaEditorForm';

const ParticipantsSection = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [criteriaDialogVisible, setCriteriaDialogVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const result = await projectService.getAllParticipants(projectId);
      const data = await result.json();
      if (result.status === StatusCodes.OK) {
        setParticipants(data.response || []);
      } else {
        toast.error('Failed to fetch participants');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching participants');
    }
  };

  const textEditor = (options) => {
    return (
      <input
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        className="p-inputtext"
      />
    );
  };

  const openCriteriaDialog = (participant) => {
    setSelectedParticipant(participant);
    setCriteriaDialogVisible(true);
  };

  const onRowEditComplete = async (e) => {
    const { newData, index } = e;
    const updated = [...participants];
    updated[index] = newData;
    setParticipants(updated);

    try {
      // await projectService.updateParticipant(projectId, newData);
      toast.success('Participant updated');
    } catch (err) {
      toast.error('Failed to update participant');
    }
  };

  return (
    <div className="participants-section">
      <AddParticipantForm
        projectId={projectId}
        onParticipantAdded={fetchParticipants}
      />

      <DataTable
        value={participants}
        editMode="row"
        dataKey="_id"
        onRowEditComplete={onRowEditComplete}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column
          field="firstName"
          header="First Name"
          editor={textEditor}
          style={{ width: '25%' }}
        />
        <Column
          field="lastName"
          header="Last Name"
          editor={textEditor}
          style={{ width: '25%' }}
        />
        <Column
          field="tz"
          header="ID"
          editor={textEditor}
          style={{ width: '25%' }}
        />
        <Column
          header="Criteria"
          body={(rowData) => (
            <Button
              label="Edit"
              icon="pi pi-pencil"
              className="p-button-text"
              onClick={() => openCriteriaDialog(rowData)}
            />
          )}
          style={{ width: '15%' }}
        />
        <Column
          rowEditor
          headerStyle={{ width: '10%' }}
          bodyStyle={{ textAlign: 'center' }}
        />
      </DataTable>

      <Dialog
        header="Edit Criteria"
        visible={criteriaDialogVisible}
        style={{ width: '400px' }}
        onHide={() => setCriteriaDialogVisible(false)}
        modal
      >
        {selectedParticipant && (
          <CriteriaEditorForm
            participant={selectedParticipant}
            onClose={() => setCriteriaDialogVisible(false)}
            onSave={(updatedCriteria) => {
              // עדכון הקריטריונים במצב המקומי
              setParticipants((prev) =>
                prev.map((p) =>
                  p._id === selectedParticipant._id
                    ? { ...p, criteria: updatedCriteria }
                    : p
                )
              );
            }}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ParticipantsSection;

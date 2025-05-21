import React, { useState, useEffect, useCallback } from 'react';
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
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import LoadingSpinner from '../components/LoadingSpinner';

const ParticipantsSection = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [criteriaDialogVisible, setCriteriaDialogVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [criteriaDefs, setCriteriaDefs] = useState(null);
  const [, setCriteriaLoading] = useState(false);

  const fetchParticipants = useCallback(async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch criteria definitions once and cache them
  const fetchCriteriaDefs = useCallback(async () => {
    if (criteriaDefs) return criteriaDefs; // Return cached data if available

    setCriteriaLoading(true);
    try {
      const result = await projectService.getAllCriteria(projectId);
      if (result.status === StatusCodes.OK) {
        const data = await result.json();
        const definitions = data.response || [];
        setCriteriaDefs(definitions);
        return definitions;
      } else {
        toast.error('Failed to fetch criteria definitions');
        return [];
      }
    } catch (err) {
      console.error('Error fetching criteria definitions:', err);
      toast.error('Error fetching criteria definitions');
      return [];
    } finally {
      setCriteriaLoading(false);
    }
  }, [projectId, criteriaDefs]);

  useEffect(() => {
    fetchParticipants();
    // Prefetch criteria definitions when component mounts
    fetchCriteriaDefs();
  }, [projectId, fetchParticipants, fetchCriteriaDefs]);

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
  };

  const confirmDelete = (participant) => {
    confirmDialog({
      message: (
        <div className="confirm-delete-message">
          <span className="highlight-name">
            {participant.firstName} {participant.lastName}
          </span>
          <p>Are you sure you want to delete this participant?</p>
          <p className="confirm-delete-details">
            This action cannot be undone.
          </p>
        </div>
      ),
      header: 'Delete Participant',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      draggable: false,
      resizable: false,
      accept: async () => {
        setLoading(true);
        try {
          await projectService.deleteParticipant(projectId, participant._id);
          setParticipants((prev) =>
            prev.filter((p) => p._id !== participant._id)
          );
          toast.success('Participant deleted successfully');
        } catch (err) {
          console.error(err);
          toast.error('Failed to delete participant');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const deleteButtonTemplate = (rowData) => {
    return (
      <div className="delete-button-cell">
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger delete-trash-button"
          onClick={() => confirmDelete(rowData)}
          disabled={loading}
        />
      </div>
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await projectService.updateAllParticipants(
        projectId,
        participants
      );

      if (response.status === StatusCodes.OK) {
        toast.success('Participants list saved successfully');
      } else {
        toast.error('Failed to save participants list');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving participants list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="participants-section">
      {loading && (
        <div className="participants-loading-overlay">
          <LoadingSpinner text="Loading participants..." />
        </div>
      )}

      <AddParticipantForm
        projectId={projectId}
        onParticipantAdded={fetchParticipants}
      />

      <div className="participants-table-wrapper">
        <DataTable
          value={participants}
          editMode="row"
          dataKey="_id"
          onRowEditComplete={onRowEditComplete}
          tableStyle={{ minWidth: '50rem' }}
          loading={loading}
        >
          <Column
            body={deleteButtonTemplate}
            headerStyle={{ width: '4rem' }}
            bodyStyle={{ textAlign: 'center' }}
          />
          <Column
            field="firstName"
            header="First Name"
            editor={textEditor}
            style={{ width: '25%', textAlign: 'center' }}
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
                disabled={loading}
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
      </div>

      <Dialog
        header="Edit Criteria"
        visible={criteriaDialogVisible}
        style={{ width: '400px' }}
        onHide={() => setCriteriaDialogVisible(false)}
        modal
        className="criteria-dialog"
        contentClassName="criteria-dialog-content"
        headerClassName="criteria-dialog-header"
        closeIcon="pi pi-times"
        draggable={false}
        resizable={false}
        showHeader={true}
      >
        {selectedParticipant && (
          <CriteriaEditorForm
            participant={selectedParticipant}
            preloadedCriteria={criteriaDefs}
            onClose={() => setCriteriaDialogVisible(false)}
            onSave={(updatedCriteria) => {
              setParticipants((prev) =>
                prev.map((p) =>
                  p._id === selectedParticipant._id
                    ? { ...p, criteria: updatedCriteria }
                    : p
                )
              );
              setCriteriaDialogVisible(false);
            }}
            onLoad={() => {}}
          />
        )}
      </Dialog>

      <Button
        label="Save"
        icon="pi pi-save"
        className="p-button-success"
        style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
        onClick={handleSave}
        disabled={loading}
      />
      <ConfirmDialog />
    </div>
  );
};

export default ParticipantsSection;

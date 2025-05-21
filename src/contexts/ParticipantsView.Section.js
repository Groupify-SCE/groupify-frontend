import React, { useState, useEffect, useCallback, useRef } from 'react';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../styles/ParticipantsViewSection.style.css';
import LoadingSpinner from '../components/LoadingSpinner';

const ParticipantsViewSection = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchParticipants = useCallback(
    async (forceFetch = false) => {
      // Skip redundant fetches if we already have data and not forcing a refresh
      if (hasFetched.current && !forceFetch) {
        console.log('Skipping participants view fetch - data already loaded');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching participants for view:', projectId);
        const result = await projectService.getAllParticipants(projectId);
        const data = await result.json();
        if (result.status === StatusCodes.OK) {
          console.log(
            'Participants loaded:',
            data.response?.length || 0,
            'items'
          );
          setParticipants(data.response || []);
          hasFetched.current = true;
        } else {
          toast.error('Failed to fetch participants');
        }
      } catch (err) {
        console.error('Error fetching participants for view:', err);
        toast.error('Error fetching participants');
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  useEffect(() => {
    // Reset fetched state when projectId changes
    if (projectId) {
      hasFetched.current = false;
      fetchParticipants();
    }

    return () => {
      // Clean up when component unmounts
      hasFetched.current = false;
    };
  }, [projectId, fetchParticipants]);

  const renderStatus = (rowData) => {
    const hasPreferences = rowData?.preferences;
    return (
      <span className={hasPreferences ? 'status-check' : 'status-x'}>
        {hasPreferences ? '✔' : '✘'}
      </span>
    );
  };

  const refreshParticipants = () => {
    // Force a refresh when the user explicitly requests it
    fetchParticipants(true);
  };

  return (
    <div className="participants-section">
      {loading && (
        <div className="participants-loading-overlay">
          <LoadingSpinner text="Loading participants..." />
        </div>
      )}

      <div className="styled-table-wrapper">
        <DataTable
          value={participants}
          className="styled-table"
          responsiveLayout="scroll"
          loading={loading}
          emptyMessage="No participants found. Add participants in the Edit Participants tab."
        >
          <Column field="firstName" header="First Name" className="column" />
          <Column field="lastName" header="Last Name" className="column" />
          <Column field="tz" header="ID" className="column" />
          <Column header="Status" body={renderStatus} className="column" />
        </DataTable>

        {participants.length > 0 && (
          <div className="refresh-button-container">
            <button
              className="refresh-button"
              onClick={refreshParticipants}
              disabled={loading}
            >
              Refresh List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsViewSection;

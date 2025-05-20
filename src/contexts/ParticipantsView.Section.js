import React, { useState, useEffect, useCallback } from 'react';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../styles/ParticipantsViewSection.style.css';

const ParticipantsViewSection = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);

  const fetchParticipants = useCallback(async () => {
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
  }, [projectId]);

  useEffect(() => {
    fetchParticipants();
  }, [projectId, fetchParticipants]);

  const renderStatus = (rowData) => {
    const hasPreferences = rowData?.preferences;
    return (
      <span className={hasPreferences ? 'status-check' : 'status-x'}>
        {hasPreferences ? '✔' : '✘'}
      </span>
    );
  };

  return (
    <div className="participants-section">
      <div className="styled-table-wrapper">
        <DataTable
          value={participants}
          className="styled-table"
          responsiveLayout="scroll"
        >
          <Column field="firstName" header="First Name" className="column" />
          <Column field="lastName" header="Last Name" className="column" />
          <Column field="tz" header="ID" className="column" />
          <Column header="Status" body={renderStatus} className="column" />
        </DataTable>
      </div>
    </div>
  );
};

export default ParticipantsViewSection;

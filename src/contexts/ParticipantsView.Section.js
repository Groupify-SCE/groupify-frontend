import React, { useState, useEffect } from 'react';
import projectService from '../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../styles/ParticipantsViewSection.style.css';

const ParticipantsViewSection = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);

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

  const renderStatus = (rowData) => {
    const hasPreferences =
      rowData?.criteria && Object.keys(rowData.criteria).length > 0;
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

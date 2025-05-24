import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import algoService from '../services/algo.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import GroupGrid from '../components/GroupGrid';
import { exportGroupsToExcel } from '../utils/excelExport';
import '../styles/Groups.css';
import LoadingSpinner from '../components/LoadingSpinner';

const ExcelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
  </svg>
);

const GroupsPage = () => {
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const result = await algoService.getAlgorithmResults(id);
        const data = await result.json();
        if (result.status === StatusCodes.OK) {
          setGroups(data.response);
        } else {
          toast.error('Failed to fetch groups');
        }
      } catch (error) {
        toast.error('Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [id]);

  const handleExport = () => {
    try {
      exportGroupsToExcel(groups);
      toast.success('Successfully exported to Excel');
    } catch (error) {
      toast.error('Failed to export to Excel');
    }
  };

  return (
    <div className="groups-page">
      <h1 className="page-title">Group Assignments</h1>
      {loading ? (
        <LoadingSpinner fullPage text="Loading groups..." />
      ) : (
        <>
          <GroupGrid groups={groups} />
          <div className="export-button-container">
            <button className="export-button" onClick={handleExport}>
              <ExcelIcon />
              Export to Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupsPage;

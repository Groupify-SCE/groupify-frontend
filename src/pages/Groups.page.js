import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import algoService from '../services/algo.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import GroupGrid from '../components/GroupGrid';
import '../styles/Groups.css';

const GroupsPage = () => {
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
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

  return (
    <div className="groups-page">
      <h1 className="page-title">Group Assignments</h1>
      {loading ? (
        <div className="loading-spinner">Loading groups...</div>
      ) : (
        <GroupGrid groups={groups} />
      )}
    </div>
  );
};

export default GroupsPage;

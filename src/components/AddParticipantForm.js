import React, { useState } from 'react';
import projectService from '../services/project.service';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';

function AddParticipantForm({ projectId, onParticipantAdded }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tz: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, tz } = formData;

    if (!firstName || !lastName || !tz) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await projectService.addParticipant(
        projectId,
        firstName,
        lastName,
        tz
      );
      const data = await response.json();

      if (response.status === StatusCodes.OK) {
        toast.success('Participant added!');
        setFormData({ firstName: '', lastName: '', tz: '' });
        if (onParticipantAdded) onParticipantAdded();
      } else {
        toast.error(data.response || 'Failed to add participant');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <form className="add-participant-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tz"
        placeholder="ID"
        value={formData.tz}
        onChange={handleChange}
      />
      <button type="submit">Add Participant</button>
    </form>
  );
}

export default AddParticipantForm;

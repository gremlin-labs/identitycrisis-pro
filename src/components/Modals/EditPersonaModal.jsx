import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import ImageModal from './ImageModal';

function EditPersonaModal({ show, onClose, persona, onUpdate }) {
  const [editedPersona, setEditedPersona] = useState({
    id: '',
    username: '',
    fullName: '',
    address: '',
    bio: '',
    password: '',
    profileImage: '',
    physicalDescription: '',
    gender: 'Male',
  });
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (persona) {
      setEditedPersona({ ...persona });
    }
  }, [persona]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPersona({
      ...editedPersona,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedPersona);
  };

  const handleImageClick = () => {
    if (editedPersona.profileImage) {
      setShowImageModal(true);
    }
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  if (!persona) return null;

  const modalFooter = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="button button-outline"
        style={{ marginRight: '8px' }}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="edit-persona-form"
        className="button"
      >
        Save Changes
      </button>
    </>
  );

  return (
    <>
      <BaseModal
        show={show}
        onClose={onClose}
        title="Edit Persona"
        id="edit-persona"
        size="lg"
        footer={modalFooter}
      >
      <form id="edit-persona-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-username" className="field-label">
              Username
            </label>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              id="edit-username"
              name="username"
              value={editedPersona.username}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-fullName" className="field-label">
              Full Name
            </label>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              id="edit-fullName"
              name="fullName"
              value={editedPersona.fullName}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-address" className="field-label">
              Address
            </label>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              id="edit-address"
              name="address"
              value={editedPersona.address}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-bio" className="field-label">
              Bio
            </label>
          </div>
          <div className="input-wrapper">
            <textarea
              id="edit-bio"
              name="bio"
              value={editedPersona.bio}
              onChange={handleChange}
              rows={4}
              className="textarea"
            ></textarea>
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-gender" className="field-label">
              Gender
            </label>
          </div>
          <div className="input-wrapper">
            <select
              id="edit-gender"
              name="gender"
              value={editedPersona.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Nonbinary">Nonbinary</option>
            </select>
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-physicalDescription" className="field-label">
              Physical Description
            </label>
          </div>
          <div className="input-wrapper">
            <textarea
              id="edit-physicalDescription"
              name="physicalDescription"
              value={editedPersona.physicalDescription}
              onChange={handleChange}
              rows={3}
              className="textarea"
              placeholder="Physical description..."
            ></textarea>
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-password" className="field-label">
              Password
            </label>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              id="edit-password"
              name="password"
              value={editedPersona.password}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="edit-profileImage" className="field-label">
              Profile Image
            </label>
          </div>
          <div className="space-y-3">
            {/* Image Preview */}
            {editedPersona.profileImage && (
              <div className="flex justify-center">
                <div 
                  className="relative w-32 h-32 border-2 border-border rounded-lg overflow-hidden bg-background cursor-pointer"
                  onClick={handleImageClick}
                  title="Click to enlarge"
                >
                  <img
                    src={editedPersona.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      // Prevent browser default error message by hiding the broken image
                      e.target.style.display = 'none';
                      // Show fallback message
                      const parent = e.target.parentElement;
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center text-text-muted';
                      fallback.innerHTML = '<span class="text-sm">Image not available</span>';
                      parent.appendChild(fallback);
                    }}
                  />
                </div>
              </div>
            )}
            <div className="input-wrapper">
              <input
                type="url"
                id="edit-profileImage"
                name="profileImage"
                value={editedPersona.profileImage}
                onChange={handleChange}
                placeholder="Profile image URL..."
                className="input"
              />
            </div>
          </div>
        </div>
      </form>
    </BaseModal>

    <ImageModal
      show={showImageModal}
      onClose={handleCloseImageModal}
      imageUrl={editedPersona.profileImage}
      title={editedPersona.fullName ? `${editedPersona.fullName} - Profile Image` : 'Profile Image'}
    />
  </>
  );
}

export default EditPersonaModal;

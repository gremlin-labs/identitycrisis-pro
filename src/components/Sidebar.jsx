import React, { useState } from 'react';
import { CaretLeft, MagnifyingGlass, X, User, PencilSimple, Trash } from 'phosphor-react';

function Sidebar({
  sidebarRef,
  savedPersonas,
  handleLoadPersona,
  handleDeletePersona,
  handleEditPersona
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter personas based on search term
  const filteredPersonas = savedPersonas.filter(persona => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (persona.username && persona.username.toLowerCase().includes(searchLower)) ||
      (persona.fullName && persona.fullName.toLowerCase().includes(searchLower))
    );
  });

  return (
    <aside
      ref={sidebarRef}
      className="sidebar-container w-[300px] flex-shrink-0 border-r border-border flex flex-col h-full"
    >
      <div className="sidebar-header">
        <h2 className="sidebar-title">Personas</h2>
        {savedPersonas.length > 0 && (
          <div className="sidebar-subtitle">
            {savedPersonas.length} Total
          </div>
        )}
        <label htmlFor="sidebar-search" className="sr-only">
          Search personas
        </label>
        <div className="search-input-wrapper">
          <MagnifyingGlass size={16} className="search-icon" />
          <input
            id="sidebar-search"
            type="text"
            className="search-input"
            placeholder="Search Personas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          {searchTerm && (
            <button
              className="clear-search-button"
              onClick={() => setSearchTerm('')}
              title="Clear search"
              type="button"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>
      </div>

      <div className="personas-list">
        {filteredPersonas.length === 0 ? (
          <div className="no-personas-message">
            {searchTerm ? 'No personas match your search.' : 'No Saved Personas'}
          </div>
        ) : (
          <div className="personas-container">
            {filteredPersonas.map(persona => (
              <div
                key={persona.id}
                className="persona-item"
                onClick={() => handleLoadPersona(persona)}
              >
                <div className="persona-details">
                  <div className="persona-icon">
                    {persona.profileImage ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0">
                        <img
                          src={persona.profileImage}
                          alt={persona.fullName || 'Profile'}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center bg-background">
                          <User size={20} weight="fill" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background border border-border flex-shrink-0">
                        <User size={20} weight="fill" />
                      </div>
                    )}
                  </div>
                  <div className="persona-info">
                    <div className="persona-name">{persona.fullName || 'Unnamed'}</div>
                    <div className="persona-username">@{persona.username || 'no-username'}</div>
                  </div>
                </div>
                <div className="persona-actions">
                  <button
                    className="action-button edit-button"
                    onClick={(e) => handleEditPersona(persona, e)}
                    title="Edit persona"
                    type="button"
                  >
                    <PencilSimple size={16} weight="bold" />
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={(e) => handleDeletePersona(persona.id, e)}
                    title="Delete persona"
                    type="button"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

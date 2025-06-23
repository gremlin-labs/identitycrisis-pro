import React from 'react';
import Header from './Header';
import FormFields from './FormFields';

function MainContent({
  mainContentRef,
  provider,
  setProvider,
  handleSettingsClick,
  username,
  setUsername,
  fullName,
  setFullName,
  address,
  setAddress,
  bio,
  setBio,
  password,
  setPassword,
  profileImage,
  setProfileImage,
  physicalDescription,
  setPhysicalDescription,
  gender,
  setGender,
  isGeneratingUsername,
  isGeneratingFullName,
  isGeneratingAddress,
  isGeneratingBio,
  isGeneratingPassword,
  isGeneratingProfileImage,
  isGeneratingPhysicalDescription,
  isSaving,
  saveSuccess,
  handleGenerateUsername,
  handleGenerateFullName,
  handleGenerateAddress,
  handleGenerateBio,
  handleGeneratePassword,
  handleGeneratePhysicalDescription,
  handleGenerateProfileImage,
  handleRegenerateAll,
  handleExportJSON,
  handleSavePersona,
  handleCopy,
  handleUsernameSettingsClick,
  handleFullNameSettingsClick,
  handlePasswordSettingsClick,
  handleImageSettingsClick,
  handleImageClick
}) {
  return (
    <main
      ref={mainContentRef}
      className="main-content flex-1 flex flex-col h-full border-l-0 relative"
    >
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto p-3 pb-20">
        <FormFields
          username={username}
          setUsername={setUsername}
          fullName={fullName}
          setFullName={setFullName}
          address={address}
          setAddress={setAddress}
          bio={bio}
          setBio={setBio}
          password={password}
          setPassword={setPassword}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          physicalDescription={physicalDescription}
          setPhysicalDescription={setPhysicalDescription}
          gender={gender}
          setGender={setGender}
          isGeneratingUsername={isGeneratingUsername}
          isGeneratingFullName={isGeneratingFullName}
          isGeneratingAddress={isGeneratingAddress}
          isGeneratingBio={isGeneratingBio}
          isGeneratingPassword={isGeneratingPassword}
          isGeneratingProfileImage={isGeneratingProfileImage}
          isGeneratingPhysicalDescription={isGeneratingPhysicalDescription}
          handleGenerateUsername={handleGenerateUsername}
          handleGenerateFullName={handleGenerateFullName}
          handleGenerateAddress={handleGenerateAddress}
          handleGenerateBio={handleGenerateBio}
          handleGeneratePassword={handleGeneratePassword}
          handleGeneratePhysicalDescription={handleGeneratePhysicalDescription}
          handleGenerateProfileImage={handleGenerateProfileImage}
          handleCopy={handleCopy}
          handleUsernameSettingsClick={handleUsernameSettingsClick}
          handleFullNameSettingsClick={handleFullNameSettingsClick}
          handlePasswordSettingsClick={handlePasswordSettingsClick}
          handleImageSettingsClick={handleImageSettingsClick}
          handleImageClick={handleImageClick}
        />
      </div>

      {/* Fixed Action Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-3">
        <div className="flex justify-end gap-2">
          <button
            className="button-compact flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-color border border-border rounded-md shadow-sm hover:bg-primary-hover transition-colors"
            onClick={handleRegenerateAll}
            disabled={
              isGeneratingUsername ||
              isGeneratingFullName ||
              isGeneratingAddress ||
              isGeneratingBio ||
              isGeneratingPassword ||
              isGeneratingPhysicalDescription ||
              isGeneratingProfileImage
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.97" />
              <path d="M17 8l4-4-4-4" />
            </svg>
            <span>
              {(!username && !fullName && !address && !bio && !password && !profileImage && !physicalDescription) 
                ? 'Generate' 
                : 'Regenerate'
              }
            </span>
          </button>
          <button
            className="button-compact flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-color border border-border rounded-md shadow-sm hover:bg-primary-hover transition-colors"
            onClick={handleExportJSON}
            disabled={!username && !fullName && !address && !bio && !password && !profileImage && !physicalDescription}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4m10 5v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
            </svg>
            <span>Export</span>
          </button>
          <button
            className={`button-compact flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md shadow-sm transition-all duration-300 ${
              saveSuccess 
                ? 'bg-green-500 text-white border-green-500 animate-pulse' 
                : isSaving 
                  ? 'bg-yellow-500 text-white border-yellow-500' 
                  : 'bg-accent hover:bg-accent-hover'
            }`}
            onClick={handleSavePersona}
            disabled={(!username && !fullName) || isSaving}
          >
            {isSaving ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Saved!</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

export default MainContent;

import React from 'react';
import {
  ArrowClockwise,
  Copy,
  Sliders,
  Eye,
  EyeSlash,
  Image
} from 'phosphor-react';

function FormFields({
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
  handleGenerateUsername,
  handleGenerateFullName,
  handleGenerateAddress,
  handleGenerateBio,
  handleGeneratePassword,
  handleGeneratePhysicalDescription,
  handleGenerateProfileImage,
  handleCopy,
  handleUsernameSettingsClick,
  handleFullNameSettingsClick,
  handlePasswordSettingsClick,
  handleImageSettingsClick,
  handleImageClick
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Top Section - Profile Image + Username/Full Name */}
      <div className="grid grid-cols-[240px_1fr] gap-6">
        {/* Left - Profile Image */}
        <div className="space-y-3">
          {/* Profile Image Display */}
          <div className="field-group">
            <div className="field-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="field-label">
                    Profile Image
                  </label>
                  <Sliders 
                    size={14} 
                    weight="bold" 
                    className="text-text-muted cursor-pointer hover:text-primary transition-colors"
                    onClick={handleImageSettingsClick}
                    title="Image generation settings"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded-full hover:bg-primary-color/10 transition-colors"
                    onClick={() => handleCopy(profileImage, 'Profile Image URL')}
                    title="Copy image URL"
                    disabled={!profileImage}
                  >
                    <Copy size={16} weight="bold" />
                  </button>
                  <button
                    className="p-1 rounded-full hover:bg-primary-color/10 transition-colors"
                    onClick={handleGenerateProfileImage}
                    disabled={isGeneratingProfileImage}
                    title="Generate profile image"
                  >
                    {isGeneratingProfileImage ? (
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <Image size={16} weight="bold" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Large Image Preview */}
            <div className="relative w-full aspect-square border-2 border-border rounded-lg overflow-hidden bg-background">
              {profileImage ? (
                <div 
                  className="w-full h-full cursor-pointer"
                  onClick={handleImageClick}
                  title="Click to enlarge"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      // Prevent browser default error message by hiding the broken image
                      e.target.style.display = 'none';
                      // Show the fallback placeholder instead
                      const parent = e.target.parentElement;
                      const fallback = parent.querySelector('.fallback-placeholder');
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="fallback-placeholder hidden w-full h-full flex items-center justify-center text-text-muted">
                    <div className="text-center">
                      <Image size={48} weight="light" className="mx-auto mb-2" />
                      <span className="text-sm">No image available</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <Image size={48} weight="light" className="mx-auto mb-2" />
                    <span className="text-sm">No image generated</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Username, Full Name, and Gender */}
        <div className="space-y-4">
          {/* Username Field */}
          <div className="field-group">
            <div className="field-header">
              <div className="flex items-center gap-2">
                <label htmlFor="username" className="field-label">
                  Username
                </label>
                <Sliders 
                  size={14} 
                  weight="bold" 
                  className="text-text-muted cursor-pointer hover:text-primary transition-colors"
                  onClick={handleUsernameSettingsClick}
                  title="Username settings"
                />
              </div>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                className="input h-10 w-full px-3 py-2 rounded-md border border-border bg-text-input-surface focus:border-primary-color focus:ring-1 focus:ring-primary-color shadow-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Generate a username..."
              />
              <button
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
                onClick={() => handleCopy(username, 'Username')}
                title="Copy username"
                disabled={!username}
              >
                <Copy size={16} weight="bold" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
                onClick={handleGenerateUsername}
                disabled={isGeneratingUsername}
                title="Generate username"
              >
                {isGeneratingUsername ? (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                ) : (
                  <ArrowClockwise size={16} weight="bold" />
                )}
              </button>
            </div>
          </div>

          {/* Full Name Field */}
          <div className="field-group">
            <div className="field-header">
              <div className="flex items-center gap-2">
                <label htmlFor="fullName" className="field-label">
                  Full Name
                </label>
                <Sliders 
                  size={14} 
                  weight="bold" 
                  className="text-text-muted cursor-pointer hover:text-primary transition-colors"
                  onClick={handleFullNameSettingsClick}
                  title="Full name settings"
                />
              </div>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                id="fullName"
                className="input h-10 w-full px-3 py-2 rounded-md border border-border bg-text-input-surface focus:border-primary-color focus:ring-1 focus:ring-primary-color shadow-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Generate a full name..."
              />
              <button
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
                onClick={() => handleCopy(fullName, 'Full Name')}
                title="Copy full name"
                disabled={!fullName}
              >
                <Copy size={16} weight="bold" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
                onClick={handleGenerateFullName}
                disabled={isGeneratingFullName}
                title="Generate full name"
              >
                {isGeneratingFullName ? (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                ) : (
                  <ArrowClockwise size={16} weight="bold" />
                )}
              </button>
            </div>
          </div>

          {/* Gender Field */}
          <div className="field-group">
            <div className="field-header">
              <label htmlFor="gender" className="field-label">
                Gender
              </label>
            </div>
            <div className="input-wrapper">
              <select
                id="gender"
                className="input h-10 w-full px-3 py-2 rounded-md border border-border bg-text-input-surface focus:border-primary-color focus:ring-1 focus:ring-primary-color shadow-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Nonbinary">Nonbinary</option>
              </select>
            </div>
          </div>
        </div>
      </div>



      {/* Full Width Fields Below */}
      <div className="space-y-4">
        {/* Bio Field */}
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="bio" className="field-label">
              Bio
            </label>
          </div>
          <div className="input-wrapper bio-wrapper">
            <textarea
              id="bio"
              className="textarea w-full px-3 py-2 rounded-md border border-border bg-text-input-surface focus:border-primary-color focus:ring-1 focus:ring-primary-color shadow-sm"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Generate a bio..."
              rows={3}
            ></textarea>
            <button
              className="absolute right-10 top-3 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={() => handleCopy(bio, 'Bio')}
              title="Copy bio"
              disabled={!bio}
            >
              <Copy size={16} weight="bold" />
            </button>
            <button
              className="absolute right-2 top-3 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={handleGenerateBio}
              disabled={isGeneratingBio}
              title="Generate bio"
            >
              {isGeneratingBio ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <ArrowClockwise size={16} weight="bold" />
              )}
            </button>
          </div>
        </div>

        {/* Physical Description Field */}
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="physicalDescription" className="field-label">
              Physical Description
            </label>
          </div>
          <div className="input-wrapper bio-wrapper">
            <textarea
              id="physicalDescription"
              className="textarea w-full px-3 py-2 rounded-md border border-border bg-text-input-surface focus:border-primary-color focus:ring-1 focus:ring-primary-color shadow-sm"
              value={physicalDescription}
              onChange={(e) => setPhysicalDescription(e.target.value)}
              placeholder="Generate a physical description..."
              rows={3}
            ></textarea>
            <button
              className="absolute right-10 top-3 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={() => handleCopy(physicalDescription, 'Physical Description')}
              title="Copy physical description"
              disabled={!physicalDescription}
            >
              <Copy size={16} weight="bold" />
            </button>
            <button
              className="absolute right-2 top-3 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={handleGeneratePhysicalDescription}
              disabled={isGeneratingPhysicalDescription}
              title="Generate physical description"
            >
              {isGeneratingPhysicalDescription ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <ArrowClockwise size={16} weight="bold" />
              )}
            </button>
          </div>
        </div>

        {/* Address Field */}
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="address" className="field-label">
              Address
            </label>
          </div>
          <div className="input-wrapper address-wrapper">
            <textarea
              id="address"
              className="textarea w-full px-3 py-2 rounded-md border border-border bg-text-input-surface focus:border-primary-color focus:ring-1 focus:ring-primary-color shadow-sm"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Generate an address..."
              rows={2}
            ></textarea>
            <button
              className="absolute right-10 top-3 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={() => handleCopy(address, 'Address')}
              title="Copy address"
              disabled={!address}
            >
              <Copy size={16} weight="bold" />
            </button>
            <button
              className="absolute right-2 top-3 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={handleGenerateAddress}
              disabled={isGeneratingAddress}
              title="Generate address"
            >
              {isGeneratingAddress ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <ArrowClockwise size={16} weight="bold" />
              )}
            </button>
            </div>
        </div>

        {/* Password Field */}
        <div className="field-group">
          <div className="field-header">
            <div className="flex items-center gap-2">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <Sliders 
                size={14} 
                weight="bold" 
                className="text-text-muted cursor-pointer hover:text-primary transition-colors"
                onClick={handlePasswordSettingsClick}
                title="Password settings"
              />
            </div>
          </div>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="input h-10 w-full px-3 py-2 rounded-md border border-border bg-text-input-surface focus:border-primary-color focus:ring-1 focus:ring-primary-color shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Generate a password..."
            />
            <button
              className="absolute right-16 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={() => handleCopy(password, 'Password')}
              title="Copy password"
              disabled={!password}
            >
              <Copy size={16} weight="bold" />
            </button>
            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlash size={16} weight="bold" />
              ) : (
                <Eye size={16} weight="bold" />
              )}
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-color/10 transition-colors"
              onClick={handleGeneratePassword}
              disabled={isGeneratingPassword}
              title="Generate password"
            >
              {isGeneratingPassword ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <ArrowClockwise size={16} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

export default FormFields;

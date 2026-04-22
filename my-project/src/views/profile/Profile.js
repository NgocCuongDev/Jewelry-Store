import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import apiUser from '../../api/apiUser'
import apiProduct from '../../api/apiProduct'
import axiosServer from '../../api/axiosServer'
import '../../scss/Users.css'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilHome, cilLockLocked, cilImage, cilSave, cilCloudUpload, cilPencil, cilX } from '@coreui/icons'

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [backupData, setBackupData] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    id: null,
    userName: '',
    userPassword: '',
    userDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      street: '',
      streetNumber: '',
      zipCode: '',
      locality: '',
      country: '',
      image: ''
    },
    role: {
      roleName: ''
    },
    active: 1
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (!storedUser || !storedUser.id) {
        throw new Error('User session not found. Please log in again.')
      }

      const data = await apiUser.getProfile(storedUser.id)
      const formattedData = {
        ...data,
        userPassword: '', // Don't populate password
        userDetails: {
          ...data.userDetails,
          firstName: data.userDetails?.firstName || '',
          lastName: data.userDetails?.lastName || '',
          email: data.userDetails?.email || '',
          phoneNumber: data.userDetails?.phoneNumber || '',
          street: data.userDetails?.street || '',
          streetNumber: data.userDetails?.streetNumber || '',
          zipCode: data.userDetails?.zipCode || '',
          locality: data.userDetails?.locality || '',
          country: data.userDetails?.country || '',
          image: data.userDetails?.image || ''
        }
      }
      setFormData(formattedData)
      setBackupData(formattedData)
      
      if (data.userDetails?.image) {
        const imageUrl = data.userDetails.image.startsWith('http')
          ? data.userDetails.image
          : `${axiosServer.defaults.USER_IMAGE_URL}${data.userDetails.image.startsWith('/') ? '' : '/'}${data.userDetails.image}`
        setImagePreview(imageUrl)
      }
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      userDetails: { ...prev.userDetails, image: '' }
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEditToggle = () => setIsEditMode(true)

  const handleCancel = () => {
    setFormData(backupData)
    if (backupData.userDetails?.image) {
      const imageUrl = backupData.userDetails.image.startsWith('http')
        ? backupData.userDetails.image
        : `${axiosServer.defaults.USER_IMAGE_URL}${backupData.userDetails.image.startsWith('/') ? '' : '/'}${backupData.userDetails.image}`
      setImagePreview(imageUrl)
    } else {
      setImagePreview(null)
    }
    setSelectedFile(null)
    setIsEditMode(false)
  }

  const handleClose = () => navigate('/dashboard')

  const handleSave = async () => {
    setSaving(true)
    try {
      let imageUrl = formData.userDetails.image

      if (selectedFile) {
        const uploadRes = await apiProduct.uploadImage(selectedFile)
        imageUrl = uploadRes.imageUrl
      }

      const dataToSave = {
        ...formData,
        userDetails: {
          ...formData.userDetails,
          image: imageUrl
        }
      }

      // Remove password if empty to avoid accidental change
      if (!dataToSave.userPassword) {
        delete dataToSave.userPassword
      }

      await apiUser.updateUser(formData.id, dataToSave)
      
      // Update local storage if it's the current user
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser && storedUser.id === formData.id) {
          const updatedUser = { ...storedUser, image: imageUrl, userName: formData.userName }
          localStorage.setItem('user', JSON.stringify(updatedUser))
      }

      alert('Profile updated successfully!')
      setSaving(false)
      setSelectedFile(null)
      setIsEditMode(false)
      fetchProfile() // Refresh data and backupData
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message))
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="pt-5 text-center">
      <CSpinner color="primary" variant="grow" />
      <p className="mt-2 text-muted">Loading your profile...</p>
    </div>
  )

  if (error) return (
    <CCard className="mb-4">
      <CCardBody className="text-danger p-5 text-center">
        <h3>Oops!</h3>
        <p>Error loading profile: {error}</p>
        <CButton color="primary" onClick={fetchProfile}>Retry</CButton>
      </CCardBody>
    </CCard>
  )

  return (
    <CRow className="justify-content-center">
      <CCol lg={10} xl={8}>
        <CCard className="user-premium-modal border-0 shadow-lg mb-5" style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <CCardHeader className="bg-white border-0 pt-4 px-4 pb-0">
            <div className="d-flex align-items-center gap-3 w-100">
              <div className="premium-icon-wrapper">
                <CIcon icon={cilUser} className="premium-modal-icon" />
              </div>
              <div className="flex-grow-1">
                <h2 className="premium-modal-title">My Profile</h2>
                <p className="premium-modal-subtitle mb-0">Manage your personal information and account settings</p>
              </div>
              {/* Avatar Preview in Header */}
              {imagePreview && (
                <div className="header-avatar-preview d-none d-sm-block">
                  <img
                    src={imagePreview}
                    alt="Avatar"
                    className="header-avatar-img"
                  />
                </div>
              )}
            </div>
          </CCardHeader>

          <CCardBody className="p-0">
            {/* Tabs Navigation */}
            <CNav variant="tabs" className="px-4 premium-tabs mt-4" layout="justified">
              <CNavItem>
                <CNavLink
                  active={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                  className="premium-tab-link cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilLockLocked} className="me-2" />
                  Account
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                  className="premium-tab-link cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilHome} className="me-2" />
                  Personal Info
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                  className="premium-tab-link cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilImage} className="me-2" />
                  Avatar
                </CNavLink>
              </CNavItem>
            </CNav>

            <div className="px-4 py-4">
              <CTabContent>
                {/* Tab 1: Account Information */}
                <CTabPane visible={activeTab === 1}>
                  <div className="form-section">
                     <div className="section-header">
                        <div className="section-indicator"></div>
                        <h5 className="section-title">Account Credentials</h5>
                        <span className="section-badge">Secure</span>
                    </div>
                    <CRow className="g-4">
                      <CCol md={6}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            required
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="userName" className="premium-label">Username</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            type="password"
                            id="userPassword"
                            name="userPassword"
                            value={formData.userPassword}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="userPassword" className="premium-label">New Password</CFormLabel>
                          <div className="input-focus-border"></div>
                          <small className="form-hint text-muted">Leave blank to keep current password</small>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            type="email"
                            id="email"
                            name="userDetails.email"
                            value={formData.userDetails.email}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="email" className="premium-label">Email Address</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="phone"
                            name="userDetails.phoneNumber"
                            value={formData.userDetails.phoneNumber}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="phone" className="premium-label">Phone Number</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                    </CRow>
                  </div>
                </CTabPane>

                {/* Tab 2: Personal & Address Information */}
                <CTabPane visible={activeTab === 2}>
                  <div className="form-section">
                    <div className="section-header">
                        <div className="section-indicator"></div>
                        <h5 className="section-title">Personal Details</h5>
                    </div>
                    <CRow className="g-4">
                      <CCol md={6}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="firstName"
                            name="userDetails.firstName"
                            value={formData.userDetails.firstName}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="firstName" className="premium-label">First Name</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="lastName"
                            name="userDetails.lastName"
                            value={formData.userDetails.lastName}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="lastName" className="premium-label">Last Name</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      
                      <div className="section-header mt-4">
                        <div className="section-indicator"></div>
                        <h5 className="section-title">Contact Address</h5>
                      </div>

                      <CCol md={8}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="street"
                            name="userDetails.street"
                            value={formData.userDetails.street}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="street" className="premium-label">Street Name</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      <CCol md={4}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="streetNumber"
                            name="userDetails.streetNumber"
                            value={formData.userDetails.streetNumber}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="streetNumber" className="premium-label">Number</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      <CCol md={4}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="zipCode"
                            name="userDetails.zipCode"
                            value={formData.userDetails.zipCode}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="zipCode" className="premium-label">Zip Code</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      <CCol md={4}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="locality"
                            name="userDetails.locality"
                            value={formData.userDetails.locality}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="locality" className="premium-label">City</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                      <CCol md={4}>
                        <div className="form-floating-wrapper">
                          <CFormInput
                            id="country"
                            name="userDetails.country"
                            value={formData.userDetails.country}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder=" "
                            readOnly={!isEditMode}
                          />
                          <CFormLabel htmlFor="country" className="premium-label">Country</CFormLabel>
                          <div className="input-focus-border"></div>
                        </div>
                      </CCol>
                    </CRow>
                  </div>
                </CTabPane>

                {/* Tab 3: Avatar Upload */}
                <CTabPane visible={activeTab === 3}>
                  <div className="form-section text-center">
                    <div className="avatar-upload-container">
                      <div className="avatar-preview-large mx-auto">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="avatar-large-img"
                          />
                        ) : (
                          <div className="avatar-placeholder-large">
                            <CIcon icon={cilUser} className="avatar-placeholder-icon" />
                          </div>
                        )}
                      </div>

                      <div className="avatar-upload-controls mt-4">
                        {isEditMode ? (
                          <>
                            <label htmlFor="avatar-upload" className="upload-avatar-btn cursor-pointer">
                              <CIcon icon={cilCloudUpload} className="me-2" />
                              {selectedFile ? 'Change Photo' : 'Upload New Photo'}
                            </label>
                            <CFormInput
                              type="file"
                              id="avatar-upload"
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                              accept="image/*"
                              className="d-none"
                            />
                            {imagePreview && (
                              <CButton color="danger" variant="outline" onClick={handleRemoveImage} className="remove-avatar-btn ms-2">
                                Remove
                              </CButton>
                            )}
                          </>
                        ) : (
                          <p className="text-muted small">Edit profile to change avatar</p>
                        )}
                      </div>
                      <p className="upload-hint mt-3 text-muted">
                        Supported formats: JPG, PNG. Max size: 5MB.
                      </p>
                    </div>
                  </div>
                </CTabPane>
              </CTabContent>
            </div>
          </CCardBody>

          <div className="border-0 px-4 pb-4 pt-2 mb-2 d-flex justify-content-center gap-3">
            {!isEditMode ? (
              <>
                <CButton
                  color="primary"
                  onClick={handleEditToggle}
                  className="premium-btn premium-btn-primary px-5"
                  style={{ minWidth: '200px' }}
                >
                  <CIcon icon={cilPencil} className="me-2" />
                  Edit Profile
                </CButton>
                <CButton
                  color="secondary"
                  onClick={handleClose}
                  className="premium-btn premium-btn-secondary px-5"
                  style={{ minWidth: '200px' }}
                >
                  <CIcon icon={cilX} className="me-2" />
                  Close
                </CButton>
              </>
            ) : (
              <>
                <CButton
                  color="primary"
                  onClick={handleSave}
                  className="premium-btn premium-btn-primary px-5"
                  disabled={saving}
                  style={{ minWidth: '200px' }}
                >
                  {saving ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Save Changes
                    </>
                  )}
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={handleCancel}
                  className="premium-btn px-5"
                  style={{ minWidth: '200px', borderRadius: '40px' }}
                >
                  <CIcon icon={cilX} className="me-2" />
                  Cancel
                </CButton>
              </>
            )}
          </div>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile

import React, { useState, useEffect, useRef } from 'react'
import apiUser from '../../api/apiUser'
import apiProduct from '../../api/apiProduct'
import axiosServer from '../../api/axiosServer'
import '../../scss/Premium.css'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
  CAvatar,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilUser, cilHome, cilLockLocked, cilImage } from '@coreui/icons'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modal, setModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState(1)
  const [imagePreview, setImagePreview] = useState(null)

  const fileInputRef = useRef(null)

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
      roleName: 'USER'
    },
    active: 1
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await apiUser.getAllUsers()
      setUsers(data)
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser && storedUser.id) {
        const me = data.find(u => u.id === storedUser.id)
        setCurrentUser(me)
      }
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleModal = () => {
    setModal(!modal)
    setSelectedFile(null)
    setImagePreview(null)
    setActiveTab(1)
    if (!modal) {
      setEditMode(false)
      setFormData({
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
        role: { roleName: 'ROLE_USER' },
        active: 1
      })
    }
  }

  const handleEdit = (user) => {
    setEditMode(true)
    setFormData({
      id: user.id,
      userName: user.userName,
      userPassword: '',
      userDetails: {
        firstName: user.userDetails?.firstName || '',
        lastName: user.userDetails?.lastName || '',
        email: user.userDetails?.email || '',
        phoneNumber: user.userDetails?.phoneNumber || '',
        street: user.userDetails?.street || '',
        streetNumber: user.userDetails?.streetNumber || '',
        zipCode: user.userDetails?.zipCode || '',
        locality: user.userDetails?.locality || '',
        country: user.userDetails?.country || '',
        image: user.userDetails?.image || ''
      },
      role: {
        roleName: user.role?.roleName || 'ROLE_USER'
      },
      active: user.active
    })
    // Set image preview for edit mode
    if (user.userDetails?.image) {
      const imageUrl = user.userDetails.image.startsWith('http')
        ? user.userDetails.image
        : `${axiosServer.defaults.USER_IMAGE_URL}${user.userDetails.image.startsWith('/') ? '' : '/'}${user.userDetails.image}`
      setImagePreview(imageUrl)
    }
    setModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiUser.deleteUser(id)
        fetchUsers()
      } catch (err) {
        alert('Failed to delete user: ' + err.message)
      }
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

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: { ...formData.role, roleName: e.target.value }
    })
  }

  const handleStatusChange = (e) => {
    setFormData({ ...formData, active: e.target.checked ? 1 : 0 })
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
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

  const handleSave = async () => {
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

      if (editMode) {
        await apiUser.updateUser(formData.id, dataToSave)
      } else {
        await apiUser.addUser(dataToSave)
      }
      setModal(false)
      setSelectedFile(null)
      setImagePreview(null)
      fetchUsers()
    } catch (err) {
      alert('Failed to save user: ' + (err.response?.data?.message || err.message))
    }
  }

  const isAdmin = currentUser?.role?.roleName === 'ADMIN'

  if (loading) return <div className="pt-3 text-center"><div className="spinner-border text-primary"></div></div>
  if (error) return <CCard className="mb-4"><CCardBody className="text-danger">Error: {error}</CCardBody></CCard>

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper">
                <CIcon icon={cilUser} className="header-icon" />
              </div>
              <div>
                <h5 className="premium-header-title mb-0">User Management</h5>
                <p className="premium-header-subtitle mb-0">Manage system access and user profiles</p>
              </div>
            </div>
            <CButton color="primary" size="sm" onClick={toggleModal} className="premium-btn premium-btn-primary">
              <CIcon icon={cilPlus} className="me-2" />
              Add User
            </CButton>
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable align="middle" className="mb-0 premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                  <CTableHeaderCell>User Details</CTableHeaderCell>
                  <CTableHeaderCell>Contacts</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Role</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((user, index) => (
                  <CTableRow key={index} className="premium-table-row">
                    <CTableDataCell className="text-center fw-bold text-muted">#{user.id}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CAvatar
                          size="md"
                          src={user.userDetails?.image
                            ? (user.userDetails.image.startsWith('http')
                              ? user.userDetails.image
                              : `${axiosServer.defaults.USER_IMAGE_URL}${user.userDetails.image.startsWith('/') ? '' : '/'}${user.userDetails.image}`)
                            : null}
                          className="me-3 premium-avatar"
                        />
                        <div>
                          <div className="fw-bold text-dark">{user.userName}</div>
                          <div className="small text-muted">{user.userDetails?.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="small">
                        <div className="text-dark fw-semibold">{user.userDetails?.phoneNumber || 'N/A'}</div>
                        <div className="text-muted">{user.userDetails?.country || 'No location'}</div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge 
                        color={user.role?.roleName === 'ADMIN' ? 'danger' : 'info'} 
                        className="premium-badge shadow-sm"
                      >
                        {user.role?.roleName || 'USER'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge 
                        color={user.active === 1 ? 'success' : 'secondary'}
                        className="premium-badge"
                      >
                        {user.active === 1 ? 'Active' : 'Inactive'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton 
                        color="info" 
                        size="sm" 
                        className="me-2 action-btn action-edit" 
                        onClick={() => handleEdit(user)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton 
                        color="danger" 
                        size="sm" 
                        className="action-btn action-delete" 
                        onClick={() => handleDelete(user.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Premium Modal with Tabs */}
      <CModal
        visible={modal}
        onClose={toggleModal}
        size="xl"
        alignment="center"
        className="user-premium-modal"
      >
        <CModalHeader className="border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="premium-icon-wrapper">
              <CIcon icon={editMode ? cilPencil : cilPlus} className="premium-modal-icon" />
            </div>
            <div className="flex-grow-1">
              <CModalTitle className="premium-modal-title">
                {editMode ? 'Edit User Profile' : 'Create New User'}
              </CModalTitle>
              <p className="premium-modal-subtitle mb-0">
                {editMode ? 'Update user information and permissions' : 'Fill in the details to add a new team member'}
              </p>
            </div>
            {/* Avatar Preview in Header */}
            {(imagePreview || formData.userDetails.image) && (
              <div className="header-avatar-preview">
                <img
                  src={imagePreview || (formData.userDetails.image?.startsWith('http')
                    ? formData.userDetails.image
                    : `${axiosServer.defaults.USER_IMAGE_URL}${formData.userDetails.image?.startsWith('/') ? '' : '/'}${formData.userDetails.image}`)}
                  alt="Avatar preview"
                  className="header-avatar-img"
                />
              </div>
            )}
          </div>
        </CModalHeader>

        {/* Tabs Navigation */}
        <CNav variant="tabs" className="px-4 premium-tabs" layout="justified">
          <CNavItem>
            <CNavLink
              active={activeTab === 1}
              onClick={() => setActiveTab(1)}
              className="premium-tab-link"
            >
              <CIcon icon={cilUser} className="me-2" />
              Account
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 2}
              onClick={() => setActiveTab(2)}
              className="premium-tab-link"
            >
              <CIcon icon={cilHome} className="me-2" />
              Personal & Address
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 3}
              onClick={() => setActiveTab(3)}
              className="premium-tab-link"
            >
              <CIcon icon={cilImage} className="me-2" />
              Avatar
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 4}
              onClick={() => setActiveTab(4)}
              className="premium-tab-link"
            >
              <CIcon icon={cilLockLocked} className="me-2" />
              Permissions
            </CNavLink>
          </CNavItem>
        </CNav>

        <CModalBody className="px-4 py-4">
          <CTabContent>
            {/* Tab 1: Account Information */}
            <CTabPane visible={activeTab === 1}>
              <div className="form-section">
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
                      />
                      <CFormLabel htmlFor="userName" className="premium-label">
                        Username <span className="text-danger">*</span>
                      </CFormLabel>
                      <div className="input-focus-border"></div>
                      <small className="form-hint">Unique identifier for login</small>
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
                        required={!editMode}
                        className="premium-input"
                        placeholder=" "
                      />
                      <CFormLabel htmlFor="userPassword" className="premium-label">
                        {editMode ? 'New Password' : 'Password'}
                        {!editMode && <span className="text-danger">*</span>}
                      </CFormLabel>
                      <div className="input-focus-border"></div>
                      {editMode && <small className="form-hint">Leave blank to keep current password</small>}
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
                      />
                      <CFormLabel htmlFor="email" className="premium-label">Email Address</CFormLabel>
                      <div className="input-focus-border"></div>
                      <small className="form-hint">Will be used for notifications</small>
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
                      />
                      <CFormLabel htmlFor="lastName" className="premium-label">Last Name</CFormLabel>
                      <div className="input-focus-border"></div>
                    </div>
                  </CCol>
                  <CCol md={8}>
                    <div className="form-floating-wrapper">
                      <CFormInput
                        id="street"
                        name="userDetails.street"
                        value={formData.userDetails.street}
                        onChange={handleInputChange}
                        className="premium-input"
                        placeholder=" "
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
                      />
                      <CFormLabel htmlFor="country" className="premium-label">Country</CFormLabel>
                      <div className="input-focus-border"></div>
                    </div>
                  </CCol>
                </CRow>
              </div>
            </CTabPane>

            {/* Tab 3: Avatar Upload with Live Preview */}
            <CTabPane visible={activeTab === 3}>
              <div className="form-section">
                <div className="avatar-upload-container">
                  <div className="avatar-preview-large">
                    {(imagePreview || formData.userDetails.image) ? (
                      <img
                        src={imagePreview || (formData.userDetails.image?.startsWith('http')
                          ? formData.userDetails.image
                          : `${axiosServer.defaults.USER_IMAGE_URL}${formData.userDetails.image?.startsWith('/') ? '' : '/'}${formData.userDetails.image}`)}
                        alt="Profile preview"
                        className="avatar-large-img"
                      />
                    ) : (
                      <div className="avatar-placeholder-large">
                        <CIcon icon={cilUser} className="avatar-placeholder-icon" />
                      </div>
                    )}
                  </div>

                  <div className="avatar-upload-controls">
                    <label htmlFor="avatar-upload" className="upload-avatar-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      {selectedFile ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <CFormInput
                      type="file"
                      id="avatar-upload"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/jpeg,image/png,image/jpg"
                      className="d-none"
                    />
                    {(selectedFile || formData.userDetails.image) && (
                      <CButton color="danger" variant="outline" onClick={handleRemoveImage} className="remove-avatar-btn">
                        Remove
                      </CButton>
                    )}
                    <p className="upload-hint mt-3 mb-0">
                      Recommended: Square image, at least 200x200px.<br />
                      Supported formats: PNG, JPG (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </CTabPane>

            {/* Tab 4: Permissions */}
            <CTabPane visible={activeTab === 4}>
              <div className="form-section">
                <CRow className="g-4">
                  <CCol md={12}>
                    <div className="premium-select-wrapper">
                      <CFormLabel htmlFor="role" className="premium-label-sm">User Role</CFormLabel>
                      <div className="select-container">
                        <CFormSelect
                          id="role"
                          value={formData.role.roleName}
                          onChange={handleRoleChange}
                          disabled={!isAdmin}
                          className="premium-select"
                        >
                          <option value="USER">👤 Standard User - Limited access</option>
                          <option value="ADMIN">👑 Administrator - Full system access</option>
                        </CFormSelect>
                        {!isAdmin && (
                          <div className="select-lock-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {!isAdmin && (
                        <small className="form-hint text-warning mt-2 d-block">
                          Only administrators can change user roles
                        </small>
                      )}
                    </div>
                  </CCol>
                  <CCol md={12}>
                    <div className="premium-switch-card">
                      <div className="switch-content">
                        <div>
                          <div className="switch-label">Account Status</div>
                          <div className="switch-description">
                            {formData.active === 1
                              ? '✅ Active - User can access the system'
                              : '⛔ Inactive - Account is temporarily disabled'}
                          </div>
                        </div>
                        <label className="premium-switch">
                          <input type="checkbox" checked={formData.active === 1} onChange={handleStatusChange} />
                          <span className="switch-slider"></span>
                        </label>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </div>
            </CTabPane>
          </CTabContent>
        </CModalBody>

        <CModalFooter className="border-0 px-4 pb-4 pt-2">
          <div className="d-flex gap-3 w-100">
            <CButton color="secondary" onClick={toggleModal} className="premium-btn premium-btn-secondary flex-grow-1">
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleSave} className="premium-btn premium-btn-primary flex-grow-1">
              {editMode ? 'Save Changes' : 'Create User'}
            </CButton>
          </div>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Users
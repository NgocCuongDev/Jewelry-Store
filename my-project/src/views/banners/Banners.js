import React, { useState, useEffect } from 'react'
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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CBadge,
  CAvatar,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilImage, cilLayers, cilLink, cilSettings, cilSearch, cilInfo } from '@coreui/icons'
import apiBanner from '../../api/apiBanner'
import '../../scss/Products.css' // Reusing premium styles

const Banners = () => {
  const [banners, setBanners] = useState([])
  const [modal, setModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentBanner, setCurrentBanner] = useState({
    id: null,
    name: '',
    link: '',
    image: '',
    position: 'slideshow',
    status: 1,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await apiBanner.getSlideshowBanners()
      setBanners(res)
    } catch (error) {
      console.error('Error fetching banners:', error)
    }
  }

  const handleAdd = () => {
    setCurrentBanner({
      id: null,
      name: '',
      link: '',
      image: '',
      position: 'slideshow',
      status: 1,
    })
    setSelectedFile(null)
    setImagePreview(null)
    setEditMode(false)
    setViewMode(false)
    setActiveTab(1)
    setModal(true)
  }

  const handleClose = () => {
    setModal(false)
  }

  const handleEdit = (banner) => {
    setCurrentBanner(banner)
    setSelectedFile(null)
    setImagePreview(getImageUrl(banner.image))
    setEditMode(true)
    setViewMode(false)
    setActiveTab(1)
    setModal(true)
  }

  const handleView = (banner) => {
    setCurrentBanner(banner)
    setEditMode(false)
    setViewMode(true)
    setModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await apiBanner.deleteBanner(id)
        fetchBanners()
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
  }

  const handleSave = async () => {
    try {
      let finalImageUrl = currentBanner.image
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        const uploadRes = await apiBanner.uploadImage(formData)
        finalImageUrl = uploadRes.imageUrl
      }
      const bannerDataToSave = { ...currentBanner, image: finalImageUrl }

      if (editMode) {
        await apiBanner.updateBanner(currentBanner.id, bannerDataToSave)
      } else {
        await apiBanner.addBanner(bannerDataToSave)
      }
      setModal(false)
      fetchBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
    }
  }

  const getImageUrl = (img) => {
    if (!img) return '/placeholder-banner.png'
    return img.startsWith('http') ? img : `http://localhost:8900/api/banner/${img}`
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 product-premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper" style={{ background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)' }}>
                <CIcon icon={cilImage} className="header-icon" />
              </div>
              <div>
                <strong className="premium-header-title">Banner Management</strong>
                <p className="premium-header-subtitle mb-0">Control your website's visual promotions</p>
              </div>
            </div>
            <CButton color="primary" className="premium-add-btn" onClick={handleAdd}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Banner
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="bg-body-tertiary">Banner</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Position</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {banners.map((banner) => (
                  <CTableRow key={banner.id} className="premium-table-row">
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CAvatar
                          size="xl"
                          src={getImageUrl(banner.image)}
                          className="me-3 premium-avatar shadow-sm"
                          style={{ borderRadius: '12px', width: '80px', height: '45px' }}
                        />
                        <div>
                          <div className="fw-semibold product-name">{banner.name}</div>
                          <div className="small text-body-secondary text-truncate" style={{ maxWidth: '250px' }}>
                            {banner.link}
                          </div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info" className="category-badge text-uppercase">
                        {banner.position}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge
                        color={banner.status === 1 ? 'success' : 'secondary'}
                        className="status-badge"
                      >
                        {banner.status === 1 ? 'Active' : 'Hidden'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center text-nowrap">
                      <CButton color="warning" size="sm" className="me-2 action-btn action-view" onClick={() => handleView(banner)}>
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton color="info" size="sm" className="me-2 action-btn action-edit" onClick={() => handleEdit(banner)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" className="action-btn action-delete" onClick={() => handleDelete(banner.id)}>
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

      <CModal visible={modal} onClose={handleClose} size="lg" alignment="center" className="product-premium-modal">
        <CModalHeader className="border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="premium-icon-wrapper">
              <CIcon icon={viewMode ? cilSearch : (editMode ? cilPencil : cilPlus)} className="premium-modal-icon" />
            </div>
            <div>
              <CModalTitle className="premium-modal-title">
                {viewMode ? 'Banner Details' : (editMode ? 'Edit Banner' : 'Create New Banner')}
              </CModalTitle>
              <p className="premium-modal-subtitle mb-0">
                {viewMode ? 'View full banner information' : 'Configure your promotional banner settings'}
              </p>
            </div>
          </div>
        </CModalHeader>

        {viewMode ? (
          <CModalBody className="p-4">
            <CRow className="g-4">
              <CCol md={12}>
                <div className="main-image-container mb-3 shadow-nm">
                  <CImage src={getImageUrl(currentBanner.image)} fluid className="rounded-4" />
                </div>
                <CCallout color="info" className="description-callout shadow-sm border-0 bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h4 className="fw-bold mb-1">{currentBanner.name}</h4>
                            <p className="text-muted mb-2"><CIcon icon={cilLink} className="me-1"/> {currentBanner.link}</p>
                            <CBadge color="info" className="me-2">{currentBanner.position}</CBadge>
                            <CBadge color={currentBanner.status === 1 ? 'success' : 'secondary'}>
                                {currentBanner.status === 1 ? 'Active' : 'Inactive'}
                            </CBadge>
                        </div>
                    </div>
                </CCallout>
              </CCol>
            </CRow>
          </CModalBody>
        ) : (
          <>
            <CNav variant="tabs" className="px-4 premium-tabs">
              <CNavItem>
                <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} className="premium-tab-link">
                  <CIcon icon={cilLayers} className="me-2" /> Basic Info
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)} className="premium-tab-link">
                  <CIcon icon={cilSettings} className="me-2" /> Settings
                </CNavLink>
              </CNavItem>
            </CNav>
            <CModalBody className="px-4 py-4">
              <CTabContent>
                <CTabPane visible={activeTab === 1}>
                  <CRow className="g-4">
                    <CCol md={12}>
                      <div className="form-floating-wrapper">
                        <CFormInput
                          value={currentBanner.name}
                          onChange={(e) => setCurrentBanner({ ...currentBanner, name: e.target.value })}
                          className="premium-input"
                          placeholder=" "
                        />
                        <CFormLabel className="premium-label">Banner Name</CFormLabel>
                        <div className="input-focus-border"></div>
                      </div>
                    </CCol>
                    <CCol md={12}>
                      <div className="form-floating-wrapper">
                        <CFormInput
                          value={currentBanner.link}
                          onChange={(e) => setCurrentBanner({ ...currentBanner, link: e.target.value })}
                          className="premium-input"
                          placeholder=" "
                        />
                        <CFormLabel className="premium-label">Target URL</CFormLabel>
                        <div className="input-focus-border"></div>
                      </div>
                    </CCol>
                    <CCol md={12}>
                      <div className="form-floating-wrapper">
                        <CFormInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0])
                              setImagePreview(URL.createObjectURL(e.target.files[0]))
                            }
                          }}
                          className="premium-input"
                          placeholder=" "
                        />
                        <CFormLabel className="premium-label">Upload Image</CFormLabel>
                        <div className="input-focus-border"></div>
                      </div>
                      {imagePreview && (
                        <div className="mt-3 mx-auto shadow-sm" style={{ width: '100%', maxWidth: '300px', borderRadius: '12px', overflow: 'hidden' }}>
                            <CImage src={imagePreview} fluid />
                        </div>
                      )}
                    </CCol>
                  </CRow>
                </CTabPane>
                <CTabPane visible={activeTab === 2}>
                  <CRow className="g-4">
                    <CCol md={6}>
                      <div className="form-floating-wrapper">
                        <CFormSelect
                          value={currentBanner.position}
                          onChange={(e) => setCurrentBanner({ ...currentBanner, position: e.target.value })}
                          className="premium-select"
                        >
                          <option value="slideshow">Slideshow</option>
                          <option value="sidebar">Sidebar</option>
                          <option value="footer">Footer</option>
                        </CFormSelect>
                        <CFormLabel className="premium-label">Display Position</CFormLabel>
                        <div className="input-focus-border"></div>
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="form-floating-wrapper">
                        <CFormSelect
                          value={currentBanner.status}
                          onChange={(e) => setCurrentBanner({ ...currentBanner, status: parseInt(e.target.value) })}
                          className="premium-select"
                        >
                          <option value={1}>Visible</option>
                          <option value={0}>Hidden</option>
                        </CFormSelect>
                        <CFormLabel className="premium-label">Status</CFormLabel>
                        <div className="input-focus-border"></div>
                      </div>
                    </CCol>
                  </CRow>
                </CTabPane>
              </CTabContent>
            </CModalBody>
          </>
        )}
        <CModalFooter className="border-0 px-4 pb-4">
          <CButton color="secondary" onClick={handleClose} className="premium-cancel-btn">Cancel</CButton>
          {!viewMode && (
            <CButton color="primary" onClick={handleSave} className="premium-submit-btn">
              {editMode ? 'Update Banner' : 'Create Banner'}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Banners

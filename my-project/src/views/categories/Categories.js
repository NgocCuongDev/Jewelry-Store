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
  CFormInput,
  CFormLabel,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilList, cilSettings } from '@coreui/icons'
import apiCategory from '../../api/apiCategory'
import '../../scss/Products.css'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [formData, setFormData] = useState({
    id: null,
    categoryName: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await apiCategory.getAllCategories()
      setCategories(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const toggleModal = () => {
    setModal(!modal)
    if (!modal) {
      setEditMode(false)
      setActiveTab(1)
      setFormData({ id: null, categoryName: '' })
    }
  }

  const handleEdit = (category) => {
    setEditMode(true)
    setFormData({
      id: category.id,
      categoryName: category.categoryName
    })
    setModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiCategory.deleteCategory(id)
        fetchCategories()
      } catch (err) {
        alert('Failed to delete category: ' + err.message)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.categoryName.trim()) return

    try {
      if (editMode) {
        await apiCategory.updateCategory(formData.id, formData)
      } else {
        await apiCategory.addCategory(formData)
      }
      setModal(false)
      fetchCategories()
    } catch (err) {
      alert('Failed to save category: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <div className="pt-3 text-center"><CSpinner color="primary" /></div>

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 product-premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
                <CIcon icon={cilList} className="header-icon" />
              </div>
              <div>
                <strong className="premium-header-title">Category Management</strong>
                <p className="premium-header-subtitle mb-0">Organize and classify your product inventory</p>
              </div>
            </div>
            <CButton color="primary" className="premium-add-btn" onClick={toggleModal}>
              <CIcon icon={cilPlus} className="me-2" /> Add Category
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="bg-body-tertiary">Category Details</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">ID</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {categories.map((category) => (
                  <CTableRow key={category.id} className="premium-table-row">
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <div className="header-icon-wrapper me-3" style={{ width: '40px', height: '40px', opacity: 0.8, background: '#f8f9fa' }}>
                           <CIcon icon={cilList} className="text-secondary" />
                        </div>
                        <span className="fw-semibold product-name">{category.categoryName}</span>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-muted">
                      #{category.id}
                    </CTableDataCell>
                    <CTableDataCell className="text-center text-nowrap">
                      <CButton color="info" size="sm" className="me-2 action-btn action-edit" onClick={() => handleEdit(category)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" className="action-btn action-delete" onClick={() => handleDelete(category.id)}>
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

      <CModal visible={modal} onClose={toggleModal} size="lg" alignment="center" className="product-premium-modal">
        <CModalHeader className="border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="premium-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
              <CIcon icon={editMode ? cilPencil : cilPlus} className="premium-modal-icon" />
            </div>
            <div>
              <CModalTitle className="premium-modal-title">
                {editMode ? 'Edit Category' : 'Create Category'}
              </CModalTitle>
              <p className="premium-modal-subtitle mb-0">Define how users browse your products</p>
            </div>
          </div>
        </CModalHeader>

        <CNav variant="tabs" className="px-4 premium-tabs">
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} className="premium-tab-link" style={{ cursor: 'pointer' }}>
               Basic Info
            </CNavLink>
          </CNavItem>
        </CNav>

        <CModalBody className="px-4 py-4">
          <CTabContent>
            <CTabPane visible={activeTab === 1}>
              <div className="form-floating-wrapper">
                <CFormInput
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="premium-input"
                  placeholder=" "
                  required
                />
                <CFormLabel className="premium-label">Category Name</CFormLabel>
                <div className="input-focus-border"></div>
              </div>
            </CTabPane>
          </CTabContent>
        </CModalBody>
        <CModalFooter className="border-0 px-4 pb-4">
          <CButton color="secondary" onClick={toggleModal} className="premium-cancel-btn">Cancel</CButton>
          <CButton color="primary" onClick={handleSave} className="premium-submit-btn">
            {editMode ? 'Save Changes' : 'Create Category'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Categories

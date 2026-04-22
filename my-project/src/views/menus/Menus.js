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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilMenu, cilLayers, cilLink, cilSettings, cilList } from '@coreui/icons'
import apiMenu from '../../api/apiMenu'
import '../../scss/Products.css'

const Menus = () => {
  const [menus, setMenus] = useState([])
  const [modal, setModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [currentMenu, setCurrentMenu] = useState({
    id: null,
    name: '',
    link: '',
    type: 'custom',
    parentId: 0,
    sortOrder: 0,
    status: 1,
  })

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const res = await apiMenu.getAllMenus()
      const flattened = []
      const flatten = (items, level = 0) => {
        items.forEach(item => {
          flattened.push({ ...item, level })
          if (item.children && item.children.length > 0) {
            flatten(item.children, level + 1)
          }
        })
      }
      flatten(res)
      setMenus(flattened)
    } catch (error) {
      console.error('Error fetching menus:', error)
    }
  }

  const handleAdd = () => {
    setCurrentMenu({
      id: null,
      name: '',
      link: '',
      type: 'custom',
      parentId: 0,
      sortOrder: 0,
      status: 1,
    })
    setEditMode(false)
    setActiveTab(1)
    setModal(true)
  }

  const handleClose = () => {
    setModal(false)
  }

  const handleEdit = (menu) => {
    setCurrentMenu(menu)
    setEditMode(true)
    setActiveTab(1)
    setModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item and all its children?')) {
      try {
        await apiMenu.deleteMenu(id)
        fetchMenus()
      } catch (error) {
        console.error('Error deleting menu:', error)
      }
    }
  }

  const handleSave = async () => {
    try {
      if (editMode) {
        await apiMenu.updateMenu(currentMenu.id, currentMenu)
      } else {
        await apiMenu.addMenu(currentMenu)
      }
      setModal(false)
      fetchMenus()
    } catch (error) {
      console.error('Error saving menu:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 product-premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                <CIcon icon={cilMenu} className="header-icon" />
              </div>
              <div>
                <strong className="premium-header-title">Menu Management</strong>
                <p className="premium-header-subtitle mb-0">Organize your website navigation hierarchy</p>
              </div>
            </div>
            <CButton color="primary" className="premium-add-btn" onClick={handleAdd}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Item
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="bg-body-tertiary">Menu Structure</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Order</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {menus.map((menu) => (
                  <CTableRow key={menu.id} className="premium-table-row">
                    <CTableDataCell>
                      <div style={{ paddingLeft: `${menu.level * 30}px`, position: 'relative' }} className="d-flex align-items-center">
                        {menu.level > 0 && (
                            <div style={{
                                position: 'absolute',
                                left: `${(menu.level - 1) * 30 + 15}px`,
                                top: '-20px',
                                bottom: '50%',
                                width: '20px',
                                borderLeft: '2px solid #e2e8f0',
                                borderBottom: '2px solid #e2e8f0',
                                borderBottomLeftRadius: '8px'
                            }}></div>
                        )}
                        <div className={`fw-semibold ${menu.level === 0 ? 'product-name fs-5' : 'text-body-secondary'}`}>
                            {menu.name}
                            <div className="small text-muted fw-normal">{menu.link}</div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="light" className="category-badge text-uppercase border">
                        {menu.type}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-primary">
                      {menu.sortOrder}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge
                        color={menu.status === 1 ? 'success' : 'secondary'}
                        className="status-badge"
                      >
                        {menu.status === 1 ? 'Visible' : 'Hidden'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center text-nowrap">
                      <CButton color="info" size="sm" className="me-2 action-btn action-edit" onClick={() => handleEdit(menu)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" className="action-btn action-delete" onClick={() => handleDelete(menu.id)}>
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
            <div className="premium-icon-wrapper" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <CIcon icon={editMode ? cilPencil : cilPlus} className="premium-modal-icon" />
            </div>
            <div>
              <CModalTitle className="premium-modal-title">
                {editMode ? 'Edit Menu Item' : 'Add New Item'}
              </CModalTitle>
              <p className="premium-modal-subtitle mb-0">Build your navigation structure</p>
            </div>
          </div>
        </CModalHeader>

        <CNav variant="tabs" className="px-4 premium-tabs">
          <CNavItem>
            <CNavLink 
              active={activeTab === 1} 
              onClick={() => setActiveTab(1)} 
              className="premium-tab-link"
              style={{ cursor: 'pointer' }}
            >
              <CIcon icon={cilList} className="me-1" /> Basic Info
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink 
              active={activeTab === 2} 
              onClick={() => setActiveTab(2)} 
              className="premium-tab-link"
              style={{ cursor: 'pointer' }}
            >
              <CIcon icon={cilSettings} className="me-1" /> Settings
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
                      value={currentMenu.name}
                      onChange={(e) => setCurrentMenu({ ...currentMenu, name: e.target.value })}
                      className="premium-input"
                      placeholder=" "
                      required
                    />
                    <CFormLabel className="premium-label">Display Name</CFormLabel>
                    <div className="input-focus-border"></div>
                  </div>
                </CCol>
                <CCol md={12}>
                  <div className="form-floating-wrapper">
                    <CFormInput
                      value={currentMenu.link}
                      onChange={(e) => setCurrentMenu({ ...currentMenu, link: e.target.value })}
                      className="premium-input"
                      placeholder=" "
                    />
                    <CFormLabel className="premium-label">Target Link</CFormLabel>
                    <div className="input-focus-border"></div>
                  </div>
                </CCol>
                <CCol md={12}>
                  <div className="form-floating-wrapper">
                    <CFormSelect
                      value={currentMenu.parentId}
                      onChange={(e) => setCurrentMenu({ ...currentMenu, parentId: parseInt(e.target.value) })}
                      className="premium-select"
                    >
                      <option value={0}>[ Root Level ]</option>
                      {menus
                        .filter(m => m.id !== currentMenu.id)
                        .map(m => (
                          <option key={m.id} value={m.id}>
                            {'\u00A0'.repeat(m.level * 2)} {m.name}
                          </option>
                        ))}
                    </CFormSelect>
                    <CFormLabel className="premium-label">Parent Menu Item</CFormLabel>
                    <div className="input-focus-border"></div>
                  </div>
                </CCol>
              </CRow>
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              <CRow className="g-4">
                <CCol md={6}>
                  <div className="form-floating-wrapper">
                    <CFormSelect
                      value={currentMenu.type}
                      onChange={(e) => setCurrentMenu({ ...currentMenu, type: e.target.value })}
                      className="premium-select"
                    >
                      <option value="custom">Custom Link</option>
                      <option value="category">Category Link</option>
                      <option value="post">Fixed Post/Page</option>
                    </CFormSelect>
                    <CFormLabel className="premium-label">Menu Type</CFormLabel>
                    <div className="input-focus-border"></div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="form-floating-wrapper">
                    <CFormInput
                      type="number"
                      value={currentMenu.sortOrder}
                      onChange={(e) => setCurrentMenu({ ...currentMenu, sortOrder: parseInt(e.target.value) })}
                      className="premium-input"
                      placeholder="0"
                    />
                    <CFormLabel className="premium-label">Order</CFormLabel>
                    <div className="input-focus-border"></div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="form-floating-wrapper">
                    <CFormSelect
                      value={currentMenu.status}
                      onChange={(e) => setCurrentMenu({ ...currentMenu, status: parseInt(e.target.value) })}
                      className="premium-select"
                    >
                      <option value={1}>Show</option>
                      <option value={0}>Hide</option>
                    </CFormSelect>
                    <CFormLabel className="premium-label">Status</CFormLabel>
                    <div className="input-focus-border"></div>
                  </div>
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>
        </CModalBody>
        <CModalFooter className="border-0 px-4 pb-4">
          <CButton color="secondary" onClick={handleClose} className="premium-cancel-btn">Cancel</CButton>
          <CButton color="primary" onClick={handleSave} className="premium-submit-btn">
            {editMode ? 'Update Item' : 'Add Item'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Menus

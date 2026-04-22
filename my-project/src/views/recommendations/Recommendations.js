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
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormLabel,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPlus, cilStar, cilUser, cilCart, cilThumbUp, cilSettings } from '@coreui/icons'
import apiRecommendation from '../../api/apiRecommendation'
import apiProduct from '../../api/apiProduct'
import apiUser from '../../api/apiUser'
import '../../scss/Products.css'

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [newRec, setNewRec] = useState({
    userId: '',
    productId: '',
    rating: 5
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [recs, prods, usrs] = await Promise.all([
        apiRecommendation.getAllRecommendations(),
        apiProduct.getAllProducts(),
        apiUser.getAllUsers()
      ])
      setRecommendations(recs)
      setProducts(prods)
      setUsers(usrs)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = (id) => {
    if (window.confirm('Delete this recommendation?')) {
      apiRecommendation.deleteRecommendation(id)
        .then(() => fetchData())
        .catch((err) => alert('Delete failed: ' + err.message))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    apiRecommendation.addRecommendation(newRec.userId, newRec.productId, newRec.rating)
      .then(() => {
        setVisible(false)
        fetchData()
        setNewRec({ userId: '', productId: '', rating: 5 })
      })
      .catch((err) => alert('Save failed: ' + err.message))
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <CIcon 
        key={i} 
        icon={cilStar} 
        size="sm"
        className={i < rating ? 'text-warning me-1' : 'text-secondary opacity-25 me-1'} 
      />
    ))
  }

  if (loading) return <div className="pt-3 text-center"><CSpinner color="primary" /></div>

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 product-premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <CIcon icon={cilThumbUp} className="header-icon" />
              </div>
              <div>
                <strong className="premium-header-title">Smart Recommendations</strong>
                <p className="premium-header-subtitle mb-0">Personalized AI-driven product suggestions</p>
              </div>
            </div>
            <CButton color="primary" className="premium-add-btn" onClick={() => setVisible(true)}>
              <CIcon icon={cilPlus} className="me-2" /> Add AI Hint
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="bg-body-tertiary">User Profile</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Suggested Product</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Confidence</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {recommendations.map((item, index) => (
                  <CTableRow key={index} className="premium-table-row">
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <div className="header-icon-wrapper me-3" style={{ background: '#f8fafc', color: '#64748b', width: '40px', height: '40px' }}>
                           <CIcon icon={cilUser} />
                        </div>
                        <div>
                          <div className="fw-semibold product-name">{item.user?.userName || 'Anonymous'}</div>
                          <div className="small text-muted">{item.user?.userEmail}</div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                       <div className="d-flex align-items-center">
                        <div className="header-icon-wrapper me-3" style={{ background: '#ecfdf5', color: '#10b981', width: '40px', height: '40px' }}>
                           <CIcon icon={cilCart} />
                        </div>
                        <div>
                          <div className="fw-semibold product-name">{item.product?.productName}</div>
                          <CBadge color="info" className="category-badge text-uppercase" style={{fontSize: '0.65rem'}}>
                            {item.product?.category?.categoryName || 'General'}
                          </CBadge>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                       <div className="d-flex justify-content-center">
                          {renderStars(item.rating)}
                       </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton 
                        color="danger" 
                        size="sm" 
                        className="action-btn action-delete" 
                        onClick={() => handleDelete(item.id)}
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

      <CModal visible={visible} onClose={() => setVisible(false)} size="lg" alignment="center" className="product-premium-modal">
        <CModalHeader className="border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="premium-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <CIcon icon={cilPlus} className="premium-modal-icon" />
            </div>
            <div>
              <CModalTitle className="premium-modal-title">New AI Hint</CModalTitle>
              <p className="premium-modal-subtitle mb-0">Connect users with products they'll love</p>
            </div>
          </div>
        </CModalHeader>

        <CNav variant="tabs" className="px-4 premium-tabs">
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} className="premium-tab-link" style={{ cursor: 'pointer' }}>
              Connections
            </CNavLink>
          </CNavItem>
        </CNav>

        <CForm onSubmit={handleSubmit}>
          <CModalBody className="px-4 py-4">
            <CRow className="g-4">
              <CCol md={6}>
                <div className="form-floating-wrapper">
                  <CFormSelect 
                    value={newRec.userId} 
                    onChange={(e) => setNewRec({...newRec, userId: e.target.value})}
                    className="premium-select"
                    required
                  >
                    <option value="">Choose User</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.userName}</option>)}
                  </CFormSelect>
                  <CFormLabel className="premium-label">Select Target User</CFormLabel>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="form-floating-wrapper">
                  <CFormSelect 
                    value={newRec.productId} 
                    onChange={(e) => setNewRec({...newRec, productId: e.target.value})}
                    className="premium-select"
                    required
                  >
                    <option value="">Choose Product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.productName}</option>)}
                  </CFormSelect>
                  <CFormLabel className="premium-label">Recommended Product</CFormLabel>
                </div>
              </CCol>
              <CCol md={12}>
                <div className="form-floating-wrapper">
                  <CFormSelect 
                    value={newRec.rating} 
                    onChange={(e) => setNewRec({...newRec, rating: parseInt(e.target.value)})}
                    className="premium-select"
                  >
                    {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} Stars - {v === 5 ? 'High Confidence' : 'Low Confidence'}</option>)}
                  </CFormSelect>
                  <CFormLabel className="premium-label">Intelligence Score</CFormLabel>
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter className="border-0 px-4 pb-4">
            <CButton color="secondary" onClick={() => setVisible(false)} className="premium-cancel-btn">Discard</CButton>
            <CButton color="primary" type="submit" className="premium-submit-btn">Save Logic</CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </CRow>
  )
}

export default Recommendations

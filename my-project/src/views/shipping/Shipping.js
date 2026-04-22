import React, { useState, useEffect } from 'react'
import apiShipping from '../../api/apiShipping'
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
  CButton,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilLocationPin, cilCalendar, cilCheckCircle, cilMap } from '@coreui/icons'

const Shipping = () => {
  const [shippingList, setShippingList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchShipping = async () => {
    setLoading(true)
    try {
      const data = await apiShipping.getAllShipping()
      setShippingList(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShipping()
  }, [])

  const handleStatusChange = (id, newStatus) => {
    apiShipping.updateShippingStatus(id, newStatus)
      .then(() => fetchShipping())
      .catch((err) => alert('Status update failed: ' + err.message))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success'
      case 'IN_TRANSIT': return 'info'
      case 'PENDING': return 'warning'
      case 'CANCELLED': return 'danger'
      default: return 'primary'
    }
  }

  if (loading) return (
    <div className="pt-3 text-center">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  )

  if (error) return (
    <CCard className="mb-4 premium-card">
      <CCardBody className="text-danger p-4">Error: {error}</CCardBody>
    </CCard>
  )

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper">
                <CIcon icon={cilTruck} className="header-icon" />
              </div>
              <div>
                <h5 className="premium-header-title mb-0">Shipping Management</h5>
                <p className="premium-header-subtitle mb-0">Track shipments and logistics status</p>
              </div>
            </div>
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable align="middle" className="mb-0 premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                  <CTableHeaderCell>Order & Tracking</CTableHeaderCell>
                  <CTableHeaderCell>Destination Address</CTableHeaderCell>
                  <CTableHeaderCell>Shipping Date</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {shippingList.map((item, index) => (
                  <CTableRow key={index} className="premium-table-row">
                    <CTableDataCell className="text-center fw-bold text-muted">#{item.id}</CTableDataCell>
                    <CTableDataCell>
                      <div className="fw-bold text-dark">Order #{item.orderId}</div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <CBadge color="light" className="text-primary border border-primary shadow-sm" style={{fontSize: '0.7rem'}}>
                          {item.trackingNumber}
                        </CBadge>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-start gap-2">
                        <CIcon icon={cilLocationPin} className="text-danger mt-1" size="sm" />
                        <div className="small text-muted" style={{maxWidth: '200px'}}>{item.shippingAddress}</div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="small text-muted">
                        <CIcon icon={cilCalendar} size="sm" className="me-1" />
                        {new Date(item.shippingDate).toLocaleDateString()}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color={getStatusColor(item.status)} className="premium-badge shadow-sm">
                        {item.status.replace('_', ' ')}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CDropdown variant="btn-group">
                        <CDropdownToggle color="secondary" size="sm" className="premium-btn">Update Status</CDropdownToggle>
                        <CDropdownMenu className="shadow border-0">
                          <CDropdownItem onClick={() => handleStatusChange(item.id, 'PENDING')}>Pending</CDropdownItem>
                          <CDropdownItem onClick={() => handleStatusChange(item.id, 'IN_TRANSIT')}>In Transit</CDropdownItem>
                          <CDropdownItem onClick={() => handleStatusChange(item.id, 'DELIVERED')}>Delivered</CDropdownItem>
                          <CDropdownItem divider />
                          <CDropdownItem onClick={() => handleStatusChange(item.id, 'CANCELLED')} className="text-danger">Cancelled</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Shipping


import React, { useState, useEffect } from 'react'
import apiPayment from '../../api/apiPayment'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilCalendar, cilDollar, cilCreditCard } from '@coreui/icons'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' đ'
  }

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const data = await apiPayment.getAllPayments()
      // Ensure data is an array
      setPayments(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (err) {
      console.error('Payment fetch error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const getStatusColor = (status) => {
    if (!status) return 'primary'
    switch (status.toUpperCase()) {
      case 'SUCCESS': return 'success'
      case 'FAILED': return 'danger'
      case 'PENDING': return 'warning'
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
                <CIcon icon={cilDollar} className="header-icon" />
              </div>
              <div>
                <h5 className="premium-header-title mb-0">Payment Management</h5>
                <p className="premium-header-subtitle mb-0">Monitor financial transactions and billing</p>
              </div>
            </div>
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable align="middle" className="mb-0 premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                  <CTableHeaderCell>Order & User</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Amount</CTableHeaderCell>
                  <CTableHeaderCell>Payment Method</CTableHeaderCell>
                  <CTableHeaderCell>Transaction Date</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {payments && payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <CTableRow key={index} className="premium-table-row">
                      <CTableDataCell className="text-center fw-bold text-muted">#{payment.id}</CTableDataCell>
                      <CTableDataCell>
                        <div>
                          <div className="fw-bold text-dark">Order #{payment.orderId || 'N/A'}</div>
                          <div className="small text-muted">Customer User #{payment.userId || 'N/A'}</div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="fw-bold text-success h6 mb-0">
                          {formatCurrency(payment.amount)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          <CIcon icon={cilCreditCard} className="text-info" />
                          <span className="text-dark fw-medium">{payment.paymentMethod || 'Other'}</span>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-muted">
                          <CIcon icon={cilCalendar} size="sm" className="me-1" />
                          {payment.transactionDate ? String(payment.transactionDate).split('T')[0] : 'N/A'}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={getStatusColor(payment.status)} className="premium-badge shadow-sm">
                          {payment.status || 'UNKNOWN'}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center py-4">No payments found</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Payments


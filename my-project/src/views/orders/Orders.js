import React, { useState, useEffect } from 'react'
import apiOrder from '../../api/apiOrder'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilList, cilInfo, cilBasket, cilUser, cilCalendar, cilPrint, cilCloudDownload } from '@coreui/icons'


const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [visible, setVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' đ'
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await apiOrder.getAllOrders()
      setOrders(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = (id, newStatus) => {
    apiOrder.updateOrderStatus(id, newStatus)
      .then(() => fetchOrders())
      .catch((err) => alert('Status update failed: ' + err.message))
  }

  const showDetails = (order) => {
    setSelectedOrder(order)
    setVisible(true)
  }

  const handleDownloadPDF = async (order) => {
    if (!window.html2pdf) {
      alert('Thư viện PDF chưa sẵn sàng, vui lòng đợi trong giây lát!');
      return;
    }

    try {
      setLoading(true); // Hiển thị loading trong khi xử lý
      
      const orderId = `SPXVN${order.id}${Date.now().toString().slice(-4)}`;
      const itemsHtml = order.items.map((item, index) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 4px 0; font-size: 10px;">${index + 1}. ${item.product?.productName || 'Sản phẩm'}</td>
          <td style="padding: 4px 0; font-size: 10px; text-align: center;">${item.quantity}</td>
        </tr>
      `).join('');

      // Tạo một div ẩn nhưng vẫn nằm trong luồng render
      const printContainer = document.createElement('div');
      printContainer.id = 'invoice-print-container';
      printContainer.style.position = 'fixed';
      printContainer.style.top = '0';
      printContainer.style.left = '0';
      printContainer.style.width = '105mm'; // Khổ A6
      printContainer.style.zIndex = '-1000';
      printContainer.style.backgroundColor = 'white';
      
      printContainer.innerHTML = `
        <div id="invoice-content" style="padding: 10mm; background: white; border: 1px solid #000; width: 85mm; margin: 0 auto;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 1px dashed #000; padding-bottom: 5px;">
            <div style="width: 40%;">
              <h1 style="color: #ee4d2d; margin: 0; font-size: 20px; font-weight: bold;">Shopee</h1>
              <p style="color: #ee4d2d; margin: 0; font-size: 12px; font-style: italic; font-weight: bold;">Shopee XPRESS</p>
            </div>
            <div style="width: 60%; text-align: right;">
              <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${orderId}&scale=2" 
                   style="width: 140px; height: 40px; object-fit: contain;" 
                   crossorigin="anonymous" />
              <p style="margin: 2px 0; font-size: 8px;">Vận đơn: <b>${orderId}</b></p>
            </div>
          </div>

          <!-- Address -->
          <div style="display: flex; border-bottom: 1px dashed #000; font-size: 9px; padding: 5px 0;">
            <div style="width: 50%; border-right: 1px dashed #000; padding-right: 5px;">
              <b>TỪ:</b> NNC PET SHOP<br>
              123 Đường Thú Cưng, Quận 1, TP.HCM<br>
              SĐT: 0999000888
            </div>
            <div style="width: 50%; padding-left: 5px;">
              <b>ĐẾN:</b> ${order.custName}<br>
              ${order.shippingAddress}<br>
              SĐT: ${order.custPhone}
            </div>
          </div>

          <!-- Routing -->
          <div style="text-align: center; font-size: 24px; font-weight: bold; border-bottom: 2px solid #000; padding: 5px 0; background: #f9f9f9;">
            MB-15-04-TN10
          </div>

          <!-- Content -->
          <div style="display: flex; border-bottom: 1px dashed #000; padding: 5px 0; min-height: 100px;">
            <div style="width: 70%; border-right: 1px dashed #000; padding-right: 5px;">
              <p style="margin: 0 0 5px 0; font-size: 9px; font-weight: bold;">NỘI DUNG HÀNG:</p>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
            </div>
            <div style="width: 30%; text-align: center; padding-top: 10px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${order.id}" 
                   style="width: 60px; height: 60px;" 
                   crossorigin="anonymous" />
              <p style="margin: 5px 0 0 0; font-size: 7px;">Mã ĐH: ${order.id}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #000; margin-top: 5px;">
            <div style="width: 60%;">
              <p style="margin: 0; font-size: 8px; color: #666;">TỔNG CỘNG ĐƠN HÀNG:</p>
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${formatCurrency(order.total)}</p>
              
              <p style="margin: 0; font-size: 9px; font-weight: bold; text-transform: uppercase;">TIỀN THU NGƯỜI NHẬN:</p>
              <p style="margin: 0; font-size: 22px; font-weight: 900; color: #ee4d2d;">
                ${order.paymentMethod === 'COD' ? formatCurrency(order.total) : '0 VND'}
              </p>
              <p style="margin: 0; font-size: 10px; font-weight: bold; color: #333;">
                (${order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'ĐÃ THANH TOÁN ONLINE'})
              </p>
            </div>
            <div style="width: 40%; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end;">
              <div style="border: 1px solid #000; width: 100px; height: 60px; text-align: center; font-size: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff;">
                <b style="margin-bottom: 20px;">CHỮ KÝ NGƯỜI NHẬN</b>
                <span style="font-size: 6px;">Xác nhận hàng nguyên vẹn</span>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(printContainer);

      // Chờ ảnh load
      const imgs = printContainer.querySelectorAll('img');
      await Promise.all(Array.from(imgs).map(img => {
        return new Promise((resolve) => {
          if (img.complete) resolve();
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Xuất PDF
      const opt = {
        margin: 0,
        filename: `Hoa_Don_Shopee_${order.id}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a6', orientation: 'portrait' }
      };

      await window.html2pdf().from(printContainer.querySelector('#invoice-content')).set(opt).save();
      
      document.body.removeChild(printContainer);
    } catch (err) {
      console.error(err);
      alert('Lỗi xuất PDF!');
    } finally {
      setLoading(false);
    }
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success'
      case 'SHIPPED': return 'info'
      case 'PAYMENT_EXPECTED': return 'warning'
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
                <CIcon icon={cilBasket} className="header-icon" />
              </div>
              <div>
                <h5 className="premium-header-title mb-0">Order Management</h5>
                <p className="premium-header-subtitle mb-0">Track and manage customer transactions</p>
              </div>
            </div>
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable align="middle" className="mb-0 premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="text-center">Order ID</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Grand Total</CTableHeaderCell>
                  <CTableHeaderCell>Ordered Date</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map((order, index) => (
                  <CTableRow key={index} className="premium-table-row">
                    <CTableDataCell className="text-center fw-bold text-muted">#{order.id}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <div className="avatar-placeholder me-3">
                          <CIcon icon={cilUser} className="text-secondary" />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{order.custName || order.user?.userName}</div>
                          <div className="small text-muted">{order.custPhone}</div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="fw-bold text-primary h6 mb-0">{formatCurrency(order.total)}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="small text-muted">
                        <CIcon icon={cilCalendar} size="sm" className="me-1" />
                        {new Date(order.orderedDate).toLocaleDateString()}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color={getStatusColor(order.status)} className="premium-badge shadow-sm">
                        {order.status.replace('_', ' ')}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <CButton
                          color="info"
                          size="sm"
                          className="action-btn action-view"
                          onClick={() => showDetails(order)}
                        >
                          <CIcon icon={cilInfo} className="me-1" /> Details
                        </CButton>
                        <CButton
                          color="success"
                          size="sm"
                          className="action-btn text-white"
                          onClick={() => handleDownloadPDF(order)}
                          title="Xuất hóa đơn (PDF)"
                        >
                          <CIcon icon={cilCloudDownload} className="me-1" /> Xuất hóa đơn
                        </CButton>
                        <CDropdown variant="btn-group">
                          <CDropdownToggle color="secondary" size="sm" className="premium-btn">Status</CDropdownToggle>
                          <CDropdownMenu className="shadow border-0">
                            <CDropdownItem onClick={() => handleStatusChange(order.id, 'PAYMENT_EXPECTED')}>Payment Expected</CDropdownItem>
                            <CDropdownItem onClick={() => handleStatusChange(order.id, 'SHIPPED')}>Shipped</CDropdownItem>
                            <CDropdownItem onClick={() => handleStatusChange(order.id, 'DELIVERED')}>Delivered</CDropdownItem>
                            <CDropdownItem divider />
                            <CDropdownItem onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="text-danger">Cancelled</CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <style>{`
        .avatar-placeholder {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Order Details #{selectedOrder?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedOrder && (
            <>
              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>Customer Info</h6>
                  <p className="mb-1"><strong>Name:</strong> {selectedOrder.custName}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedOrder.custPhone}</p>
                  <p className="mb-1"><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                </CCol>
                <CCol md={6}>
                  <h6>Shipping & Payment</h6>
                  <p className="mb-1"><strong>Method:</strong> {selectedOrder.shipMethod}</p>
                  <p className="mb-1"><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                  <p className="mb-1"><strong>Note:</strong> {selectedOrder.customerNote || 'None'}</p>
                </CCol>
              </CRow>
              <h6>Order Items</h6>
              <CTable striped borderless align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Product</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Quantity</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedOrder.items.map((item, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{item.product?.productName || 'Unknown Product'}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.quantity}</CTableDataCell>
                      <CTableDataCell className="text-end">${item.subTotal}</CTableDataCell>
                    </CTableRow>
                  ))}
                  <CTableRow>
                    <CTableDataCell colSpan="2" className="text-end fw-bold">Total</CTableDataCell>
                    <CTableDataCell className="text-end fw-bold text-primary">${selectedOrder.total}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="success" className="text-white" onClick={() => handleDownloadPDF(selectedOrder)}>
            <CIcon icon={cilCloudDownload} className="me-1" /> Xuất hóa đơn (PDF)
          </CButton>
          <CButton color="secondary" onClick={() => setVisible(false)}>Đóng</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Orders

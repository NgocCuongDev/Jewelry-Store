import React, { useState, useEffect, useRef } from 'react'
import apiProduct from '../../api/apiProduct'
import axiosServer from '../../api/axiosServer'
import '../../scss/Products.css'
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
  CAvatar,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
  CFormSelect,
  CImage,
  CCallout,
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPencil, cilTrash, cilPlus, cilSearch,
  cilBarcode, cilLayers, cilCheckCircle, cilCalendar,
  cilImage, cilTag, cilDollar, cilSettings, cilInfo, cilCloudDownload
} from '@coreui/icons'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal State
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([])

  const fileInputRef = useRef(null)

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    productName: '',
    description: '',
    category: null,
    price: 0,
    discountPrice: 0,
    availability: 0,
    active: true,
    imageUrl: ''
  })

  const fetchProducts = () => {
    setLoading(true)
    apiProduct.getAllProducts()
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const fetchCategories = () => {
    apiProduct.getAllCategories()
      .then((data) => {
        setCategories(data)
      })
      .catch((err) => console.error("Error fetching categories:", err))
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleNumericChange = (field, value, isInteger = false) => {
    // If input is empty, set to 0
    if (value === '') {
      setCurrentProduct({ ...currentProduct, [field]: 0 })
      return
    }

    // Parse the value
    const numValue = isInteger ? parseInt(value, 10) : parseFloat(value)
    
    // Update state with the parsed number
    // This will automatically handle cases like "0123" -> 123
    setCurrentProduct({ ...currentProduct, [field]: isNaN(numValue) ? 0 : numValue })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      apiProduct.deleteProduct(id)
        .then(() => {
          fetchProducts()
        })
        .catch((err) => alert('Delete failed: ' + err.message))
    }
  }

  const handleEdit = (product) => {
    setCurrentProduct(product)
    setEditMode(true)
    setViewMode(false)
    setActiveTab(1)
    setSelectedFile(null)
    setImagePreview(product.imageUrl ? (
      product.imageUrl.startsWith('http')
        ? product.imageUrl
        : `${axiosServer.defaults.IMAGE_URL}${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}`
    ) : null)
    setVisible(true)
  }

  const handleAdd = () => {
    setCurrentProduct({
      id: null,
      productName: '',
      description: '',
      category: null,
      price: 0,
      discountPrice: 0,
      availability: 0,
      active: true,
      imageUrl: ''
    })
    setEditMode(false)
    setViewMode(false)
    setActiveTab(1)
    setSelectedFile(null)
    setImagePreview(null)
    setVisible(true)
  }

  const handleView = (product) => {
    setCurrentProduct(product)
    setEditMode(false)
    setViewMode(true)
    setVisible(true)
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
    setCurrentProduct(prev => ({ ...prev, imageUrl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExportExcel = () => {
    if (products.length === 0) {
      alert('Không có dữ liệu để xuất!')
      return
    }

    // CSV Headers
    const headers = ['ID', 'Tên sản phẩm', 'Danh mục', 'Giá gốc (VND)', 'Giá giảm (VND)', 'Số lượng tồn', 'Trạng thái', 'Mô tả']
    
    // Format rows
    const csvRows = products.map(p => [
      p.id,
      `"${p.productName.replace(/"/g, '""')}"`,
      `"${(p.category?.categoryName || '').replace(/"/g, '""')}"`,
      p.price,
      p.discountPrice || 0,
      p.availability,
      p.active ? 'Đang bán' : 'Ngừng bán',
      `"${(p.description || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""')}"`
    ])

    // Combine headers and rows with BOM for UTF-8 support in Excel
    const csvContent = "\ufeff" + [headers, ...csvRows].map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Danh_sach_san_pham_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageUrl = currentProduct.imageUrl

    if (selectedFile) {
      try {
        const uploadRes = await apiProduct.uploadImage(selectedFile)
        imageUrl = uploadRes.imageUrl
      } catch (err) {
        alert('Image upload failed: ' + err.message)
        return
      }
    }

    const productToSave = { ...currentProduct, imageUrl }

    const action = editMode
      ? apiProduct.updateProduct(currentProduct.id, productToSave)
      : apiProduct.addProduct(productToSave)

    action
      .then(() => {
        setVisible(false)
        setSelectedFile(null)
        setImagePreview(null)
        fetchProducts()
      })
      .catch((err) => alert('Save failed: ' + err.message))
  }

  if (loading) {
    return (
      <div className="pt-3 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <CCard className="mb-4">
        <CCardBody className="text-danger">Error: {error}</CCardBody>
      </CCard>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 product-premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper">
                <CIcon icon={cilLayers} className="header-icon" />
              </div>
              <div>
                <strong className="premium-header-title">Product Management</strong>
                <p className="premium-header-subtitle mb-0">Manage your inventory and products</p>
              </div>
            </div>
            <div class="d-flex gap-2">
              <CButton color="success" size="sm" onClick={handleExportExcel} className="premium-export-btn text-white">
                <CIcon icon={cilCloudDownload} className="me-2" />
                Xuất Excel
              </CButton>
              <CButton color="primary" size="sm" onClick={handleAdd} className="premium-add-btn">
                <CIcon icon={cilPlus} className="me-2" />
                Add Product
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border premium-table" hover responsive>
              <CTableHead className="text-nowrap">
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="bg-body-tertiary text-center">ID</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Product</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Category</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Price</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Stock</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products.map((item, index) => (
                  <CTableRow key={index} className="premium-table-row">
                    <CTableDataCell className="text-center fw-semibold">#{item.id}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CAvatar
                          size="md"
                          src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${axiosServer.defaults.IMAGE_URL}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`) : '/placeholder-product.png'}
                          className="me-3 premium-avatar"
                        />
                        <div>
                          <div className="fw-semibold product-name">{item.productName}</div>
                          <div className="small text-body-secondary text-truncate" style={{ maxWidth: '200px' }}>
                            {item.description?.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="secondary-gradient" className="category-badge">
                        {item.category?.categoryName || 'No Category'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.discountPrice ? (
                        <div>
                          <span className="text-danger fw-bold">{formatCurrency(item.discountPrice)}</span>
                          <br />
                          <span className="text-decoration-line-through small text-body-secondary">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="fw-semibold">{formatCurrency(item.price)}</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge
                        color={item.availability > 50 ? 'success' : item.availability > 10 ? 'warning' : 'danger'}
                        className="stock-badge"
                      >
                        {item.availability} units
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge
                        color={item.active ? 'success' : 'secondary'}
                        className="status-badge"
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center text-nowrap">
                      <CButton
                        color="warning"
                        size="sm"
                        className="me-2 action-btn action-view"
                        onClick={() => handleView(item)}
                      >
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-2 action-btn action-edit"
                        onClick={() => handleEdit(item)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
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

      {/* Premium Product Modal */}
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        size="xl"
        alignment="center"
        className="product-premium-modal"
      >
        <CModalHeader className="border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="premium-icon-wrapper">
              <CIcon
                icon={viewMode ? cilSearch : (editMode ? cilPencil : cilPlus)}
                className="premium-modal-icon"
              />
            </div>
            <div className="flex-grow-1">
              <CModalTitle className="premium-modal-title">
                {viewMode ? 'Product Details' : (editMode ? 'Edit Product' : 'Create New Product')}
              </CModalTitle>
              <p className="premium-modal-subtitle mb-0">
                {viewMode
                  ? 'Complete product information and specifications'
                  : (editMode ? 'Update product information' : 'Add a new product to your inventory')}
              </p>
            </div>
            {imagePreview && !viewMode && (
              <div className="header-image-preview">
                <img src={imagePreview} alt="Preview" className="header-preview-img" />
              </div>
            )}
          </div>
        </CModalHeader>

        {viewMode ? (
          // VIEW MODE - Premium Display
          <>
            <CModalBody className="p-4">
              <CRow className="g-4">
                <CCol md={5}>
                  <div className="product-image-gallery">
                    <div className="main-image-container">
                      <CImage
                        src={currentProduct.imageUrl ? (currentProduct.imageUrl.startsWith('http') ? currentProduct.imageUrl : `${axiosServer.defaults.IMAGE_URL}${currentProduct.imageUrl.startsWith('/') ? '' : '/'}${currentProduct.imageUrl}`) : '/placeholder-product.png'}
                        fluid
                        className="main-product-image"
                      />
                      {currentProduct.discountPrice && (
                        <div className="discount-badge">
                          -{Math.round(((currentProduct.price - currentProduct.discountPrice) / currentProduct.price) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <CBadge
                        color={currentProduct.active ? 'success' : 'danger'}
                        className="status-pill"
                      >
                        {currentProduct.active ? '✓ Available for Customers' : '✗ Currently Hidden'}
                      </CBadge>
                    </div>
                  </div>
                </CCol>

                <CCol md={7}>
                  <div className="product-info-details">
                    <div className="category-tag mb-2">
                      <CIcon icon={cilLayers} className="me-1" /> {currentProduct.category?.categoryName || 'No Category'}
                    </div>
                    <h2 className="product-title mb-3">{currentProduct.productName}</h2>

                    <div className="price-section mb-4">
                      <div className="current-price">
                        {formatCurrency(currentProduct.discountPrice || currentProduct.price)}
                      </div>
                      {currentProduct.discountPrice && (
                        <div className="original-price">
                          <span className="text-decoration-line-through">{formatCurrency(currentProduct.price)}</span>
                          <span className="saving-badge ms-2">
                            Save {formatCurrency(currentProduct.price - currentProduct.discountPrice)}
                          </span>
                        </div>
                      )}
                    </div>

                    <CCallout color="info" className="description-callout">
                      <div className="callout-header">
                        <CIcon icon={cilInfo} className="me-2" />
                        <strong>Product Description</strong>
                      </div>
                      <div className="callout-content mt-2">
                        {currentProduct.description || 'No description provided for this product.'}
                      </div>
                    </CCallout>

                    <CListGroup flush className="info-list mt-4">
                      <CListGroupItem className="info-list-item">
                        <div className="info-label">
                          <CIcon icon={cilBarcode} className="me-2" />
                          Product ID
                        </div>
                        <div className="info-value">#{currentProduct.id}</div>
                      </CListGroupItem>
                      <CListGroupItem className="info-list-item">
                        <div className="info-label">
                          <CIcon icon={cilCheckCircle} className="me-2" />
                          Stock Status
                        </div>
                        <div className="info-value">
                          <CBadge
                            color={currentProduct.availability > 50 ? 'success' : currentProduct.availability > 10 ? 'warning' : 'danger'}
                          >
                            {currentProduct.availability > 0
                              ? `${currentProduct.availability} units available`
                              : 'Out of stock'}
                          </CBadge>
                        </div>
                      </CListGroupItem>
                      <CListGroupItem className="info-list-item">
                        <div className="info-label">
                          <CIcon icon={cilCalendar} className="me-2" />
                          Last Updated
                        </div>
                        <div className="info-value">{currentProduct.updatedAt || 'N/A'}</div>
                      </CListGroupItem>
                    </CListGroup>
                  </div>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="border-0 px-4 pb-4">
              <CButton
                color="primary"
                className="premium-close-btn"
                onClick={() => setVisible(false)}
              >
                Close
              </CButton>
            </CModalFooter>
          </>
        ) : (
          // EDIT/ADD MODE with Tabs
          <>
            <CNav variant="tabs" className="px-4 premium-tabs" layout="justified">
              <CNavItem>
                <CNavLink
                  active={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                  className="premium-tab-link"
                >
                  <CIcon icon={cilTag} className="me-2" />
                  Basic Info
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                  className="premium-tab-link"
                >
                  <CIcon icon={cilDollar} className="me-2" />
                  Pricing & Stock
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                  className="premium-tab-link"
                >
                  <CIcon icon={cilImage} className="me-2" />
                  Media
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 4}
                  onClick={() => setActiveTab(4)}
                  className="premium-tab-link"
                >
                  <CIcon icon={cilSettings} className="me-2" />
                  Settings
                </CNavLink>
              </CNavItem>
            </CNav>

            <CForm onSubmit={handleSubmit}>
              <CModalBody className="px-4 py-4">
                <CTabContent>
                  {/* Tab 1: Basic Information */}
                  <CTabPane visible={activeTab === 1}>
                    <div className="form-section">
                      <CRow className="g-4">
                        <CCol md={12}>
                          <div className="form-floating-wrapper">
                            <CFormInput
                              id="productName"
                              value={currentProduct.productName}
                              onChange={(e) => setCurrentProduct({ ...currentProduct, productName: e.target.value })}
                              required
                              className="premium-input"
                              placeholder=" "
                            />
                            <CFormLabel htmlFor="productName" className="premium-label">
                              Product Name <span className="text-danger">*</span>
                            </CFormLabel>
                            <div className="input-focus-border"></div>
                          </div>
                        </CCol>
                        <CCol md={12}>
                          <div className="form-floating-wrapper">
                            <CFormSelect
                              id="category"
                              value={currentProduct.category?.id || ''}
                              onChange={(e) => {
                                const categoryId = parseInt(e.target.value)
                                const selectedCat = categories.find(cat => cat.id === categoryId)
                                setCurrentProduct({ ...currentProduct, category: selectedCat })
                              }}
                              required
                              className="premium-select"
                            >
                              <option value="">Select Category</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.categoryName}
                                </option>
                              ))}
                            </CFormSelect>
                            <CFormLabel htmlFor="category" className="premium-label">
                              Category <span className="text-danger">*</span>
                            </CFormLabel>
                            <div className="input-focus-border"></div>
                          </div>
                        </CCol>
                        <CCol md={12}>
                          <div className="form-floating-wrapper textarea-wrapper">
                            <CFormTextarea
                              id="description"
                              rows={4}
                              value={currentProduct.description}
                              onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                              className="premium-textarea"
                              placeholder=" "
                            />
                            <CFormLabel htmlFor="description" className="premium-label">
                              Description
                            </CFormLabel>
                            <div className="input-focus-border"></div>
                            <small className="form-hint">Detailed product description for customers</small>
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                  </CTabPane>

                  {/* Tab 2: Pricing & Stock */}
                  <CTabPane visible={activeTab === 2}>
                    <div className="form-section">
                      <CRow className="g-4">
                        <CCol md={6}>
                          <div className="form-floating-wrapper">
                            <CFormInput
                              type="number"
                              id="price"
                              value={currentProduct.price === 0 && !editMode ? '' : currentProduct.price}
                              onChange={(e) => handleNumericChange('price', e.target.value)}
                              onFocus={(e) => { if (currentProduct.price === 0) handleNumericChange('price', '') }}
                              onBlur={(e) => { if (e.target.value === '') handleNumericChange('price', '0') }}
                              required
                              className="premium-input"
                              placeholder="0"
                            />
                            <CFormLabel htmlFor="price" className="premium-label">
                              Regular Price (VND) <span className="text-danger">*</span>
                            </CFormLabel>
                            <div className="input-focus-border"></div>
                            <small className="form-hint">Original product price</small>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="form-floating-wrapper">
                            <CFormInput
                              type="number"
                              id="discountPrice"
                              value={currentProduct.discountPrice === 0 ? '' : currentProduct.discountPrice}
                              onChange={(e) => handleNumericChange('discountPrice', e.target.value)}
                              onFocus={(e) => { if (currentProduct.discountPrice === 0) handleNumericChange('discountPrice', '') }}
                              onBlur={(e) => { if (e.target.value === '') handleNumericChange('discountPrice', '0') }}
                              className="premium-input"
                              placeholder="0"
                            />
                            <CFormLabel htmlFor="discountPrice" className="premium-label">
                              Discount Price (VND)
                            </CFormLabel>
                            <div className="input-focus-border"></div>
                            <small className="form-hint">Leave empty if no discount</small>
                          </div>
                        </CCol>
                        <CCol md={12}>
                          <div className="form-floating-wrapper">
                            <CFormInput
                              type="number"
                              id="availability"
                              value={currentProduct.availability === 0 ? '' : currentProduct.availability}
                              onChange={(e) => handleNumericChange('availability', e.target.value, true)}
                              onFocus={(e) => { if (currentProduct.availability === 0) handleNumericChange('availability', '') }}
                              onBlur={(e) => { if (e.target.value === '') handleNumericChange('availability', '0') }}
                              required
                              className="premium-input"
                              placeholder="0"
                            />
                            <CFormLabel htmlFor="availability" className="premium-label">
                              Stock Quantity <span className="text-danger">*</span>
                            </CFormLabel>
                            <div className="input-focus-border"></div>
                            <small className="form-hint">Number of items available in inventory</small>
                          </div>
                        </CCol>
                      </CRow>

                      {/* Price Preview */}
                      {currentProduct.price > 0 && (
                        <div className="price-preview-card mt-4">
                          <div className="price-preview-title">Price Preview</div>
                          <div className="price-preview-value">
                            {currentProduct.discountPrice > 0 ? (
                              <>
                                <span className="discount-price">{formatCurrency(currentProduct.discountPrice)}</span>
                                <span className="original-price-preview">{formatCurrency(currentProduct.price)}</span>
                                <span className="savings">
                                  Save {formatCurrency(currentProduct.price - currentProduct.discountPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="regular-price">{formatCurrency(currentProduct.price)}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CTabPane>

                  {/* Tab 3: Media - Premium Upload */}
                  <CTabPane visible={activeTab === 3}>
                    <div className="form-section">
                      <div className="media-upload-container">
                        <div className="image-preview-large">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Product preview"
                              className="preview-large-img"
                            />
                          ) : (
                            <div className="preview-placeholder">
                              <CIcon icon={cilImage} className="placeholder-icon" />
                              <span>No image selected</span>
                            </div>
                          )}
                        </div>

                        <div className="upload-controls">
                          <label htmlFor="product-image" className="upload-primary-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            {selectedFile ? 'Change Image' : 'Upload Product Image'}
                          </label>
                          <CFormInput
                            type="file"
                            id="product-image"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            className="d-none"
                          />
                          {(selectedFile || currentProduct.imageUrl) && (
                            <CButton
                              color="danger"
                              variant="outline"
                              onClick={handleRemoveImage}
                              className="remove-media-btn"
                            >
                              Remove
                            </CButton>
                          )}
                          <div className="upload-guidelines">
                            <p className="mb-1">📷 Image Guidelines:</p>
                            <ul className="small text-body-secondary mb-0">
                              <li>Recommended: 800x800px or higher</li>
                              <li>Formats: JPG, PNG, WEBP</li>
                              <li>Max file size: 5MB</li>
                              <li>Square images work best</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CTabPane>

                  {/* Tab 4: Settings */}
                  <CTabPane visible={activeTab === 4}>
                    <div className="form-section">
                      <div className="settings-card">
                        <div className="settings-item">
                          <div className="settings-info">
                            <div className="settings-label">Product Visibility</div>
                            <div className="settings-description">
                              {currentProduct.active
                                ? 'Product is visible to customers and can be purchased'
                                : 'Product is hidden from storefront'}
                            </div>
                          </div>
                          <label className="premium-switch">
                            <input
                              type="checkbox"
                              checked={currentProduct.active}
                              onChange={(e) => setCurrentProduct({ ...currentProduct, active: e.target.checked })}
                            />
                            <span className="switch-slider"></span>
                          </label>
                        </div>

                        {currentProduct.id && (
                          <div className="settings-meta mt-4 pt-3 border-top">
                            <div className="meta-item">
                              <span className="meta-label">Created:</span>
                              <span className="meta-value">{currentProduct.createdAt || 'N/A'}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Last Modified:</span>
                              <span className="meta-value">{currentProduct.updatedAt || 'N/A'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CModalBody>

              <CModalFooter className="border-0 px-4 pb-4">
                <div className="d-flex gap-3 w-100">
                  <CButton
                    color="secondary"
                    variant="ghost"
                    onClick={() => setVisible(false)}
                    className="premium-cancel-btn flex-grow-1"
                  >
                    Cancel
                  </CButton>
                  <CButton
                    color="primary"
                    type="submit"
                    className="premium-submit-btn flex-grow-1"
                  >
                    {editMode ? 'Update Product' : 'Create Product'}
                  </CButton>
                </div>
              </CModalFooter>
            </CForm>
          </>
        )}
      </CModal>
    </CRow>
  )
}

export default Products
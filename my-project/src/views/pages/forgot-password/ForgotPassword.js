import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CCallout,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilLockLocked, cilCheckCircle, cilArrowLeft } from '@coreui/icons'
import apiAuth from '../../../api/apiAuth'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  
  const navigate = useNavigate()

  const getErrorMsg = (err) => {
    const data = err.response?.data
    if (typeof data === 'string') return data
    if (data?.message && typeof data.message === 'string') return data.message
    if (data?.error && typeof data.error === 'string') return data.error
    return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiAuth.forgotPassword(email)
      setStep(2)
      setSuccessMsg(`Mã xác thực đã được gửi tới ${email}. Vui lòng kiểm tra hộp thư của bạn.`)
    } catch (err) {
      setError(getErrorMsg(err))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiAuth.verifyResetCode(email, code)
      setStep(3)
      setError('')
    } catch (err) {
      setError(getErrorMsg(err))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await apiAuth.resetPassword(email, code, newPassword)
      setStep(4)
    } catch (err) {
      setError(getErrorMsg(err))
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CForm onSubmit={handleSendCode}>
            <h1 className="premium-text-gradient mb-3">Quên mật khẩu?</h1>
            <p className="text-body-secondary mb-4">
              Nhập email liên kết với tài khoản của bạn để nhận mã khôi phục.
            </p>
            {error && <CCallout color="danger" className="py-2">{error}</CCallout>}
            <CInputGroup className="mb-4 premium-input-group">
              <CInputGroupText className="bg-transparent border-end-0">
                <CIcon icon={cilEnvelopeClosed} />
              </CInputGroupText>
              <CFormInput
                type="email"
                placeholder="Địa chỉ Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-start-0 ps-0"
              />
            </CInputGroup>
            <div className="d-grid">
              <CButton color="primary" className="premium-btn py-2" type="submit" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Gửi mã xác nhận'}
              </CButton>
            </div>
          </CForm>
        )
      case 2:
        return (
          <CForm onSubmit={handleVerifyCode}>
            <h1 className="premium-text-gradient mb-3">Xác thực mã</h1>
            <p className="text-body-secondary mb-4">
              {successMsg}
            </p>
            {error && <CCallout color="danger" className="py-2">{error}</CCallout>}
            <CInputGroup className="mb-4 premium-input-group">
              <CInputGroupText className="bg-transparent border-end-0">
                <CIcon icon={cilCheckCircle} />
              </CInputGroupText>
              <CFormInput
                placeholder="Mã xác thực 6 số"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="border-start-0 ps-0 text-center fw-bold"
                style={{ letterSpacing: '8px' }}
                maxLength={6}
              />
            </CInputGroup>
            <div className="d-grid gap-2">
              <CButton color="primary" className="premium-btn py-2" type="submit" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Xác nhận mã'}
              </CButton>
              <CButton variant="ghost" color="secondary" onClick={() => setStep(1)}>
                Quay lại
              </CButton>
            </div>
          </CForm>
        )
      case 3:
        return (
          <CForm onSubmit={handleResetPassword}>
            <h1 className="premium-text-gradient mb-3">Mật khẩu mới</h1>
            <p className="text-body-secondary mb-4">
              Thiết lập mật khẩu mới cho tài khoản của bạn.
            </p>
            {error && <CCallout color="danger" className="py-2">{error}</CCallout>}
            <CInputGroup className="mb-3 premium-input-group">
              <CInputGroupText className="bg-transparent border-end-0">
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border-start-0 ps-0"
              />
            </CInputGroup>
            <CInputGroup className="mb-4 premium-input-group">
              <CInputGroupText className="bg-transparent border-end-0">
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-start-0 ps-0"
              />
            </CInputGroup>
            <div className="d-grid">
              <CButton color="primary" className="premium-btn py-2" type="submit" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Đổi mật khẩu'}
              </CButton>
            </div>
          </CForm>
        )
      case 4:
        return (
          <div className="text-center py-4">
            <div className="mb-4">
              <CIcon icon={cilCheckCircle} className="text-success" size="3xl" />
            </div>
            <h1 className="premium-text-gradient mb-3">Thành công!</h1>
            <p className="text-body-secondary mb-4">
              Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <div className="d-grid">
              <CButton color="primary" className="premium-btn py-2" onClick={() => navigate('/login')}>
                Quay lại Đăng nhập
              </CButton>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center premium-bg-pattern">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={5} xl={4}>
            <CCard className="premium-card p-2 shadow-lg border-0 bg-white bg-opacity-75 backdrop-blur">
              <CCardBody className="p-4 p-md-5">
                <div className="mb-4">
                  <Link to="/login" className="text-decoration-none text-secondary d-flex align-items-center">
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    <small>Quay lại Đăng nhập</small>
                  </Link>
                </div>
                
                {renderStep()}

              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      
      <style>{`
        .premium-bg-pattern {
          background-image: radial-gradient(#3c4b64 0.5px, transparent 0.5px);
          background-size: 20px 20px;
        }
        .premium-text-gradient {
          background: linear-gradient(45deg, #3c4b64, #1a2537);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        .premium-card {
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .backdrop-blur {
          backdrop-filter: blur(10px);
        }
        .premium-input-group {
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #ebedef;
          transition: all 0.3s ease;
        }
        .premium-input-group:focus-within {
          box-shadow: 0 4px 15px rgba(60, 75, 100, 0.1);
          border-color: #3c4b64;
        }
        .premium-btn {
          border-radius: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(60, 75, 100, 0.2);
          transition: all 0.3s ease;
        }
        .premium-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(60, 75, 100, 0.3);
        }
      `}</style>
    </div>
  )
}

export default ForgotPassword

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, PawPrint, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { CATALOG_IMAGE_URL } from "../../app/config";
import "./chatbot.css";

const Chatbot = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Chào bạn! Tôi là trợ lý ảo của Jewelry Store. Tôi có thể giúp gì cho bạn và thú cưng hôm nay? 🐾" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Tìm trang sức",
    "Xem giỏ hàng 🛒",
    "Đơn hàng của tôi 📦",
    "Khuyến mãi HOT 🔥"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    const messageToSend = text.trim();
    if (!messageToSend) return;

    const userMessage = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, history: messages }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, {
          role: "ai",
          content: data.reply,
          products: data.products // Lưu danh sách sản phẩm vào message
        }]);

        // Xử lý lệnh từ AI
        if (data.command && data.command.destination) {
          const { destination, productId } = data.command;
          console.log("🚀 AI Command: Navigate to", destination);

          setTimeout(() => {
            switch (destination) {
              case "cart": router.push("/gio-hang"); break;
              case "profile": router.push("/profile"); break;
              case "orders": router.push("/don-hang"); break;
              case "home": router.push("/"); break;
              case "products":
                if (productId) router.push(`/chi-tiet-san-pham/${productId}`);
                else router.push("/products");
                break;
            }
          }, 2000); // Chờ 2s để người dùng đọc thông báo trước khi chuyển trang
        }
      } else {
        setMessages((prev) => [...prev, { role: "ai", content: data.reply || "Xin lỗi, tôi gặp chút trục thực. Thử lại sau nhé! 😅" }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Hệ thống đang bận, bạn đợi tôi một chút nhé!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Nút bấm Chat */}
      <motion.div
        className="chatbot-bubble"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <PawPrint size={28} />}
        {!isOpen && <div className="notification-dot" />}
      </motion.div>

      {/* Cửa sổ Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="ai-avatar">
                <Sparkles size={24} color="#fff" />
              </div>
              <div className="ai-info">
                <h3>NNC Assistant</h3>
                <p>Đang trực tuyến • Sẵn sàng hỗ trợ</p>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className="message-wrapper">
                  <div className={`message ${msg.role}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Render Product Cards if exist */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="product-cards-container">
                      {msg.products.map((p) => {
                        const cleanImageUrl = p.imageUrl ? (p.imageUrl.startsWith("images/") ? p.imageUrl.replace("images/", "") : p.imageUrl) : "";
                        const finalImageUrl = cleanImageUrl 
                          ? (cleanImageUrl.startsWith("http") ? cleanImageUrl : CATALOG_IMAGE_URL + cleanImageUrl.replace(/^\/+/, ""))
                          : CATALOG_IMAGE_URL + "no-image.png";

                        return (
                          <div
                            key={p.id}
                            className="chatbot-product-card"
                            onClick={() => router.push(`/chi-tiet-san-pham/${p.id}`)}
                          >
                            <div className="product-card-image">
                              <img src={finalImageUrl} alt={p.productName} />
                            </div>
                            <div className="product-card-info">
                              <h4>{p.productName}</h4>
                              <p className="price">{Number(p.price).toLocaleString()} VND</p>
                              <p className="status">{p.availability > 0 ? "✅ Còn hàng" : "❌ Hết hàng"}</p>
                            </div>
                            <button className="view-detail-btn">Xem chi tiết</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="message ai typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {!isTyping && messages.length < 3 && (
              <div className="chatbot-suggestions">
                {suggestions.map((s, idx) => (
                  <button key={idx} onClick={() => handleSend(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chatbot-input-area">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={() => handleSend()}>
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;

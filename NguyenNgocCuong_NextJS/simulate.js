async function testDelete() {
  try {
    const res = await fetch('http://localhost:8900/api/shop/cart?productId=1', {
      method: 'DELETE',
      headers: { "Cart-Id": "cuongnguyenphuquy27082005@gmail.com", "Authorization": "Bearer test" }
    });
    const data = await res.text();
    console.log("SUCCESS HTTP STATUS:", res.status, data);
  } catch (err) {
    console.log("FAIL:", err.message);
  }
}

testDelete();

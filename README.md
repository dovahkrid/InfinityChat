# InfinityChat

Chú thích một số folder/file cần để ý:
- **auth/passportAuth.js**: hỗ trợ authentication khi đăng nhập Facebook
- **config**: một "switch" để chuyển giữa development mode và production mode (production mode sẽ phải sử dụng URL thật, development mode chỉ cần localhost)
- **node_modules**: chứa các thư viện ngoài thêm vào
- **public**: chứa ảnh và css giao diện
- **routes/routes.js**: định hướng "đường đi" của URL
- **socket/socket.js**: liên lạc với server về thông tin room, thêm/sửa/xóa room và update list người dùng trong 1 room
- **views**: chứa các file HTML của từng trang
- **app.js**: gọi thư viện và triển khai ứng dụng

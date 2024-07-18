//tạo 1 trang thông báo xác thực tài khoản

const html = (name, code) => {
  return `
    <html lang="en">
      <head>
        <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đăng ký tài khoản thành công</title>
            <!-- Bộ CSS Bootstrap -->
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
              <!-- CSS tùy chỉnh -->
              <style>
    /* Thêm CSS tùy chỉnh nếu cần */
              </style>
            </head>
            <body>
              <div class="container mt-5">
                <div class="alert alert-success" role="alert">
                  <h4 class="alert-heading">Chúc mừng!</h4>
                  <p>Tài khoản của bạn đã được đăng ký thành công với tên người dùng là <strong>${name}</strong>.</p>
                  <p class="mb-0">Mã code xác thực của bạn là <strong>${code}</strong>. Hãy sử dụng mã này để xác thực tài khoản của bạn.</p>
                  <p>Mã có hiệu lực trong vòng 60s. Vui lòng nhập mã trong khoảng thời gian quy định.</p>
                </div>
              </div>
            </body>
          </html>
`
}

module.exports = { html }
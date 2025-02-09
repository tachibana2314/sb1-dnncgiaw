export const getConfirmationEmailTemplate = (name: string) => ({
  subject: '申し込みを受け付けました',
  text: `${name} 様

お申し込みありがとうございます。
内容を確認の上、担当者より連絡させていただきます。

※このメールは自動送信されています。
`,
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #dddddd;
      font-size: 12px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>${name} 様</p>
    <p>お申し込みありがとうございます。</p>
    <p>内容を確認の上、担当者より連絡させていただきます。</p>
    <div class="footer">
      <p>※このメールは自動送信されています。</p>
    </div>
  </div>
</body>
</html>
`
}); 
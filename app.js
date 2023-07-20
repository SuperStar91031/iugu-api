const QRCode = require('qrcode')
const iugu = require('iugu')('YOUR_IUGU_API_KEY')

// Use Iugu's API to create a new invoice for the buyer
const createInvoice = async () => {
  const invoice = await iugu.invoices.create({
    email: 'buyer-email@example.com',
    due_date: new Date(),
    items: [
      {
        description: 'Product',
        quantity: 1,
        price_cents: 30000
      }
    ]
  })

  console.log(invoice);
  
  return invoice
}

// Generate a QR code for the invoice URL and return it as a data uri
const generateQRCode = async (url) => {
  const opts = {
    errorCorrectionLevel: 'M',
    margin: 1,
    scale: 10
  }
  
  const dataUrl = await QRCode.toDataURL(url, opts)
  
  return dataUrl
}

// Send the QR code to the buyer
const sendQRCode = async (dataUrl) => {
  // Code to send the QR code to the buyer (e.g. using nodemailer or other methods)
}

// Connect to Iugu's webhook API and listen for payment events
const startWebhookServer = async () => {
  iugu.setApiKey('YOUR_IUGU_API_KEY')
  
  const server = require('http').createServer((req, res) => {
    if (req.url === '/iugu-webhook') {
      let body = ''
      
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      
      req.on('end', () => {
        const event = JSON.parse(body)
        
        if (event.event === 'invoice.status_changed' && event.data.status === 'paid') {
          // Code to trigger when payment is received
        }
        
        res.writeHead(200)
        res.end('OK')
      })
    } else {
      res.writeHead(404)
      res.end()
    }  
  })

  server.listen(3000)
}

// Main function that creates the invoice, generates the QR code and sends it to the buyer
const main = async () => {
  const invoice = await createInvoice()
  if (typeof invoice.secure_url === 'string') { // Added check for string type
    const dataUrl = await generateQRCode(invoice.secure_url)
    await sendQRCode(dataUrl)
    await startWebhookServer()
  } else {
    console.log('Unable to generate QR code: invoice URL is not a string.')
  }
}

main()

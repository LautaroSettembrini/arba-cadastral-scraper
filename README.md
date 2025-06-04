# ARBA Cadastral Scraper (Demo Version)

This Node.js microservice automates the retrieval of property information from the public cadastral system (ARBA) and sends the results via email.

🚨 **This is a demo version meant for portfolio purposes only. It contains no real credentials and is not intended for production use.**

---

## Features

- Headless browser automation using Puppeteer  
- Web scraping of public property data from ARBA  
- HTML-formatted email with structured results and image branding  
- Email delivery via SMTP (e.g. Brevo)

---

## 📦 Technologies Used

- **Node.js** + **Express.js**
- **Puppeteer** for headless browser automation
- **Nodemailer** for email delivery
- **dotenv** for environment variable management
- **helmet**, **morgan**, **cors** for enhanced security and logging

---

## Setup

```bash
git clone https://github.com/yourusername/arba-service-demo.git
cd arba-service-demo
npm install
```

Create a `.env` file based on `.env.example`.

---

## Run

```bash
node src/app.js
```

The service will start on `http://localhost:3000` (or the port specified in your `.env` file).

---

## Endpoints

### `POST /consulta`

**Body:**

```json
{
  "partido": "093",
  "partida": "123456",
  "correo": "user@example.com"
}
```

---

## 🐳 Docker Support

This demo includes a `Dockerfile` for containerized deployment.

### Build the image

```bash
docker build -t arba-service-demo .
```

### Run the container

```bash
docker run -p 3000:80 --env-file .env arba-service-demo
```

By default, it listens on port `3000` (host) mapped to `80` inside the container.

> ⚠️ Make sure to create a `.env` file first (you can use `.env.example` as a template).


## License

All rights reserved.  
This code is published for **demonstration purposes only** and may **not be reused, redistributed, or modified** for commercial use or production deployments.
require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Environment variables
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  TO_EMAIL,
  ARBA_URL,
  ARBA_LEYENDA_URL,
  HEADER_LOGO_URL,
  PROPERTY_IMAGE_URL
} = process.env;

app.post('/consulta', async (req, res) => {
  const { partida, partido, correo } = req.body;
  if (!partida || !partido || !correo) return res.status(400).send('Missing fields');

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(ARBA_URL);
    await page.waitForSelector('iframe');
    const iframe = await page.$('iframe');
    const frame = await iframe.contentFrame();
    await frame.waitForSelector('#formConsultaPartida\:partido');
    await frame.type('#formConsultaPartida\:partido', partido);
    await frame.type('#formConsultaPartida\:partida', partida);
    await frame.click('#formConsultaPartida\:btnBuscar');
    await frame.waitForSelector('#formConsultaPartida\:tablaResultados_data > tr');

    const rows = await frame.$$('#formConsultaPartida\:tablaResultados_data > tr');
    const data = [];

    for (const row of rows) {
      const cells = await row.$$('td');
      const texts = await Promise.all(cells.map(cell => cell.evaluate(el => el.innerText.trim())));
      data.push({
        domicilio: texts[0],
        nomenclatura: texts[1],
        valuacion: texts[2],
        destino: texts[3],
        link: ARBA_LEYENDA_URL
      });
    }

    await browser.close();

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const htmlBody = `
      <img src="${HEADER_LOGO_URL}" alt="Header" />
      <h2>Resultado de consulta ARBA</h2>
      <p>Partido: ${partido} - Partida: ${partida}</p>
      ${data.map(entry => `
        <div>
          <p><strong>Domicilio:</strong> ${entry.domicilio}</p>
          <p><strong>Nomenclatura:</strong> ${entry.nomenclatura}</p>
          <p><strong>Valuación:</strong> ${entry.valuacion}</p>
          <p><strong>Destino:</strong> ${entry.destino}</p>
          <p><a href="${entry.link}">Ver deuda</a></p>
          <img src="${PROPERTY_IMAGE_URL}" width="300"/>
        </div>
        <hr />
      `).join('')}
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: correo || TO_EMAIL,
      subject: 'Consulta ARBA',
      html: htmlBody
    });

    res.status(200).json({ message: 'Consulta enviada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import ejs from 'ejs';
import { join } from 'path';
import puppeteer from 'puppeteer';

/**
 * Genera un PDF a partir de una plantilla EJS y datos proporcionados.
 * @param {string} reportName - Nombre del archivo EJS (sin extensión).
 * @param {Object} data - Datos a renderizar en la plantilla.
 * @returns {Promise<Buffer>} - Devuelve un buffer con el contenido del PDF.
 */
const generateReport = async (reportName, data) => {
    try {
        // Validación de entradas
        if (!reportName || typeof reportName !== 'string') {
            throw new Error('El nombre del reporte es inválido.');
        }
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos proporcionados son inválidos.');
        }

        // Define la ruta de la plantilla EJS
        const templatePath = join(process.cwd(), 'src/templates', `${reportName}.ejs`);

        // Renderizar el HTML desde la plantilla EJS con los datos
        let html;
        try {
            html = await ejs.renderFile(templatePath, data);
        } catch (error) {
            console.error('Error al renderizar la plantilla EJS:', error);
            throw new Error('Error al procesar la plantilla EJS.');
        }

        // Inicializar Puppeteer
        let browser;
        try {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'], // Requerido en entornos como Railway
                headless: true,
            });
            const page = await browser.newPage();

            // Cargar el contenido HTML en Puppeteer
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Generar el PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm',
                },
            });

            // Cerrar Puppeteer y devolver el buffer
            await browser.close();
            return pdfBuffer;
        } catch (error) {
            console.error('Error al generar el PDF con Puppeteer:', error);
            if (browser) await browser.close();
            throw new Error('Error al generar el PDF.');
        }
    } catch (error) {
        console.error('Error en el servicio de generación de reportes:', error);
        throw error;
    }
};

export default generateReport;

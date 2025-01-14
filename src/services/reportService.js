import ejs from "ejs";
import { join } from "path";
import puppeteer from "puppeteer"; // Usamos puppeteer en lugar de html-pdf

const generateReport = async (reportName, data) => {
    try {
        // Ruta de la plantilla EJS
        const templatePath = join(process.cwd(), "src/templates", `${reportName}.ejs`);

        // Renderizar el HTML con EJS
        const html = await ejs.renderFile(templatePath, data);

        // Lanzar Puppeteer y crear el PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Establecer el contenido HTML
        await page.setContent(html, { waitUntil: 'domcontentloaded' });

        // Configuración del PDF
        const pdfOptions = {
            format: "A4",
            orientation: "portrait",
            margin: {
                top: "10mm",
                right: "10mm",
                bottom: "10mm",
                left: "10mm",
            },
            printBackground: true,
        };

        // Generar el PDF
        const pdfBuffer = await page.pdf(pdfOptions);

        // Cerrar el navegador de Puppeteer
        await browser.close();

        // Verifica que el buffer tenga datos
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("Error generando el PDF, el buffer está vacío.");
        }

        return pdfBuffer;
    } catch (error) {
        console.error("Error generando el reporte:", error);
        throw error;
    }
};

export default generateReport;

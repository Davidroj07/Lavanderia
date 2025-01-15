import ejs from 'ejs';
import { join } from 'path';
import pdf from 'html-pdf';

const generateReport = async (reportName, data) => {
    try {
        // Define la ruta de la plantilla EJS
        const templatePath = join(process.cwd(), 'src/templates', `${reportName}.ejs`);

        // Renderizar el HTML desde la plantilla EJS con los datos
        const html = await ejs.renderFile(templatePath, data);

        // Configuración del PDF
        const pdfOptions = {
            format: 'A4', // Tamaño del documento
            orientation: 'portrait', // Orientación (vertical)
            border: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm',
            },
            // Habilita la impresión de estilos CSS en el PDF
            footer: {
                height: '10mm',
                contents: {
                    default: '<div style="text-align: center; font-size: 10px;">Página {{page}} de {{pages}}</div>',
                },
            },
        };

        // Generar el PDF usando html-pdf
        return new Promise((resolve, reject) => {
            pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
                if (err) {
                    console.error('Error generando el reporte:', err);
                    return reject(err);
                }
                resolve(buffer); // Devuelve el PDF como un Buffer
            });
        });
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        throw error;
    }
};

export default generateReport;
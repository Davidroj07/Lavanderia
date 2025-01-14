import express from "express";
import ExcelJS from "exceljs";
const router = express.Router();
import generateReport from "../services/reportService.js";
import {actualizarPesoRequisicion, generarentrega, actualizarentrega} from "../services/transactionService.js";

// Ruta para generar reportes
router.post("/api/generate-report", async (req, res) => {
    const { reportName, data } = req.body;
    try {
        // Generar el reporte PDF
        const pdfBuffer = await generateReport(reportName, data);
        // Configuración de los encabezados para el archivo PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${reportName}.pdf`);
        // Enviar el archivo PDF en la respuesta
        res.end(pdfBuffer);
    } catch (error) {
        console.error("Error generando el reporte:", error);
        res.status(500).json({ message: "Error generando el reporte", error });
    }
});

// Ruta para generar reportes dinámicos en Excel
router.post("/api/generate-excel", async (req, res) => {
    const { fileName, sheets } = req.body; // Recibimos `fileName` y `sheets` desde el cliente

    try {
        // Validar datos recibidos
        if (!fileName || !sheets || !Array.isArray(sheets) || sheets.length === 0) {
            return res.status(400).json({ message: "Faltan parámetros: fileName o sheets no están correctamente definidos." });
        }

        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();

        // Recorrer las hojas solicitadas para generarlas dinámicamente
        sheets.forEach(sheet => {
            const { name, columns, rows } = sheet;

            // Validar los datos de cada hoja
            if (!name || !columns || !rows) {
                throw new Error("Una de las hojas tiene datos incompletos: name, columns o rows faltan.");
            }

            // Crear una nueva hoja con el nombre especificado
            const worksheet = workbook.addWorksheet(name);

            // Configurar columnas dinámicamente
            worksheet.columns = columns.map(col => ({
                header: col.header,
                key: col.key,
                width: col.width || 15 // Asignar un ancho por defecto si no se especifica
            }));

            // Agregar las filas recibidas
            rows.forEach(row => worksheet.addRow(row));

            // Dar estilo a la primera fila (header)
            worksheet.getRow(1).font = { bold: true }; // Negritas en la fila de encabezados
        });

        // Configuración de los encabezados HTTP para enviar el archivo al cliente
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${fileName}`
        );

        // Escribir y enviar el archivo Excel
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Error generando el archivo Excel:", error);
        res.status(500).json({ message: "Error generando el archivo Excel", error });
    }
});

router.post("/api/actualizarPesoRequisicion", async (req, res) => {
    const { ano, numero } = req.query;
    try {
        await actualizarPesoRequisicion(ano, numero);
        res.status(200).json({ message: "Transacción completada con éxito" });
    } catch (error) {
        console.error("Error en la transacción:", error);
        res.status(500).json({ message: "Error en la transacción", error: error.message });
    }
});

router.post("/api/generarentrega", async (req, res) => {
    const { ano, numero, requisicion, fecha, usuario, descripcion } = req.query;
    try {
        await generarentrega(ano, numero, requisicion, fecha, usuario, descripcion);
        res.status(200).json({ message: "Transacción completada con éxito" });
    } catch (error) {
        console.error("Error en la transacción:", error);
        res.status(500).json({ message: "Error en la transacción", error: error.message });
    }
});

router.post("/api/actualizarentrega", async (req, res) => {
    const { ano, numero, consecutivo, requisicion, cant_entrega, peso_entrega, observacion, usuario } = req.query;
    try {
        await actualizarentrega(ano, numero, consecutivo, requisicion, cant_entrega, peso_entrega, observacion, usuario);
        res.status(200).json({ message: "Transacción completada con éxito" });
    } catch (error) {
        console.error("Error en la transacción:", error);
        res.status(500).json({ message: "Error en la transacción", error: error.message });
    }
});

export default router;

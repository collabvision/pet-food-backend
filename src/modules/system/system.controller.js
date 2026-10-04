import {
    getSystemMetricsService,
    getAllSystemData,
    generateExcelData
} from "./system.service.js";

export async function getMetricsController(req, res) {
    const metrics = await getSystemMetricsService();
    res.status(200).json({
        success: true,
        data: metrics
    });
}

export async function exportDataController(req, res) {
    const format = req.query.format || 'json';
    const data = await getAllSystemData();

    if (format === 'excel') {
        const buffer = await generateExcelData(data);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=furnest_export.xlsx');
        return res.status(200).send(buffer);
    }

    // Default to JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=furnest_export.json');
    res.status(200).send(JSON.stringify(data, null, 2));
}

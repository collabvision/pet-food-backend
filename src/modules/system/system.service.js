import os from "os";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import ExcelJS from "exceljs";
import { User } from "../users/user.model.js";
import { Order } from "../orders/order.model.js";
import { Product } from "../products/product.model.js";
import { Category } from "../categories/category.model.js";
import { Inventory } from "../inventory/inventory.model.js";
import { Shipment } from "../shipping/shipment.model.js";
import { Payment } from "../payments/payment.model.js";
import { Prescription } from "../prescriptions/prescription.model.js";

export async function getSystemMetricsService() {
    // DB Stats
    let dbStats = {};
    if (mongoose.connection.db) {
        dbStats = await mongoose.connection.db.stats();
    }

    // Server Memory
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Server Disk Space
    let diskStats = {};
    try {
        const rootPath = os.platform() === 'win32' ? 'C:\\' : '/';
        const stat = await fs.promises.statfs(rootPath);
        const totalDisk = stat.blocks * stat.bsize;
        const freeDisk = stat.bfree * stat.bsize;
        const usedDisk = totalDisk - freeDisk;
        
        diskStats = {
            total: totalDisk,
            free: freeDisk,
            used: usedDisk
        };
    } catch (e) {
        console.error("Could not read disk stats", e);
    }

    return {
        db: {
            dataSize: dbStats.dataSize || 0,
            storageSize: dbStats.storageSize || 0,
            collections: dbStats.collections || 0,
            objects: dbStats.objects || 0
        },
        server: {
            memory: {
                total: totalMem,
                used: usedMem,
                free: freeMem
            },
            disk: diskStats,
            cpus: os.cpus().length,
            loadavg: os.loadavg()
        }
    };
}

export async function getAllSystemData() {
    const [users, orders, products, categories, inventory, shipments, payments, prescriptions] = await Promise.all([
        User.find().lean(),
        Order.find().lean(),
        Product.find().lean(),
        Category.find().lean(),
        Inventory.find().lean(),
        Shipment.find().lean(),
        Payment.find().lean(),
        Prescription.find().lean()
    ]);

    return {
        users,
        orders,
        products,
        categories,
        inventory,
        shipments,
        payments,
        prescriptions
    };
}

export async function generateExcelData(data) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'FurNest Admin';
    workbook.created = new Date();

    const addSheet = (name, rows) => {
        if (!rows || rows.length === 0) return;
        const sheet = workbook.addWorksheet(name);
        // Get all unique keys from all objects
        const keys = new Set();
        rows.forEach(row => {
            Object.keys(row).forEach(k => keys.add(k));
        });
        const columns = Array.from(keys).map(key => ({ header: key, key: key }));
        sheet.columns = columns;
        
        rows.forEach(row => {
            // Stringify nested objects
            const processedRow = {};
            for (const key in row) {
                if (typeof row[key] === 'object' && row[key] !== null) {
                    processedRow[key] = JSON.stringify(row[key]);
                } else {
                    processedRow[key] = row[key];
                }
            }
            sheet.addRow(processedRow);
        });
    };

    addSheet('Users', data.users);
    addSheet('Orders', data.orders);
    addSheet('Products', data.products);
    addSheet('Categories', data.categories);
    addSheet('Inventory', data.inventory);
    addSheet('Shipments', data.shipments);
    addSheet('Payments', data.payments);
    addSheet('Prescriptions', data.prescriptions);

    return await workbook.xlsx.writeBuffer();
}

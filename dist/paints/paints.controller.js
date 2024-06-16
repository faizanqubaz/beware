"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaintAndAssociatedCustomers = exports.savePaintsofCustomer = void 0;
const customer_model_1 = require("../customers/customer.model");
const paint_model_1 = require("./paint.model");
const savePaintsofCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const { colorName, quantity, price, colorCode, yearRange, brand, size } = req.body;
    try {
        // Check if customer exists
        const customer = yield customer_model_1.Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                status: 404,
                message: 'Customer not found',
            });
        }
        // Create a new paint record
        const newPaint = new paint_model_1.Paint({
            customerId: customer._id,
            colorName,
            quantity,
            price,
            colorCode,
            yearRange,
            brand,
            size,
        });
        // Save the paint record
        const savedPaint = yield newPaint.save();
        res.status(201).json({
            status: 201,
            message: 'Paint record saved successfully',
            data: savedPaint,
        });
    }
    catch (error) {
        console.error('Error saving paint record:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});
exports.savePaintsofCustomer = savePaintsofCustomer;
const getPaintAndAssociatedCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paintId, customerId } = req.params;
    try {
        // Retrieve the paint document by its ID
        const paint = yield paint_model_1.Paint.findById(paintId);
        if (!paint) {
            res.status(404).json({
                status: 404,
                message: 'Paint not found',
            });
            return;
        }
        // Find customers who have the paint ID in their paints array
        const customers = yield customer_model_1.Customer.find({ paints: paintId });
        res.status(200).json({
            status: 200,
            data: {
                paint,
                customers,
            },
        });
    }
    catch (error) {
        console.error('Error retrieving paint or associated customers:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});
exports.getPaintAndAssociatedCustomers = getPaintAndAssociatedCustomers;

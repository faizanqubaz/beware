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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerWithPaints = exports.savePaintsofCustomer = void 0;
const customer_model_1 = require("../customers/customer.model");
const mongoose_1 = __importDefault(require("mongoose"));
const paint_model_1 = require("./paint.model");
const savePaintsofCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const { colorName, quantity, price, colorCode, yearRange, brand, size } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid customerId format',
        });
    }
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
        // Ensure customer.paints is initialized properly
        if (!customer.paints) {
            customer.paints = [];
        }
        // Update the customer's paints array with the saved paint's _id
        customer.paints.push(savedPaint._id); // Explicitly cast to mongoose.Types.ObjectId
        yield customer.save();
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
const getCustomerWithPaints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid customerId format',
        });
    }
    try {
        // Find the customer by ID and populate the 'paints' field with paint objects
        console.log('customerid', customerId);
        const customer = yield customer_model_1.Customer.findById(customerId).populate('paints');
        if (!customer) {
            return res.status(404).json({
                status: 404,
                message: 'Customer not found',
            });
        }
        res.status(200).json({
            status: 200,
            message: 'customer with the paints',
            data: {
                customerId: customer._id,
                name: customer.name,
                email: customer.email,
                paints: customer.paints,
            },
        });
    }
    catch (error) {
        console.error('Error retrieving customer with paints:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});
exports.getCustomerWithPaints = getCustomerWithPaints;

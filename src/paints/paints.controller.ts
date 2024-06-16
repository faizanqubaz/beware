import { Request, Response } from 'express';
import { Customer } from '../customers/customer.model';
import mongoose from 'mongoose';
import { Paint } from './paint.model';

const savePaintsofCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { colorName, quantity, price, colorCode, yearRange, brand, size } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid customerId format',
    });
  }

  try {
    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        status: 404,
        message: 'Customer not found',
      });
    }

    // Create a new paint record
    const newPaint = new Paint({
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
    const savedPaint = await newPaint.save();

    // Ensure customer.paints is initialized properly
    if (!customer.paints) {
      customer.paints = [];
    }

    // Update the customer's paints array with the saved paint's _id
    customer.paints.push(savedPaint._id as mongoose.Types.ObjectId); // Explicitly cast to mongoose.Types.ObjectId
    await customer.save();

    res.status(201).json({
      status: 201,
      message: 'Paint record saved successfully',
      data: savedPaint,
    });
  } catch (error) {
    console.error('Error saving paint record:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

const getCustomerWithPaints = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid customerId format',
    });
  }

  try {
    // Find the customer by ID and populate the 'paints' field with paint objects
    console.log('customerid', customerId);

    const customer = await Customer.findById(customerId).populate('paints');

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
  } catch (error) {
    console.error('Error retrieving customer with paints:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

export { savePaintsofCustomer, getCustomerWithPaints };

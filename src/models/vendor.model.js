import mongoose from "mongoose";
import { type } from "os";

const vendorModel = new mongoose.Schema(
    {
        name : {
            type: String,
            required: [true, 'Vendor name is required'],
            minLength: 2,
        }
    }
)
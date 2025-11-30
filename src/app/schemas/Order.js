import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
    {
        user: {
        id: {
           type: String,
           required: true,
        },
        name: {
            type: String,
            required: true,
        },
        },
        products: [
        {
            id: {
            type: String,
            required: true,
            },
            name: {
            type: String,
            required: true,
            },
            price: {
            type: Number,
            required: true,
            },
            Category: {
            type: String,
            required: true,
            },
            quantity: {
            type: Number,
            required: true,
            },
            url: {
            type: String,
            required: true,
            },
        },
        ],
        status: {
        type: String,
        required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
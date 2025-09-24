import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:Request) {
    // Dummy response for sweet creation
    return NextResponse.json({
        message: 'Sweet created successfully (dummy response)',
        sweet: {
            id: 1,
            name: 'Gulab Jamun',
            price: 50,
            quantity: 10,
        },
    });
}
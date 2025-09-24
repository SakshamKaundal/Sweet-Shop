import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const dummySweets = [
        { id: 1, name: 'Ladoo', price: 10 },
        { id: 2, name: 'Barfi', price: 15 },
        { id: 3, name: 'Jalebi', price: 12 }
    ];

    return NextResponse.json(dummySweets);
}
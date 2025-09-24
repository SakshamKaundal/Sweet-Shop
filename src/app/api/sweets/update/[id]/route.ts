import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: Request, req: NextRequest) {
    // Dummy response for POST request
    return NextResponse.json({
        message: 'Dummy POST request received for updating sweet.',
        status: 'success',
    });
}
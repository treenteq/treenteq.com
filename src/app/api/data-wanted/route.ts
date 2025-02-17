import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    dataType: z.string().min(3, 'Data type must be at least 3 characters'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = formSchema.safeParse(body);

        if (!body) {
            console.log('failed');
        }

        if (!result.success) {
            return NextResponse.json(
                { success: false, errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        await prisma.dataWanted.create({
            data: {
                email: body.email,
                type: body.dataType,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Your request has been submitted!',
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Something went wrong! ${(error as Error).message}`,
            },
            { status: 500 },
        );
    }
}

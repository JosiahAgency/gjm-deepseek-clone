import {Webhook} from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import {headers} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req) {
    try {
        const webHooks = new Webhook(process.env.SIGNING_SECRET)
        const headerPayLoad = await headers()
        const svixHeaders = {
            "svix-id": headerPayLoad.get("svix-id"),
            "svix-timestamp": headerPayLoad.get("svix-timestamp"),
            "svix-signature": headerPayLoad.get("svix-signature"),
        }

        const payLoad = await req.json()
        const body = JSON.stringify(payLoad)
        const {data, type} = webHooks.verify(body, svixHeaders)

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data.last_name}`,
            image: data.image_url,
        }

        try {
            await connectDB()

            switch (type) {
                case 'user.created':
                    await User.create(userData)
                    break;

                case 'user.updated':
                    await User.findByIdAndUpdate(userData._id, userData)
                    break;

                case 'user.deleted':
                    await User.findByIdAndDelete(userData._id)
                    break;

                default:
                    break
            }

            return NextResponse.json({message: 'Event Received'})
        } catch (error) {
            console.error('MongoDB connection error:', error.message)
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Webhook processing error:', error.message)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 400 }
        )
    }
}

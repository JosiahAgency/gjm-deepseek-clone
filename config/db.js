import mongoose from 'mongoose'

if (!global.mongoose) {
    global.mongoose = {conn: null, promise: null}
}

export default async function connectDB() {
    if (global.mongoose.conn) {
        return global.mongoose.conn
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined')
    }

    if (!global.mongoose.promise) {
        global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI)
            .then((mongoose) => {
                return mongoose
            })
    }

    try {
        global.mongoose.conn = await global.mongoose.promise
    } catch (e) {
        global.mongoose.promise = null
        console.error('Error connecting to MongoDB:', e.message)
        throw e
    }

    return global.mongoose.conn
}

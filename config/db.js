import mongoose from 'mongoose'

// Initialize the cached object on the global scope if it doesn't exist
if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null }
}

export default async function connectDB() {
    // Always reference the global object directly
    if (global.mongoose.conn) {
        return global.mongoose.conn
    }

    // Check if MONGODB_URI is defined
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
        global.mongoose.promise = null // Reset the promise on error
        console.error('Error connecting to MongoDB:', e.message)
        throw e // Rethrow the error for proper handling upstream
    }

    return global.mongoose.conn
}

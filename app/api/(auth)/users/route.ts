import connect from "@/lib/db"
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

export const GET = async() => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users),{status:200});
    } catch (error) {
        return new NextResponse("Error fetching users", {status:500});
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(JSON.stringify({ message: "User is created!", user: newUser }), { status: 201 });
    } catch (error: any) {
        return new NextResponse("Error creating user", { status: 500 });
    }
}

export const PATCH = async (request:Request) => {
    try {
        const body = await request.json();
        const {userId, newUsername} = body;
        
        await connect();
        if(!userId || !newUsername){
            return new NextResponse("User ID is required", {status:400});
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse("Invalid User ID", {status:400});
        }

        const updatedUser = await User.findByIdAndUpdate(
            {_id : new Types.ObjectId(userId)},
            {username:newUsername},
            {new:true},
        )
        if(!updatedUser){
            return new NextResponse(JSON.stringify({message:"User not found"}), {status:404});
        }

        return new NextResponse(JSON.stringify({ message: "User updated successfully", user: updatedUser }), { status: 200 });
    } catch (error) {
        return new NextResponse("Error updating user", {status:500});
    }

}

export const DELETE = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId } = body;

        await connect();

        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: "User deleted successfully", user: deletedUser }), { status: 200 });

    } catch (error) {
        return new NextResponse("Error deleting user", { status: 500 });
    }
}
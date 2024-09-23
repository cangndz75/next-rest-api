import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import { request } from "http";
import {Types } from "mongoose";
import { NextResponse } from "next/server";


export const GET = async(request:Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"Invalid User ID"}), {status:400});
        }
        await connect();
        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message:"User not found"}), {status:404});
        }
        const categories = await Category.find({user:userId});
        return new NextResponse(JSON.stringify(categories),{status:200});

    } catch (error) {
        return new NextResponse("Error fetching categories", {status:500});
    }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const { title } = await request.json();

        if (!userId || !title) {
            return new NextResponse(JSON.stringify({ message: "User ID and Title are required" }), { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid User ID" }), { status: 400 });
        }

        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId),
        });
        await newCategory.save();
        return new NextResponse(JSON.stringify({ message: "Category is created!", category: newCategory }), { status: 201 });
    } catch (error) {
        return new NextResponse("Error creating category", { status: 500 });
    }
}
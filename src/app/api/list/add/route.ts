import React from 'react'
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/middleware/db';
import list from '@/app/models/list';
export async function POST(req:NextRequest,res:NextResponse){
    try {
        await connect();
        const request=await req.json();
        const NewList=await new list({
            task:request.task,
            status:0,
            priority:request.priority,
            workHours:request.workHours
        }
        )
        await NewList.save();
        return NextResponse.json({status:1})
    } catch (error) {
        return NextResponse.json({status:error})
    }
   

}
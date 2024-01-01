import list from '../../models/list'
import {connect} from '../../middleware/db'
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req:NextRequest,res:NextResponse){
    await connect();
    const request=await req.json();
    let lists=await list.find({'status':request.status}).sort({'priority':'asc'});
    return NextResponse.json(lists);
}
export async function PUT(req:NextRequest,res:NextResponse){
    await connect();
    try {
        const request=await req.json();
        let completeRatio:number=0
        if(request.status==1){
            completeRatio=request.completeratio
        }
        else if(request.status==2){
            completeRatio=100
        }
    let UserList=await list.findById(request.id);
    UserList.task=request.task;
    UserList.status=request.status
    UserList.priority=request.priority
    UserList.completeratio=completeRatio
    UserList.workHours=request.workHours
    await UserList.save();
    return NextResponse.json({status:1});
    } catch (error) {
        return NextResponse.json({status:0});
    }
}

export async function DELETE(req:NextRequest,res:NextResponse){
    await connect();
    try {
    const request=await req.json();
    let UserList=await list.findByIdAndDelete(request.id);
    await UserList.save();
    return NextResponse.json({status:1});
    } catch (error) {
        return NextResponse.json({status:0});
    }
    
}
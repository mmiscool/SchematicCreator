<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Schematiccreatorlayout;
use Amranidev\Ajaxis\Ajaxis;
use URL;

/**
 * Class SchematiccreatorlayoutController.
 *
 * @author  The scaffold-interface created at 2018-01-09 10:47:32pm
 * @link  https://github.com/amranidev/scaffold-interface
 */
class SchematiccreatorlayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return  \Illuminate\Http\Response
     */
    public function index()
    {
        $title = 'Index - schematiccreatorlayout';
        $schematiccreatorlayouts = Schematiccreatorlayout::paginate(6);
        return view('schematiccreatorlayout.index',compact('schematiccreatorlayouts','title'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return  \Illuminate\Http\Response
     */
    public function create()
    {
        $title = 'Create - schematiccreatorlayout';
        
        return view('schematiccreatorlayout.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param    \Illuminate\Http\Request  $request
     * @return  \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $schematiccreatorlayout = new Schematiccreatorlayout();

        
        $schematiccreatorlayout->Name = $request->Name;

        
        $schematiccreatorlayout->Description = $request->Description;

        
        $schematiccreatorlayout->LayoutData = $request->LayoutData;

        $schematiccreatorlayout->save();



        return redirect('schematiccreatorlayout/'.$schematiccreatorlayout->id.'/edit/');
    }

    /**
     * Display the specified resource.
     *
     * @param    \Illuminate\Http\Request  $request
     * @param    int  $id
     * @return  \Illuminate\Http\Response
     */
    public function show($id,Request $request)
    {
        $title = 'Show - schematiccreatorlayout';

        if($request->ajax())
        {
            return URL::to('schematiccreatorlayout/'.$id);
        }

        $schematiccreatorlayout = Schematiccreatorlayout::findOrfail($id);
        return view('schematiccreatorlayout.show',compact('title','schematiccreatorlayout'));
    }

    /**
     * Show the form for editing the specified resource.
     * @param    \Illuminate\Http\Request  $request
     * @param    int  $id
     * @return  \Illuminate\Http\Response
     */
    public function edit($id,Request $request)
    {
        $title = 'Edit - schematiccreatorlayout';
        if($request->ajax())
        {
            return URL::to('schematiccreatorlayout/'. $id . '/edit');
        }

        
        $schematiccreatorlayout = Schematiccreatorlayout::findOrfail($id);
        return view('schematiccreatorlayout.edit',compact('title','schematiccreatorlayout'  ));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param    \Illuminate\Http\Request  $request
     * @param    int  $id
     * @return  \Illuminate\Http\Response
     */
    public function update($id,Request $request)
    {
        $schematiccreatorlayout = Schematiccreatorlayout::findOrfail($id);
    	
        $schematiccreatorlayout->Name = $request->Name;
        
        $schematiccreatorlayout->Description = $request->Description;
        
        $schematiccreatorlayout->LayoutData = $request->LayoutData;
        
        
        $schematiccreatorlayout->save();

        return redirect('schematiccreatorlayout');
    }

    /**
     * Delete confirmation message by Ajaxis.
     *
     * @link      https://github.com/amranidev/ajaxis
     * @param    \Illuminate\Http\Request  $request
     * @return  String
     */
    public function DeleteMsg($id,Request $request)
    {
        $msg = Ajaxis::BtDeleting('Warning!!','Would you like to remove This?','/schematiccreatorlayout/'. $id . '/delete');

        if($request->ajax())
        {
            return $msg;
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param    int $id
     * @return  \Illuminate\Http\Response
     */
    public function destroy($id)
    {
     	$schematiccreatorlayout = Schematiccreatorlayout::findOrfail($id);
     	$schematiccreatorlayout->delete();
        return URL::to('schematiccreatorlayout');
    }
}

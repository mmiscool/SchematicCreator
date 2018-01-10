<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Schematiccreatorsymbol;
use Amranidev\Ajaxis\Ajaxis;
use URL;
use Storage;
use App\Fileentry;

/**
 * Class SchematiccreatorsymbolController.
 *
 * @author  The scaffold-interface created at 2018-01-09 10:44:51pm
 * @link  https://github.com/amranidev/scaffold-interface
 */
class SchematiccreatorsymbolController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return  \Illuminate\Http\Response
     */
    public function index()
    {
        $title = 'Index - schematiccreatorsymbol';
        $schematiccreatorsymbols = Schematiccreatorsymbol::paginate(6);
        return view('schematiccreatorsymbol.index',compact('schematiccreatorsymbols','title'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return  \Illuminate\Http\Response
     */
    public function create()
    {
        $title = 'Create - schematiccreatorsymbol';
        
        return view('schematiccreatorsymbol.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param    \Illuminate\Http\Request  $request
     * @return  \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $schematiccreatorsymbol = new Schematiccreatorsymbol();

        
        $schematiccreatorsymbol->name = $request->name;

        
        $schematiccreatorsymbol->symbolData = $request->symbolData;

        
        $schematiccreatorsymbol->Description = $request->Description;

        
        $schematiccreatorsymbol->ExtraAtributes = $request->ExtraAtributes;


        $schematiccreatorsymbol->save();
      //  dd($request->hasFile('upload'));

        $request->upload->storeAs('public/symbols', $schematiccreatorsymbol->id . "-Symbol.png");

        return redirect('schematiccreatorsymbol/'.$schematiccreatorsymbol->id.'/edit/');
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
        $title = 'Show - schematiccreatorsymbol';

        if($request->ajax())
        {
            return URL::to('schematiccreatorsymbol/'.$id);
        }

        $schematiccreatorsymbol = Schematiccreatorsymbol::findOrfail($id);
        return view('schematiccreatorsymbol.show',compact('title','schematiccreatorsymbol'));
    }

    /**
     * Show the form for editing the specified resource.
     * @param    \Illuminate\Http\Request  $request
     * @param    int  $id
     * @return  \Illuminate\Http\Response
     */
    public function edit($id,Request $request)
    {
        $title = 'Edit - schematiccreatorsymbol';
        if($request->ajax())
        {
            return URL::to('schematiccreatorsymbol/'. $id . '/edit');
        }

        
        $schematiccreatorsymbol = Schematiccreatorsymbol::findOrfail($id);
        return view('schematiccreatorsymbol.edit',compact('title','schematiccreatorsymbol'  ));
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
        $schematiccreatorsymbol = Schematiccreatorsymbol::findOrfail($id);
    	
        $schematiccreatorsymbol->name = $request->name;
        
        $schematiccreatorsymbol->symbolData = $request->symbolData;
        
        $schematiccreatorsymbol->Description = $request->Description;
        
        $schematiccreatorsymbol->ExtraAtributes = $request->ExtraAtributes;
        
        
        $schematiccreatorsymbol->save();

        return redirect('schematiccreatorsymbol');
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
        $msg = Ajaxis::BtDeleting('Warning!!','Would you like to remove This?','/schematiccreatorsymbol/'. $id . '/delete');

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
     	$schematiccreatorsymbol = Schematiccreatorsymbol::findOrfail($id);
     	$schematiccreatorsymbol->delete();
        return URL::to('schematiccreatorsymbol');
    }
}

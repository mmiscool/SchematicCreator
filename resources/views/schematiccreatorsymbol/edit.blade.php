@extends('scaffold-interface.layouts.app')
@section('title','Edit')
@section('content')

<section class="content">
    <h1>
        Edit schematiccreatorsymbol
    </h1>
    <a href="{!!url('schematiccreatorsymbol')!!}" class = 'btn btn-primary'><i class="fa fa-home"></i> Schematiccreatorsymbol Index</a>
    <br>
    <form method = 'POST' action = '{!! url("schematiccreatorsymbol")!!}/{!!$schematiccreatorsymbol->
        id!!}/update'> 
        <input type = 'hidden' name = '_token' value = '{{Session::token()}}'>
        <div class="form-group">
            <label for="name">name</label>
            <input id="name" name = "name" type="text" class="form-control" value="{!!$schematiccreatorsymbol->
            name!!}"> 
        </div>
        <div class="form-group">
            <label for="symbolData">symbolData</label>
            <input id="symbolData" name = "symbolData" type="text" class="form-control" value="{!!$schematiccreatorsymbol->
            symbolData!!}"> 
        </div>
        <div class="form-group">
            <label for="Description">Description</label>
            <input id="Description" name = "Description" type="text" class="form-control" value="{!!$schematiccreatorsymbol->
            Description!!}"> 
        </div>
        <div class="form-group">
            <label for="ExtraAtributes">ExtraAtributes</label>
            <input id="ExtraAtributes" name = "ExtraAtributes" type="text" class="form-control" value="{!!$schematiccreatorsymbol->
            ExtraAtributes!!}"> 
        </div>
        <button class = 'btn btn-success' type ='submit'><i class="fa fa-floppy-o"></i> Update</button>
    </form>
</section>
@endsection
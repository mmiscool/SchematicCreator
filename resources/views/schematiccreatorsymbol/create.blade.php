@extends('scaffold-interface.layouts.app')
@section('title','Create')
@section('content')

<section class="content">
    <h1>
        Create schematiccreatorsymbol
    </h1>
    <a href="{!!url('schematiccreatorsymbol')!!}" class = 'btn btn-danger'><i class="fa fa-home"></i> Schematiccreatorsymbol Index</a>
    <br>
    <form method = 'POST' action = '{!!url("schematiccreatorsymbol")!!}' enctype="multipart/form-data">
        <input type = 'hidden' name = '_token' value = '{{Session::token()}}'>
        <div class="form-group">
            <label for="name">name</label>
            <input id="name" name = "name" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="symbolData">symbolData</label>
            <input id="symbolData" name = "symbolData" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="Description">Description</label>
            <input id="Description" name = "Description" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="ExtraAtributes">ExtraAtributes</label>
            <input id="ExtraAtributes" name = "ExtraAtributes" type="text" class="form-control">
        </div>

        <input type="file" id="upload1"  name="upload1" accept=".png">

        <input type="file" id="upload2"  name="upload2" accept=".png">

        <button class = 'btn btn-success' type ='submit'> <i class="fa fa-floppy-o"></i> Save</button>
    </form>
</section>
@endsection
@extends('scaffold-interface.layouts.app')
@section('title','Create')
@section('content')

<section class="content">
    <h1>
        Create schematiccreatorlayout
    </h1>
    <a href="{!!url('schematiccreatorlayout')!!}" class = 'btn btn-danger'><i class="fa fa-home"></i> Schematiccreatorlayout Index</a>
    <br>
    <form method = 'POST' action = '{!!url("schematiccreatorlayout")!!}'>
        <input type = 'hidden' name = '_token' value = '{{Session::token()}}'>
        <div class="form-group">
            <label for="Name">Name</label>
            <input id="Name" name = "Name" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="Description">Description</label>
            <input id="Description" name = "Description" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="LayoutData">LayoutData</label>
            <input id="LayoutData" name = "LayoutData" type="text" class="form-control">
        </div>
        <button class = 'btn btn-success' type ='submit'> <i class="fa fa-floppy-o"></i> Save</button>
    </form>
</section>
@endsection
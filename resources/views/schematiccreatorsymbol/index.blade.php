@extends('scaffold-interface.layouts.app')
@section('title','Index')
@section('content')

<section class="content">
    <h1>
        Symbols Manager
    </h1>
    <a href='{!!url("schematiccreatorsymbol")!!}/create' class = 'btn btn-success'><i class="fa fa-plus"></i> New</a>
    <br>
    <br>
    <table class = "table table-striped table-bordered table-hover" style = 'background:#fff'>
        <thead>
            <th>name</th>
            <th>Symbol</th>

            <th>Description</th>
            <th>ExtraAtributes</th>
            <th>actions</th>
        </thead>
        <tbody>
            @foreach($schematiccreatorsymbols as $schematiccreatorsymbol) 
            <tr>
                <td>{!!$schematiccreatorsymbol->name!!}</td>
                <td>
                    <img src ='../../../../storage/symbols/{!!$schematiccreatorsymbol->id!!}-Symbol.png'
                    style="    height: 50%;
    width: auto;">
                </td>

                <td>{!!$schematiccreatorsymbol->Description!!}</td>
                <td>{!!$schematiccreatorsymbol->ExtraAtributes!!}</td>
                <td>
                    <a data-toggle="modal" data-target="#myModal" class = 'delete btn btn-danger btn-xs' data-link = "/schematiccreatorsymbol/{!!$schematiccreatorsymbol->id!!}/deleteMsg" ><i class = 'fa fa-trash'> delete</i></a>
                    <a href = '#' class = 'viewEdit btn btn-primary btn-xs' data-link = '/schematiccreatorsymbol/{!!$schematiccreatorsymbol->id!!}/edit'><i class = 'fa fa-edit'> edit</i></a>
                    <a href = '#' class = 'viewShow btn btn-warning btn-xs' data-link = '/schematiccreatorsymbol/{!!$schematiccreatorsymbol->id!!}'><i class = 'fa fa-eye'> info</i></a>
                </td>
            </tr>
            @endforeach 
        </tbody>
    </table>
    {!! $schematiccreatorsymbols->render() !!}

</section>
@endsection
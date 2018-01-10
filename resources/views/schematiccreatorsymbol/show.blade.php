@extends('scaffold-interface.layouts.app')
@section('title','Show')
@section('content')

<section class="content">
    <h1>
        Show schematiccreatorsymbol
    </h1>
    <br>
    <a href='{!!url("schematiccreatorsymbol")!!}' class = 'btn btn-primary'><i class="fa fa-home"></i>Schematiccreatorsymbol Index</a>
    <br>
    <table class = 'table table-bordered'>
        <thead>
            <th>Key</th>
            <th>Value</th>
        </thead>
        <tbody>
            <tr>
                <td> <b>name</b> </td>
                <td>{!!$schematiccreatorsymbol->name!!}</td>
            </tr>
            <tr>
                <td> <b>symbolData</b> </td>
                <td>{!!$schematiccreatorsymbol->symbolData!!}</td>
            </tr>
            <tr>
                <td> <b>Description</b> </td>
                <td>{!!$schematiccreatorsymbol->Description!!}</td>
            </tr>
            <tr>
                <td> <b>ExtraAtributes</b> </td>
                <td>{!!$schematiccreatorsymbol->ExtraAtributes!!}</td>
            </tr>
        </tbody>
    </table>
</section>
@endsection
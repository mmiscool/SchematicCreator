@extends('scaffold-interface.layouts.app')
@section('title','Show')
@section('content')

<section class="content">
    <h1>
        Show schematiccreatorlayout
    </h1>
    <br>
    <a href='{!!url("schematiccreatorlayout")!!}' class = 'btn btn-primary'><i class="fa fa-home"></i>Schematiccreatorlayout Index</a>
    <br>
    <table class = 'table table-bordered'>
        <thead>
            <th>Key</th>
            <th>Value</th>
        </thead>
        <tbody>
            <tr>
                <td> <b>Name</b> </td>
                <td>{!!$schematiccreatorlayout->Name!!}</td>
            </tr>
            <tr>
                <td> <b>Description</b> </td>
                <td>{!!$schematiccreatorlayout->Description!!}</td>
            </tr>
            <tr>
                <td> <b>LayoutData</b> </td>
                <td>{!!$schematiccreatorlayout->LayoutData!!}</td>
            </tr>
        </tbody>
    </table>
</section>
@endsection
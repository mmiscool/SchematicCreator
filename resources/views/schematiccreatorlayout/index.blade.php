@extends('scaffold-interface.layouts.app')
@section('title','Index')
@section('content')

    <section class="content">
        <h1>
            Shematic Manager
        </h1>
        <a href='{!!url("schematiccreatorlayout")!!}/create' class='btn btn-success'><i class="fa fa-plus"></i> New</a>
        <br>
        <br>
        <table class="table table-striped table-bordered table-hover" style='background:#fff'>
            <thead>
            <th>Name</th>
            <th>Description</th>

            <th>actions</th>
            </thead>
            <tbody>
            @foreach($schematiccreatorlayouts as $schematiccreatorlayout)
                <tr>

                    <td>
                        <a href='#' class='viewEdit btn btn-primary btn-xs'
                           data-link='/schematiccreatorlayout/{!!$schematiccreatorlayout->id!!}/edit'><i
                                    class='fa fa-edit'> edit</i></a>
                        <a href='/schematiccreatorlayout/{!!$schematiccreatorlayout->id!!}/edit'>
                            {!!$schematiccreatorlayout->Name!!}
                        </a>
                    </td>

                    <td>{!!$schematiccreatorlayout->Description!!}</td>

                    <td>
                        <a data-toggle="modal" data-target="#myModal" class='delete btn btn-danger btn-xs'
                           data-link="/schematiccreatorlayout/{!!$schematiccreatorlayout->id!!}/deleteMsg"><i
                                    class='fa fa-trash'> delete</i></a>
                        <a href='#' class='viewShow btn btn-warning btn-xs'
                           data-link='/schematiccreatorlayout/{!!$schematiccreatorlayout->id!!}'><i class='fa fa-eye'>
                                info</i></a>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
        {!! $schematiccreatorlayouts->render() !!}

    </section>
@endsection
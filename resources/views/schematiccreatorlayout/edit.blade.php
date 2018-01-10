@extends('scaffold-interface.layouts.app')
@section('title','Edit')
@section('content')

    <script type='text/javascript' src='../../../../../SchematicEditor/famesetup.js' defer='defer'></script>

    <section class="content">
        <div class="panel-group" id="accordion">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">Model Properties.</a>
                    </h4>
                </div>
                <div id="collapse1" class="panel-collapse collapse">
                    <div class="panel-body">


                        <a href="{!!url('schematiccreatorlayout')!!}" class='btn btn-primary'><i class="fa fa-home"></i>
                            Schematiccreatorlayout Index</a>
                        <br>
                        <form method='POST'
                              action='{!! url("schematiccreatorlayout")!!}/{!!$schematiccreatorlayout->id!!}/update'>
                            <input type='hidden' name='_token' value='{{Session::token()}}'>
                            <div class="form-group">
                                <label for="Name">Name</label>
                                <input id="Name" name="Name" type="text" class="form-control"
                                       value="{!!$schematiccreatorlayout->Name!!}">
                            </div>
                            <div class="form-group">
                                <label for="Description">Description</label>
                                <input id="Description" name="Description" type="text" class="form-control"
                                       value="{!!$schematiccreatorlayout->Description!!}">
                            </div>
                            <div class="form-group">
                                <label for="LayoutData">LayoutData</label>
                                <input id="LayoutData" name="LayoutData" type="text" class="form-control"
                                       value="{!!$schematiccreatorlayout->LayoutData!!}">
                            </div>
                            <button class='btn btn-success' type='submit'><i class="fa fa-floppy-o"></i> Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function onMyFrameLoad() {
                alert('myframe is loaded');
            };
        </script>

        <iframe id='cad' src="../../../../../SchematicEditor/?id={!!$schematiccreatorlayout->id!!}" style="background:white"></iframe>


    </section>
@endsection
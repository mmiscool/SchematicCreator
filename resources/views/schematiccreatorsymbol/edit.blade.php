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
                        <a href="{!!url('schematiccreatorsymbol')!!}" class='btn btn-primary'><i class="fa fa-home"></i>
                            Schematiccreatorsymbol Index</a>
                        <br>
                        <form method='POST' action='{!! url("schematiccreatorsymbol")!!}/{!!$schematiccreatorsymbol->
        id!!}/update'>
                            <input type='hidden' name='_token' value='{{Session::token()}}'>

                                <label for="name">name</label>
                            <input type='hidden'  id="name" name="name" type="text" class="form-control" value="{!!$schematiccreatorsymbol->name!!}">

                            <div class="form-group">
                                <label for="symbolData">symbolData</label>
                                <textarea id="symbolData" name="symbolData" type="text" style="display:none;" >
                                    {!!$schematiccreatorsymbol->symbolData!!}
                                </textarea>
                            </div>
                            <div class="form-group">
                                <label for="Description">Description</label>
                                <input id="Description" name="Description" type="text" class="form-control" value="{!!$schematiccreatorsymbol->
            Description!!}">
                            </div>
                            <div class="form-group">
                                <label for="ExtraAtributes">ExtraAtributes</label>
                                <input id="ExtraAtributes" name="ExtraAtributes" type="text" class="form-control"
                                       value="{!!$schematiccreatorsymbol->
            ExtraAtributes!!}">
                            </div>
                            <button class='btn btn-success' type='submit'><i class="fa fa-floppy-o"></i> Update</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>

        <script>


            function BrowserStorageStore(type, id, field, contents) {
                localStorage.setItem(type + "-" + id + "-" + field, contents);
            }

            function BrowserStorage(type, id, field) {
                if (localStorage.getItem(type + "-" + id + "-" + field)) {

                    return localStorage.getItem(type + "-" + id + "-" + field);
                }
                return "";
            }

            bla = document.getElementById("symbolData").value;
            if (bla != ""){
                BrowserStorageStore("Symbol", "{!!$schematiccreatorsymbol->id!!}", "Layout",bla);
            }

            function ExportToLocalFile()
            {
                document.getElementById('symbolData').value = BrowserStorage("Symbol", "{!!$schematiccreatorsymbol->id!!}", "Layout");
                document.getElementById('name').value = BrowserStorage("Symbol", "{!!$schematiccreatorsymbol->id!!}", "Name");
            }

            window.addEventListener("storage", function () {
                ExportToLocalFile();
            }, false);
        </script>

        <iframe id='cad' src="../../../../../SchematicEditor/SymbolEditor.htm?id={!!$schematiccreatorsymbol->id!!}"
                style="background:white ; width:99%;"></iframe>

    </section>
@endsection
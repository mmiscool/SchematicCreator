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

                                <textarea id="LayoutData" name="LayoutData" type="text" style="display:none;">
                                    {!!$schematiccreatorlayout->LayoutData!!}
                                </textarea>

                            </div>
                            <button id="submitButton" class='btn btn-success' type='submit'><i class="fa fa-floppy-o"></i> Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


        <iframe id='cad' src="../../../../../../schematiccreatorsymbol"
                style="background:white; width:99%;"></iframe>

        <script>

            reading = 0;
            window.addEventListener("storage", function () {
                ExportToLocalFile();
            }, false);

            function ExportToLocalFile() {
                if (reading == 1) return;
                reading = 1;
                var bla;
                triggerSaveOnCompletion = false;
                var lengthOfLocalStorage = localStorage.length;
                bla = lengthOfLocalStorage.toString();
                for (var i = 0, len = localStorage.length; i < len; i++) {
                    if (localStorage.key(i).includes('Schematic-')) {

                        var key = localStorage.key(i);
                        var value = localStorage[key];

                        bla += "\n" + key + "\n" + value;

                        triggerSaveOnCompletion = true;
                    }

                }
                document.getElementById('LayoutData').value = bla;
                if(triggerSaveOnCompletion) document.getElementById('submitButton').click();
                reading = 0;


            }


            function purgelocalfile() {
                var bla = [];
                for (var i = 0, len = localStorage.length; i < len; i++) {
                    if (localStorage.key(i).includes('Schematic-')) {
                        bla[i] = localStorage.key(i);
                    }
                }

                len = localStorage.length
                for (var i = 0; i < len; i++) {

                    localStorage.removeItem(bla[i]);

                }

            }

            function readSingleFile() {
                reading = 1;
                purgelocalfile();
                var arrayOfLines = document.getElementById('LayoutData').value.split("\n");
                //alert(arrayOfLines[0]);

                for (var i = 0; i < arrayOfLines[0]; i++) {
                    localStorage.setItem(arrayOfLines[i * 2 + 1], arrayOfLines[i * 2 + 2]);
                }
                reading = 0;
            }


            document.getElementById('cad').onload = function() {

                window.addEventListener("load", function(){
                    readSingleFile();
                    document.getElementById('cad').src = "../../../../../SchematicEditor/?id={!!$schematiccreatorlayout->id!!}";
                });
            };





        </script>



    </section>
@endsection
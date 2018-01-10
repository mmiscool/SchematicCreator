<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index');

//schematiccreatorsymbol Routes
Route::group(['middleware'=> 'web'],function(){
  Route::resource('schematiccreatorsymbol','\App\Http\Controllers\SchematiccreatorsymbolController');
  Route::post('schematiccreatorsymbol/{id}/update','\App\Http\Controllers\SchematiccreatorsymbolController@update');
  Route::get('schematiccreatorsymbol/{id}/delete','\App\Http\Controllers\SchematiccreatorsymbolController@destroy');
  Route::get('schematiccreatorsymbol/{id}/deleteMsg','\App\Http\Controllers\SchematiccreatorsymbolController@DeleteMsg');
});

//schematiccreatorlayout Routes
Route::group(['middleware'=> 'web'],function(){
  Route::resource('schematiccreatorlayout','\App\Http\Controllers\SchematiccreatorlayoutController');
  Route::post('schematiccreatorlayout/{id}/update','\App\Http\Controllers\SchematiccreatorlayoutController@update');
  Route::get('schematiccreatorlayout/{id}/delete','\App\Http\Controllers\SchematiccreatorlayoutController@destroy');
  Route::get('schematiccreatorlayout/{id}/deleteMsg','\App\Http\Controllers\SchematiccreatorlayoutController@DeleteMsg');
});

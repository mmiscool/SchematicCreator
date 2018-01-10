<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * Class Schematiccreatorsymbols.
 *
 * @author  The scaffold-interface created at 2018-01-09 10:44:51pm
 * @link  https://github.com/amranidev/scaffold-interface
 */
class Schematiccreatorsymbols extends Migration
{
    /**
     * Run the migrations.
     *
     * @return  void
     */
    public function up()
    {
        Schema::create('schematiccreatorsymbols',function (Blueprint $table){

        $table->increments('id');
        
        $table->String('name');
        
        $table->longText('symbolData');
        
        $table->longText('Description');
        
        $table->longText('ExtraAtributes');
        
        /**
         * Foreignkeys section
         */
        
        
        
        // type your addition here

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return  void
     */
    public function down()
    {
        Schema::drop('schematiccreatorsymbols');
    }
}

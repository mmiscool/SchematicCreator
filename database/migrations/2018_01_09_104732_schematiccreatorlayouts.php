<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * Class Schematiccreatorlayouts.
 *
 * @author  The scaffold-interface created at 2018-01-09 10:47:32pm
 * @link  https://github.com/amranidev/scaffold-interface
 */
class Schematiccreatorlayouts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return  void
     */
    public function up()
    {
        Schema::create('schematiccreatorlayouts',function (Blueprint $table){

        $table->increments('id');
        
        $table->String('Name');
        
        $table->longText('Description');
        
        $table->longText('LayoutData');
        
        /**
         * Foreignkeys section
         */
        
        
        $table->timestamps();
        
        
        $table->softDeletes();
        
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
        Schema::drop('schematiccreatorlayouts');
    }
}

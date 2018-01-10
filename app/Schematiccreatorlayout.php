<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Schematiccreatorlayout.
 *
 * @author  The scaffold-interface created at 2018-01-09 10:47:32pm
 * @link  https://github.com/amranidev/scaffold-interface
 */
class Schematiccreatorlayout extends Model
{
	
	use SoftDeletes;

	protected $dates = ['deleted_at'];
    
	
    protected $table = 'schematiccreatorlayouts';

	
}

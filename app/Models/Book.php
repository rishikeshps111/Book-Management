<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Book
 * 
 * @property int $id
 * @property string $title
 * @property string $author
 * @property int $publication_year
 * @property string $genre
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Book extends Model
{
	protected $table = 'books';

	protected $casts = [
		'publication_year' => 'int'
	];

	protected $fillable = [
		'title',
		'author',
		'publication_year',
		'genre'
	];
}

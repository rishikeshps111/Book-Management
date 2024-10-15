<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        return view('booklist');
    }

    public function list($year = null)
    {
        $query = Book::query();

        // Check if the year is provided via the route
        if ($year) {
            $query->where('publication_year', $year);
        }

        $books = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }

    public function info($id)
    {
        $book = Book::find($id);

        return response()->json([
            'success' => true,
            'data' => $book
        ]);
    }


    public function add(Request $request)
    {

        $book_id = Book::insertGetId([
            'title' =>  $request->title,
            'author' =>  $request->author,
            'publication_year' =>  $request->publication_year,
            'genre' =>  $request->genre,
        ]);

        $response = [
            'success' => true,
            'message' => 'Book added successfully!',
            'book_id' => $book_id,
        ];

        return response()->json($response, 200);
    }

    public function edit(Request $request, $id)
    {
        $book = Book::find($id);
        $book->update([
            'title' =>  $request->title,
            'author' =>  $request->author,
            'publication_year' =>  $request->publication_year,
            'genre' =>  $request->genre,
        ]);

        $response = [
            'success' => true,
            'message' => 'Book added successfully!',
            'book_id' => $book->id,
        ];

        return response()->json($response, 200);
    }

    public function delete($id)
    {
        $record = Book::find($id);
        $record->delete();

        return response()->json([
            'success' => true,
            'message' => 'Book deleted successfully!'
        ]);
    }
}

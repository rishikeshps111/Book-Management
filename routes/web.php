<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;



Route::controller(BookController::class)->group(function () {

    Route::get("/", "index")->name("IndexView");
    Route::get("list/{year?}", "list")->name("ListBook");
    Route::post("add", "add")->name("AddBook");
    Route::post("edit/{id}", "edit")->name("EdidBook");
    Route::get("info/{id}", "info")->name("BookInfo");
    Route::post("delete/{id}", "delete")->name("DeleteInfo");
});

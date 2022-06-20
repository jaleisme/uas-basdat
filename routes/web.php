<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [DashboardController::class, 'index']);
Route::post('/monthlyOrder', [DashboardController::class, 'monthlyOrder']);
Route::post('/weeklyOrder', [DashboardController::class, 'weeklyOrder']);
Route::post('/dailyBest', [DashboardController::class, 'dailyBest']);
Route::post('/monthlyBest', [DashboardController::class, 'monthlyBest']);

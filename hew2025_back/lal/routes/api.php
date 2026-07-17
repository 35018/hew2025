<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DBController;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ユーザー
// 取得
Route::get('/users',[DBController::class,'get_users']);
// email重複確認
Route::post('/email',[DBController::class,'user_email']);
// 追加
Route::post('/users',[DBController::class,'add_user']);
// ログイン
Route::post('/login',[DBController::class,'login']);
// アップデート
Route::post('/user/update',[DBController::class,'update_user']);
// 単体取得
Route::get('/user/{user_id}',[DBController::class,'get_user']);

// 変更

// カテゴリ取得
Route::get('/category',[DBController::class,'get_allcategory']);
// 親カテゴリの取得
Route::get('/p_category',[DBController::class,'get_Pcategory']);

// アドレス
// idから1件
Route::get('/address/{address_id}',[DBController::class,'get_address']);
// 全件取得
Route::get('/address',[DBController::class,'get_alladdress']);
// 検索
Route::get('/address/search/{keyword}',[DBController::class,'search_address']);

// 作成
Route::post('/address',[DBController::class,'new_address']);

// リンク
Route::get('/links',[DBController::class,'get_links']);
Route::post('/links',[DBController::class,'create_links']);
Route::post('/link_id',[DBController::class,'get_link_id']);


// オブジェクト
// list用取得
Route::get('/objects/list',[DBController::class,'get_objects_list']);
// list-カテゴリ検索
Route::get('objects/category/{category_id}',[DBController::class,'get_objects_bycat']);
// detail用一件取得
Route::get('/objects/{object_id}',[DBController::class,'get_objects_detail']);


// 全件取得
Route::get('/objects',[DBController::class,'get_objects']);

// 検索
Route::get('/objects/search/{target}/{keyword}',[DBController::class,'get_objects_search']);
// 作成
Route::post('/objects',[DBController::class,'new_objects']);

// イベント
// detail用一件取得
Route::get('/events/{event_id}',[DBController::class,'get_events_detail']);
// 全件取得
Route::get('/events',[DBController::class,'get_events']);
// Monthry用
Route::get('/events/user/{user_id}',[DBController::class,'get_monthly']);
// 一覧用
Route::get('/events/list/{user_id}',[DBController::class,'get_events_list']);

// 一覧_検索設定
Route::get('/events/search/{user_id}/{target}/{category_id}',[DBController::class,'get_events_search']);
// カテゴリ検索
Route::get('/events/category/{user_id}/{category_id}',[DBController::class,'get_events_bycat']);
// 日付の過ぎたイベント
Route::get('/events/old/{user_id}',[DBController::class,'get_oldevents']);
// 場所名検索
Route::get('/events/place/{user_id}/{keyword}',[DBController::class,'get_event_byplace']);

// 子イベント取得
Route::get('/events/child/{event_id}',[DBController::class,'get_events_child']);

// 作成
Route::post('/events',[DBController::class,'new_event']);
// 更新
Route::post('/events/update',[DBController::class,'update_event']);
// 削除
Route::delete('/events/{event_id}',[DBController::class,'delete_event']);


// event_category
// 確認
Route::get('/event_category/{event_id}',[DBController::class,'get_event_category']);
// 登録
Route::post('/event_category',[DBController::class,'create_event_category']);
// 削除
Route::delete('event_category/{event}/{category_name}',[DBController::class,'delete_event_category']);

// event_link
// 確認
Route::get('event_link/{event}',[DBController::class,'get_event_link']);
// 登録
Route::post('event_link',[DBController::class,'create_event_link']);
// 削除
Route::delete('event_link/{event}/{url}',[DBController::class,'delete_event_link']);

Route::get('reset',[DBController::class,'reset']);
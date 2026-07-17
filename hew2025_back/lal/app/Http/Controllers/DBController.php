<?php
namespace App\Http\Controllers;

use DateTime;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use SebastianBergmann\CodeCoverage\Filter;

class DBController extends controller{

    // ユーザー
    public function get_users(){
        return(DB::table('users')->get());
    }
    // ログイン 返り値がデータならログイン成功、falseならログイン失敗
    public function login(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');
        try{
            $target = DB::table('users')->where('email',$email)->first();
            
            if($target->password == $password){
                $return =[
                    'id'=>$target->user_id,
                    'name'=>$target->user_name
                ];
                return($return);
            }
        }catch(Exception $e){
            // echo($e->getMessage());
            return("false");
        }
        return("false");
    }
    
    // email重複確認
    public function user_email(Request $request){
        if(DB::table('users')->where('email',$request->input("email"))->exists()){
            $get = "true";
        }else{
            $get = "not found";
        }
        return($get);
    }

    // ユーザー登録
    public function add_user(Request $request){
        $user_name = $request->input('user_name');
        $email = $request->input('email');
        $password = $request->input('password');
        $birthday = $request->input('bitrhday');


        $id = DB::table('users')->insertGetId([
            'user_name'=>$user_name,
            'email'=>$email,
            'password'=>$password,
            'birthday'=>$birthday
        ],'user_id');
        // $id=1;
        $ret = [
            $user_name,
            $id
        ];

        return($ret);


    }

    // ユーザー情報アップデート
    public function update_user(Request $request){
        $user_id = $request->input('user_id');
        $user_name = $request->input('user_name');
        $email = $request->input('email');
        $password = $request->input('password');
        $birthday = $request->input('birthday');

        DB::table('users')->where('user_id',$user_id)->update([
            'user_name'=>$user_name,
            'email'=>$email,
            'password'=>$password,
            'birthday'=>$birthday
        ]);
        return(DB::table('users')->where('user_id',$user_id)->first());
    }

    // ユーザー情報単体取得
    public function get_user($user_id){
        return(DB::table('users')->where('user_id',$user_id)->first());
    }

    // カテゴリ情報取得
    public function get_allcategory(){
        $val = DB::table('category')->get();
        return($val);
    }
    
    public function get_Pcategory(){
        return(DB::table('category')->whereNull('p_categoryid')->get());
    }
    // カテゴリ登録
    public function add_category(Request $request){
        $category_name = $request->input('category_name');
        $parent = $request->input('p_categooryid');
        DB::table('category')->insert(
            [
                'category_name'=>$category_name,
                'p_categoryid'=>$parent
            ]
            );
            return($category_name."を追加しました");
    }

    // アドレス
    // アドレス取得
    public function get_alladdress(){
        return(DB::table('address')->get());
    }
    // アドレス追加
    public function new_address(Request $request){
        $name = $request->input('name');
        $address = $request->input('address');
        $ex = $request->input('ex');
        DB::table('address')->insert(
            [
                'place_name'=>$name,
                'address'=>$address,
                'explanatory'=>$ex
            ]
            );
        return('aaddress');
    }

    public function get_address($address_id){
        $get = DB::table('address')->where('address_id',$address_id)->first();
        return($get->place_name);
    }

    // フリーワード検索
    public function search_address(Request $request,$keyword){
        $words = preg_split("[/[\s ]+/u",trim($keyword));
        $search = array_values(array_filter($words, fn ($w) => $w !== ''));

        $escape = fn (string $v)=>addcslashes($v,"\\%_");
        $escWords = array_map($escape,$search);

        $select = $request->input("target");
        if($select == "address"){
            $return = DB::table('address')->whereLike("address",$escWords)->get();
        }else{
            $return = DB::table('address')->whereLike("place_name",$escWords)->get();
        }
        return($return);



    }

    // リンク
    // リンク取得
    public function get_links(){
        return(DB::table('links')->get());
    }
    // リンク作成
    public function create_links(Request $request){
        $url = $request->input('url');
        $create_user = 1;
        if(DB::table('links')->where('url',$url)->exists()){
            $urlid = DB::table('links')->where('url',$url)->value('link_id');
        }else{
                $urlid = DB::table('links')->insertGetId([
                'url' =>$url,
                'create_user' =>$create_user

            ],'link_id');
        }

        return($urlid);
    }

    // urlからリンクIDを取得
    public function get_link_id(Request $request){
        $url = $request->input('url');
        $data = DB::table('links')->where('url',$url)->value('link_id');
        return($data);
    }

    // オブジェクト
    // オブジェクト取得
    public function get_objects(){
        return(DB::table('objects')->get());
    }
    // リスト用
    public function get_objects_list(){
        
    $date = date('Y/m/d');
    $objects = DB::table('objects')->where('close_date',">=",$date)->orderBy('open_date')->get();
    $object_list = $objects->map(function($object){
        $categories = DB::table('object_category')->where('object_id',$object->object_id)->get();
        $catstr = $categories->map(function($category){
            return[
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
            ];
        });
        $address = DB::table('address')->where('address_id',$object->address)->value('place_name');
        return[
            'id' => $object->object_id,
            'title' =>$object->name,
            'start' =>$object->open_date,
            'end' =>$object->close_date,
            'category'=>$catstr,
            'address' =>$address
            
        ];
    })->toArray();
    return($object_list);
    }

    // カテゴリ用
    public function get_objects_bycat($category_id){
        $date = date('Y/m/d');
        $objects = DB::table('objects')->where('close_date',">=",$date)->get();
        if($category_id == "0"){
           $object_list = $objects->map(function($object){
                if(DB::table('object_category')->where('object_id',$object->object_id)->doesntExist()){
                $address = DB::table('address')->where('address_id',$object->address)->value('place_name');
                return[
                    'id' => $object->object_id,
                    'title' =>$object->name,
                    'start' =>$object->open_date,
                    'end' =>$object->close_date,
                    'category'=>"",
                    'address' =>$address
                    
                ];
                }
            })->filter()->values();
        }else{
        $category_name = DB::table('category')->where('category_id',$category_id)->value('category_name');
            $object_list = $objects->map(function($object)use($category_name){
                $categories = DB::table('object_category')->where('object_id',$object->object_id)->get();
                $catstr = $categories->map(function($category){
                    return(
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
                    );
                })->toArray();
                if(in_array($category_name,$catstr)){
                    $address = DB::table('address')->where('address_id',$object->address)->value('place_name');
                    return[
                        'id' => $object->object_id,
                        'title' =>$object->name,
                        'start' =>$object->open_date,
                        'end' =>$object->close_date,
                        'category'=>$catstr,
                        'address' =>$address
                        
                    ];
                }
            })->filter()->values();
        }
        return($object_list->toArray());

    }
    // 検索用
    public function get_objects_search($target,$keyword){
        $date = date('Y/m/d');
        $word = '%'.trim($keyword).'%';
        if($target == "name"){
            // 名称検索
            $objects = DB::table('objects')->where('close_date',">=",$date)->where('name','like',"%".$keyword."%")->get();
        }else if($target == "place"){
            // 場所名検索
            $places = DB::table('address')->where('place_name','like',$word)->get();
            $objects = $places->map(function($place)use($date){
                return(DB::table('objects')->where('close_date',">=",$date)->where('address',$place->address_id)->get());
            })->collapse();
        }else{
            // 住所検索
            $addresses = DB::table('address')->where('address','like',$word)->get();
            $objects = $addresses->map(function($address)use($date){
                return(DB::table('objects')->where('close_date',">=",$date)->where('address',$address->address_id)->get());
            })->collapse();
                
        }

        // object加工
        $object_list = $objects->map(function($object){
            $categories = DB::table('object_category')->where('object_id',$object->object_id)->get();
        $catstr = $categories->map(function($category){
            return(
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
            );
        });
        $address = DB::table('address')->where('address_id',$object->address)->value('place_name');
        return[
            'id' => $object->object_id,
            'title' =>$object->name,
            'start' =>$object->open_date,
            'end' =>$object->close_date,
            'category'=>$catstr,
            'address' =>$address
            
        ];

        })->toArray();
        return($object_list);

    }

    // 単体取得用
    public function get_objects_detail($object_id){
        $object = DB::table('objects')->where('object_id',$object_id)->first();
        // 作成ユーザー
        $created = DB::table('users')->where('user_id',$object->create_user)->value('user_name');
        // カテゴリー
        $categories = DB::table('object_category')->where('object_id',$object->object_id)->get();
        $catstr = $categories->map(function($category){
            return[
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
            ];
        });

        // アドレス
        $address = DB::table('address')->where('address_id',$object->address)->first();
        // リンク
        $link = DB::table('links')->where('link_id',$object->official_link)->value('url');
        $object_detail = [
            'object_id'=>$object->object_id,
            'object_name'=>$object->name,
            'created'=>$created,
            'start' =>$object->open_date,
            'end' =>$object->close_date,
            'open'=>$object->open_time,
            'close'=>$object->close_time,
            'category'=>$catstr,
            'address_name'=>$address->place_name,
            'address'=>$address->address,
            'address_id'=>$object->address,
            'ex'=>$object->explanatory,
            'link_id'=>$object->official_link,
            'link'=>$link


        ];
        return($object_detail);
    }

    

    // オブジェクト登録
    public function new_objects(Request $request){
        $create_user = $request->input('create_user');
        $object_name = $request->input('object_name');
        $open_date = $request->input('open_date');
        $close_date = $request->input('close_date');
        $start_time =  $request->input('start_time');
        $end_time =  $request->input('end_time');
        $url = $request->input('url');
        $address = $request->input('address');
        $ex = $request->input('explanatory');
        $category = $request->input('category');

        if(DB::table('links')->where('url',$url)->exists()){
            $urlid = DB::table('links')->where('url',$url)->value('link_id');
        }else{
                $urlid = DB::table('links')->insertGetId([
                'url' =>$url,
                'create_user' =>$create_user

            ],'link_id');
        }

        

        try{
        $newid = DB::table('objects')->insertGetId(
            [
                'create_user'=>$create_user,
                'name'=>$object_name,
                'open_date'=>$open_date,
                'close_date'=>$close_date,
                'open_time'=>$start_time,
                'close_time'=>$end_time,
                'official_link'=>$urlid,
                'address'=>$address,
                'explanatory'=>$ex
            ]

            ,'object_id');
            DB::table('object_category')->insert([
                'object_id'=>$newid,
                'category_id'=>$category
            ]);
            return('add_complete');


        }catch(Exception $e){
            return($e->getMessage());
        }

    }

    // イベント
    // イベント取得
    public function get_events(){
        return(DB::table('events')->get());
    }
    // カレンダーページ用
    public function get_monthly($user_id){
        $events = DB::table('events')->where('create_user',$user_id)->get();
        $event_list = $events->map(function($event){
            // if()で親子分岐でカラー指定
            if($event->parent_event == null){
                $color = "oklch(43.7% 0.078 188.216/70%)";
            }else{
                $color = "oklch(77.7% 0.152 181.912/70%)";
            }
            
            return[
                'id'=>$event->event_id,
                'title' =>$event->event_name,
                'start' =>$event->open_date,
                'end' =>$event->close_date,
                'color' =>$color
            ];
        })->toArray();
        return($event_list);
    }

    // イベント一覧用
    public function get_events_list($user_id){
        
    $date = date('Y/m/d H:i:s');
    $events = DB::table('events')->where('create_user',$user_id)->where("close_date",">",$date)->whereNull('parent_event')->orderBy('parent_event')->orderBy('open_date')->get();
    $event_list = $events->map(function($event){
        $categories = DB::table('event_category')->where('event_id',$event->event_id)->get();
        $catstr = $categories->map(function($category){
            return(
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
            );
        });
        return[
            'id' => $event->event_id,
            'title' =>$event->event_name,
            'start' =>$event->open_date,
            'end' =>$event->close_date,
            'category'=>$catstr,
            'address' =>$event->address_name,
            'parent'=>$event->parent_event
            
        ];
    })->toArray();
    return($event_list);
    }
    // イベント一覧-カテゴリ検索
    
    public function get_events_bycat($user_id,$category_id){
    $date = date('Y/m/d H:i:s');

    if($category_id == "0"){
        $events = DB::table('events')->where('create_user',$user_id)->where("close_date",">",$date)->whereNull('parent_event')->orderBy('open_date')->get();
        $event_list = $events->map(function ($event) {
            if(DB::table('event_category')->where('event_id',$event->event_id)->doesntExist()){
                return[
                    'id' => $event->event_id,
                    'title' =>$event->event_name,
                    'start' =>$event->open_date,
                    'end' =>$event->close_date,
                    'category'=>"",
                    'address' =>$event->address_name,
                    'parent'=>$event->parent_event
                    
                ];
            }
        })->filter();
    }
    else{
        $category_name = DB::table('category')->where('category_id',$category_id)->value('category_name');
        $events = DB::table('events')->where('create_user',$user_id)->whereNull('parent_event')->orderBy('open_date')->get();
        $event_list = $events->map(function($event)use($category_name){
            $categories = DB::table('event_category')->where('event_id',$event->event_id)->get();
            $catstr = $categories->map(function($category) {

                return(
                    DB::table('category')->where('category_id',$category->category_id)->value('category_name')
            );
                

            })->toArray();
            if(in_array($category_name,$catstr)){
            return[
                'id' => $event->event_id,
                'title' =>$event->event_name,
                'start' =>$event->open_date,
                'end' =>$event->close_date,
                'category'=>$catstr,
                'address' =>$event->address_name,
                'parent'=>$event->parent_event
                
            ];

            }
            
        })->filter();

    }
    return($event_list->values()->toArray());
    }
    // 検索用
    public function get_events_search($user_id,$target,$keyword){
        $date = date('Y/m/d H:i:s');
        $date = ('2020/10/10 00:00:00');
        $word = '%'.trim($keyword).'%';
        if($target == 'name'){
            // 名称検索
            $events = DB::table('events')->where('create_user',$user_id)->where("close_date",">",$date)->where('event_name','like',$word)->whereNull('parent_event')->orderBy('parent_event')->orderBy('open_date')->get();
        }else if($target == 'place'){
            // 場所名検索
            $events = DB::table('events')->where('create_user',$user_id)->where("close_date",">",$date)->where('close_date',">=",$date)->where('address_name','like',$word)->whereNull('parent_event')->orderBy('parent_event')->orderBy('open_date')->get();

        }else{
            // 住所検索
            $events = DB::table('events')->where('create_user',$user_id)->where("close_date",">",$date)->where('close_date',">=",$date)->where('address_place','like',$word)->whereNull('parent_event')->orderBy('parent_event')->orderBy('open_date')->get();

        }

        $event_list = $events->map(function($event){
            $categories = DB::table('event_category')->where('event_id',$event->event_id)->get();
            $catstr = $categories->map(function($category){
                return(
                    DB::table('category')->where('category_id',$category->category_id)->value('category_name')
                );
            });
            return[
                'id' => $event->event_id,
                'title' =>$event->event_name,
                'start' =>$event->open_date,
                'end' =>$event->close_date,
                'category'=>$catstr,
                'address' =>$event->address_name,
                'parent'=>$event->parent_event
                
            ];
        })->toArray();
        return($event_list);
    }

    // 過去イベント
        // イベント一覧用
    public function get_oldevents($user_id){
        $date = date('Y/m/d H:i:s');
    $events = DB::table('events')->where('create_user',$user_id)->where('close_date',"<=",$date)->orderBy('parent_event')->orderBy('open_date')->get();
    $event_list = $events->map(function($event){
        $categories = DB::table('event_category')->where('event_id',$event->event_id)->get();
        $catstr = $categories->map(function($category){
            return(
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
            );
        });
        $open_datetime = new DateTime($event->open_date);
        $open = $open_datetime->format('Y年m月d日');
        
        $close_datetime = new DateTime($event->close_date);
        $close = $close_datetime->format('Y年m月d日');
        return[
            'id' => $event->event_id,
            'title' =>$event->event_name,
            'start' =>$open,
            'end' =>$close,
            'category'=>$catstr,
            'address' =>$event->address_name,
            'parent'=>$event->parent_event
            
        ];
    })->toArray();
    return($event_list);
    }


    // 子イベント取得
    public function get_events_child($event_id){
        $check = DB::table('events')->where('parent_event',$event_id)->exists();
        if($check==true){
            $list = DB::table('events')->where('parent_event',$event_id)->get();
            $childs = $list->map(function($event){
        $categories = DB::table('event_category')->where('event_id',$event->event_id)->get();
        $catstr = $categories->map(function($category){
            return[
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
            ];
        });
        return[
            'id' => $event->event_id,
            'title' =>$event->event_name,
            'start' =>$event->open_date,
            'end' =>$event->close_date,
            'category'=>$catstr,
            'address' =>$event->address_name
            
        ];
            })->toArray();
        return($childs);
        
        }
        else{
            return("not found");
        }
    }


    // 単体取得
    public function get_events_detail($event_id){
        $event = DB::table('events')->where('event_id',$event_id)->first();
                // 作成ユーザー
        $created = DB::table('users')->where('user_id',$event->create_user)->value('user_name');

        $categories = DB::table('event_category')->where('event_id',$event->event_id)->get();
        $catstr = $categories->map(function($category){
            return(
                DB::table('category')->where('category_id',$category->category_id)->value('category_name'))
            ;
        });
        // リンク　
        $urlIds = DB::table('event_link')->where('event_id',$event->event_id)->get();
        $urls = $urlIds->map(function($urls){
            // return(DB::table('links')->where('link_id',$urls->link_id)->value('url'));
            $data = DB::table('links')->where('link_id',$urls->link_id)->value('url');
            return[
                'id'=>$urls->link_id,
                "title"=>trim($urls->title),
                'url'=>$data
            ];

        });
        // 子イベント
        $c_list = DB::table('events')->where('parent_event',$event_id)->count();
        $event_detail=[
            'event_id'=>$event->event_id,
            'title'=>$event->event_name,
            'create_user'=>$created,
            'parent_event'=>$event->parent_event,
            'open_date' => mb_substr($event->open_date,0,10),
            'close_date' =>mb_substr($event->close_date,0,10),
            'start_time'=>$event->start_time,
            'end_time'=>$event->end_time,
            'place'=>$event->address_name,
            'address'=>$event->address_place,
            'ex'=>$event->explanatory,
            'category'=>$catstr,
            'url'=>$urls,
            'child'=>$c_list

        ];


        return($event_detail);
    }

    // イベント作成
    public function new_event(Request $request){
        $create_user = $request->input('create_user');
        $parent_event = $request->input('parent_event');
        $event_name = $request->input('event_name');
        $open_date = $request->input('open_date');
        $close_date = $request->input('close_date');
        $start_time = $request->input('start_time');
        $end_time = $request->input('end_time');
        $address_name = $request->input('address_name');
        $address_place = $request->input('address_place');
        $explanatory = $request->input('explanatory');
        $link_name = $request->input('link_name');
        $url = $request->input('url');
        $category = $request->input('category');
        
        $create_event = DB::table('events')->insertGetId([
            'create_user'=>$create_user,
            'parent_event'=>$parent_event,
            'event_name'=>$event_name,
            'open_date'=>$open_date,
            'close_date'=>$close_date,
            'start_time'=>$start_time,
            'end_time'=>$end_time,
            'address_name'=>$address_name,
            'address_place'=>$address_place,
            'explanatory'=>$explanatory
        ],'event_id');

        // URL判定をしてリンク検索または作成 判定はフロントでやる
        // 空欄判定
        if(!empty($url)){
            if( DB::table('links')->where('url',$url)->exists()){
                $urlid = DB::table('links')->where('url',$url)->value('link_id');
            }else{
                    $urlid = DB::table('links')->insertGetId([
                    'url' =>$url,
                    'create_user' =>$create_user

                ],'link_id');
            }
                DB::table('event_link')->insert([
                'event_id'=>$create_event,
                'link_id'=>$urlid,
                'title'=>$link_name
            ]);
        }
        // デフォルトカテゴリ作成
        if($category != "0"){
            DB::table('event_category')->insert(
                [
                    'event_id'=>$create_event,
                    'category_id'=>$category
                ]
            );
        }
        return('add_complete');
    }

    // イベント更新
    public function update_event(Request $request){
        $id = $request->input('id');
            DB::table('events')->where('event_id',$id)->update([
                'event_name'=>$request->input('event_name'),
                'open_date'=>$request->input('open_date'),
                'close_date'=>$request->input('close_date'),
                'start_time'=>$request->input('start_time'),
                'end_time'=>$request->input('end_time'),
                'address_name'=>$request->input('address_name'),
                'address_place'=>$request->input('address_place'),
                'explanatory'=>$request->input('ex')
            ]);
        return("event_update");
    }

    // イベント削除
    public function delete_event($event_id){
        if(DB::table('events')->where("parent_event",$event_id)->exists()){
            $childs =DB::table('events')->where("parent_event",$event_id)->get();
            $childs->map(function($child){
                $child_event_url = DB::table('event_link')->where('event_id',$child->event_id);
                if($child_event_url->count() > 0){
                    $child_event_url->delete();
                }
                $child_event_category = DB::table('event_category')->where('event_id',$child->event_id);
                if($child_event_category->count() >0){
                    $child_event_category->delete();
                }
                DB::table('events')->where('event_id',$child->event_id)->delete();
                    });
            }

        $event_url = DB::table('event_link')->where('event_id',$event_id);
        if($event_url->count() > 0){
            $event_url->delete();
        }
        $event_category = DB::table('event_category')->where('event_id',$event_id);
        if($event_category->count() >0){
            $event_category->delete();
        }
        DB::table('events')->where('event_id',$event_id)->delete();
        return('deleted');
    }

    // リセット
    public function reset(){
        $reset_id = 43;
        $reset_url = DB::table('event_link')->where('event_id','>=',$reset_id);
        $reset_url->map(function($target_url){
            if($target_url->count()>0){
                $target_url->delete();
            }
        });
        $reset_category = DB::table('event_category')->where('event_id','>=',$reset_id);
        $reset_category->map(function($target_cat){
            if($target_cat->count()>0){
                $target_cat->delete();
            }
        });
        DB::table('events')->where('event_id','>=',$reset_id)->delete();
        return('deleted');
    }

    // 中間テーブル操作
    

    // イベント-カテゴリ
    // 取得
    public function get_event_category($event_id){
        $categories = DB::table('event_category')->where('event_id',$event_id)->get();

        $catstr = $categories->map(function($category){
            return(
                DB::table('category')->where('category_id',$category->category_id)->value('category_name')
        );
        });

        return($catstr);
    }

    // 作成
    public function create_event_category(Request $request){
        $event = $request->input('id');
        $category = $request->input('category');
        $check = DB::table('event_category')->where('event_id',$event)->where('category_id',$category)->exists();
        if($check == false){
            DB::table('event_category')->insert([
            'event_id'=>$event,
            'category_id'=>$category
        ]);
        }


        $new_categories = DB::table('event_category')->where('event_id',$event)->get();
        $catstr = $new_categories->map(function($cat){
            return(
                DB::table('category')->where('category_id',$cat->category_id)->value('category_name')
        );
        });
        return($catstr);

    }

    // 削除
    public function delete_event_category($event, $category_name){
        $category = DB::table('category')->where('category_name',$category_name)->value('category_id');
        DB::table('event_category')->where('event_id',$event)->where('category_id',$category)->delete();

        $new_categories = DB::table('event_category')->where('event_id',$event)->get();
        $catstr = $new_categories->map(function($cat){
            return(
                DB::table('category')->where('category_id',$cat->category_id)->value('category_name')
            );
        });

        return($catstr);

    }
    // イベント-リンク
    // 取得
    public function get_event_link($event_id){
        $id_list = DB::table('event_link')->where('event_id',$event_id)->get();
        $urls = $id_list->map(function($id){
            $url = DB::table('links')->where('link_id',$id->link_id)->value('url');
            return[
                'id'=>$id->link_id,
                'title'=>trim($id->title),
                'url'=>$url
            ];
        });
        return($urls);
    }
    // 作成
    public function create_event_link(Request $request){
        $event = $request->input('id');
        $link = $request->input('link');
        $title = $request->input('title');
        if(DB::table('links')->where('url',$link)->exists()){
            $link_id = DB::table('links')->where('url',$link)->value('link_id');
        }else{
            $link_id = DB::table('links')->insertGetId([
                'url'=>$link,
            ],'link_id');
        }

        DB::table('event_link')->insert([
            'event_id'=>$event,
            'link_id'=>$link_id,
            'title'=>$title
        ]);

        $new_links = DB::table('event_link')->where('event_id',$event)->get();
        $urls = $new_links->map(function($link){
            $url = DB::table('links')->where('link_id',$link->link_id)->value('url');
            return[
                'id'=>$link->link_id,
                'title'=>trim($link->title),
                'url'=>$url
            ];
        });
        return($urls);

    }

    // 削除
    public function delete_event_link($event,$url){
        DB::table('event_link')->where('event_id',$event)->where('link_id',$url)->delete();
        $new_links = DB::table('event_link')->where('event_id',$event)->get();
        $urls = $new_links->map(function($link){
            $url = DB::table('links')->where('link_id',$link->link_id)->value('url');
            return[
                'id'=>$link->link_id,
                'title'=>trim($link->title),
                'url'=>$url
            ];
        });
        return($urls);
    }
    

    
    
}

?>
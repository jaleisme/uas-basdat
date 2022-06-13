<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(){
        $weekly_order = DB::table('orders')
            ->select(DB::raw("COUNT(orderID) as totalOrder"))
            ->whereBetween('orderDate', ['2021-11-01', '2021-12-01'])
            // ->groupBy(DB::raw("CONCAT(MONTH(orderDate), '/', WEEK(orderDate)"))
            ->get()->toArray();
        dd($weekly_order);
        // return view('welcome');
    }

    public function monthlyOrder(Request $request){
        // dd($request);
        for($month = 1; $month < 13; $month++){
            $temp = DB::table('orders')
                ->select(DB::raw('COUNT(orderID) AS totalOrder'))
                ->whereBetween('orderDate', [$request->year.'-'.$month.'-01', $request->year.'-'.($month+1).'-01'])
                ->groupBy(DB::raw("CAST(YEAR(orderDate) AS VARCHAR(4)) + '-' + right('00' + CAST(MONTH(orderDate) AS VARCHAR(2)), 2)"))
                ->get()->toArray();
            if($temp == null){
                $temp = 0;
            } else {
                $temp = head($temp);
                $temp = json_decode(json_encode($temp), true);
                $temp = $temp["totalOrder"];
            }
            $monthly_order[] = $temp;
        }
        return response(json_encode($monthly_order));
    }
}

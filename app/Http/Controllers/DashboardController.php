<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function weeklyOrder(Request $request){
        // Request processing
        $date = explode("-", $request->month);

        //Filter Gonna Be
        $selected_year = $date[0];
        $selected_month = $date[1];
        $selected_day = $date[2];

        //Creating range date
        $weeks_start = [];
        $weekly_orders = [];
        $temp_start = 0;
        
        $from_date = new Carbon($selected_year.'-'.$selected_month.'-'.$selected_day);
        // $from_date = $from_date->startOfWeek()->format('Y-m-d H:i');
        $until_date = new Carbon($selected_year.'-'.$selected_month.'-'.$selected_day);
        $until_date = $until_date->endOfMonth();

        //Getting total days of month
        $total_days = $from_date->diffInDays($until_date);

        for($i = 1; $i <= $total_days; $i++){
            $date_loop = new Carbon($selected_year.'-'.$selected_month.'-'.$i);
            $temp_start = $date_loop->startOfWeek()->format('d');
            if(count($weeks_start) == 0){
                $weeks_start[] = $temp_start;
            }
            else{
                if(end($weeks_start) != $temp_start){
                    $weeks_start[] = $temp_start;
                }
            }
        }

        //Getting query per date
        foreach ($weeks_start as $key => $start) {
            $weekly_orders["dates"][] = $selected_year.'-'.$selected_month.'-'.$start;
            $query = DB::table('orders')
            ->select(DB::raw("COUNT(orderID) as totalOrder"))
            ->whereBetween('orderDate', [$selected_year.'-'.$selected_month.'-'.$start, $selected_year.'-'.$selected_month.'-'.($start+6)])
            ->first();
            $weekly_orders["totalOrder"][] = $query->totalOrder;
        }
        return response(json_encode($weekly_orders));
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

    public function dailyBest(Request $request){
        $date = $request->date;
        $query = DB::table('orders')
            ->select('orderDate', 'products.productID', 'products.productName', DB::raw('SUM(quantity) AS total'))
            ->leftJoin('order_details', 'orders.orderID', 'order_details.orderID')
            ->leftJoin('products', 'order_details.productId', 'products.productID')
            ->where('orderDate', $date)
            ->groupBy('products.productID')
            ->orderBy('total', 'DESC')
            ->limit(10)
            ->get();
        $dailybest = [];
        foreach($query as $q){
            $dailybest["labels"][] = $q->productName;
            $dailybest["values"][] = $q->total;
        }
        return json_encode($dailybest);
    }

    public function monthlyBest(Request $request){
        ($request->date) ? $date = $request->date : $date = '2022-01-01';
        $date = explode("-", $date);

        //Filter Gonna Be
        $selected_year = $date[0];
        $selected_month = $date[1];
        $selected_day = $date[2];
        $query = DB::table('orders')
            ->select('orderDate', 'products.productID', 'products.productName', DB::raw('SUM(quantity) AS total'))
            ->leftJoin('order_details', 'orders.orderID', 'order_details.orderID')
            ->leftJoin('products', 'order_details.productId', 'products.productID')
            ->whereBetween('orderDate', [$selected_year.'-'.$selected_month.'-'.$selected_day, $selected_year.'-'.$selected_month.'-'.($selected_day+30)])
            ->groupBy('products.productID')
            ->orderBy('total', 'DESC')
            ->limit(10)
            ->get();
        $monthlybest = [];
        foreach($query as $q){
            $monthlybest["labels"][] = $q->productName;
            $monthlybest["values"][] = $q->total;
        }
        return json_encode($monthlybest);
    }

    public function index(Request $request){

        return view('welcome');
    }
}

Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
let weekly_order_request = [];

$(document).ready(function(){
    $("#monthEarning").val($("#today").val())
    // console.log($("#monthEarning").val())
    loadWeeklyChart();
})

$("#monthEarning").change(function () {
    loadWeeklyChart()     
});

function loadWeeklyChart(){
    $.ajax({
        type: "POST",
        url: '/weeklyOrder',
        data: {
            "_token": $('#csrf').val(),
            "month": $('#monthEarning').val()
        }
    })
    .done(function(data, textStatus, jqXHR){
        // Response Processing
        weekly_order_request = []
        weekly_order_request = JSON.parse(data);
        
        // Area Chart
        var ctx2 = document.getElementById("weeklyOrder");
        var newChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: weekly_order_request.dates,
                datasets: [{
                    label: "Total Order",
                    lineTension: 0.3,
                    backgroundColor: "rgba(255, 193, 7, 0.05)",
                    borderColor: "rgba(255, 193, 7, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(255, 193, 7, 1)",
                    pointBorderColor: "rgba(255, 193, 7, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(255, 193, 7, 1)",
                    pointHoverBorderColor: "rgba(255, 193, 7, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: weekly_order_request.totalOrder,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return value;
                            }
                        },
                        gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function(tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel+': ' + tooltipItem.yLabel;
                        }
                    }
                }
            }
        });
    })
    .then(function(data){
        console.log(data);
    })
}
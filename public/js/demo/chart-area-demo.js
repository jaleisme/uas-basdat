Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
let monthly_order_request;

$(document).ready(function(){
    loadChart();
})

$("#yearEarning").change(function () {
    loadChart();       
});

function loadChart(){
    $.ajax({
        type: "POST",
        url: '/monthlyOrder',
        data: {
            "_token": $('#csrf').val(),
            "year": $('#yearEarning').val()
        }
    }).done(function(data, textStatus, jqXHR){
        // Response Processing
        monthly_order_request = data;
        monthly_order_request = monthly_order_request.split("[");
        monthly_order_request = monthly_order_request[1].split("]");
        monthly_order_request = monthly_order_request[0].split(",");
        
        // Area Chart
        var ctx = document.getElementById("monthlyOrder");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: "Total Order",
                    lineTension: 0.3,
                    backgroundColor: "rgba(66, 186, 150, 0.05)",
                    borderColor: "rgba(66, 186, 150, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(66, 186, 150, 1)",
                    pointBorderColor: "rgba(66, 186, 150, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(66, 186, 150, 1)",
                    pointHoverBorderColor: "rgba(66, 186, 150, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: monthly_order_request,
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
    });
}
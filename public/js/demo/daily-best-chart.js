// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
let dailyBestSelling = [];

$(document).ready(function(){
    $("#dailybestfilter").val($("#today").val())
    console.log($("#dailybestfilter").val())
    loadDailyBest();
})

$("#dailybestfilter").change(function () {
    console.log($("#dailybestfilter").val())
    loadDailyBest()     
});

function loadDailyBest(){
  $.ajax({
      type: "POST",
      url: '/dailyBest',
      data: {
          "_token": $('#csrf').val(),
          "date": $('#dailybestfilter').val()
      }
  })
  .done(function(data, textStatus, jqXHR){
      // Response Processing
      dailyBestSelling = []
      dailyBestSelling = JSON.parse(data);
      
      // Pie Chart
      var ctx3 = document.getElementById("dailyBestChart");
      var dailyBest = new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: dailyBestSelling.labels,
          datasets: [{
            data: dailyBestSelling.values,
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc','#4e73df', '#1cc88a', '#36b9cc','#4e73df', '#1cc88a', '#36b9cc','#4e73df'],
            hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
          }],
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
          },
          legend: {
            display: false
          },
          cutoutPercentage: 80,
        },
      });
  })
  .then(function(data){
      console.log(data);
      $('#dailybestseller').text(dailyBestSelling.labels[0]+": "+dailyBestSelling.values[0])
  })
}
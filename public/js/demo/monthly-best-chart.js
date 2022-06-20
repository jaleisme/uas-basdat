// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
let monthlyBestSelling = [];

$(document).ready(function(){
    $("#monthlybestfilter").val($("#today").val())
    console.log($("#monthlybestfilter").val())
    loadmonthlyBest();
})

$("#monthlybestfilter").change(function () {
    console.log($("#monthlybestfilter").val())
    loadmonthlyBest()     
});

function loadmonthlyBest(){
  $.ajax({
      type: "POST",
      url: '/monthlyBest',
      data: {
          "_token": $('#csrf').val(),
          "date": $('#monthlybestfilter').val()
      }
  })
  .done(function(data, textStatus, jqXHR){
      // Response Processing
      monthlyBestSelling = []
      monthlyBestSelling = JSON.parse(data);
      
      // Pie Chart
      var ctx3 = document.getElementById("monthlyBestChart");
      var monthlyBest = new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: monthlyBestSelling.labels,
          datasets: [{
            data: monthlyBestSelling.values,
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
      // console.log(monthlyBestSelling.labels[0].length);
      if(monthlyBestSelling.labels[0].length == 2){
        $('#monthlybestseller').text("No sales conducted")
      } else{
        $('#monthlybestseller').text(monthlyBestSelling.labels[0]+": "+monthlyBestSelling.values[0])
      }
  })
}
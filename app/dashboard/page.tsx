"use client";
import { useEffect } from "react"
import { Chart } from "chart.js";

// Use library https://www.chartjs.org/docs/latest/
function Dashboard() {
  useEffect(() => {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ["Đi đúng giờ", "Đi muộn"],
        datasets: [{
          data: [50,50],
          borderColor: [
            "rgb(75, 192, 192)",
            "rgb(255, 205, 86)",
          ],
          backgroundColor: [
            "rgb(75, 192, 192 )",
            "rgb(255, 205, 86)",
          ],
          borderWidth: 2,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            display: false,
          }],
          yAxes: [{
            display: false,
          }],
        }
      },

    });
    var ctx1 = document.getElementById('myChart1').getContext('2d');
    var myChart1 = new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: ["Làm đủ giờ", "Chưa làm đủ giờ"],
        datasets: [{
          data: [123,930],
          borderColor: [
            "rgb(75, 192, 192)",
            "rgb(255, 205, 86)",
          ],
          backgroundColor: [
            "rgb(75, 192, 192 )",
            "rgb(255, 205, 86)",
          ],
          borderWidth: 2,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            display: false,
          }],
          yAxes: [{
            display: false,
          }],
        }
      },

    });
  }, [])

  return (
    <div className="h-full sm:h-[calc(100vh-231px)] py-12 dark:bg-gray-800 flex items-center max-md:my-[15%]">
      <div className="container mx-auto flex flex-row max-md:flex-col justify-between items-start py-4 px-4">
        <div className="shadow-xl rounded-xl border border-gray-400 w-[48%] max-md:w-full max-md:py-4 ">
          <p className="w-auto my-4 text-xl font-semibold capitalize text-center">Biểu đồ chấm công đi muộn về sớm</p>
          <div className="w-auto h-auto flex mx-auto my-4">
            <div className='w-full h-fit my-auto'>
              <canvas id='myChart'></canvas>
            </div>
          </div>
        </div>
        <div className="shadow-xl rounded-xl border border-gray-400 w-[48%] max-md:w-full max-md:my-4">
          <p className="w-auto my-4 text-xl font-semibold capitalize text-center">Biểu đồ chấm công làm đủ 8h</p>
          <div className="w-auto h-auto flex mx-auto  my-4">
            <div className='w-full h-fit my-auto'>
              <canvas id='myChart1'></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
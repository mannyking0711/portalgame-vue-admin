<template>
        <!-- <line-chart
                v-if="loaded"
                :chartdata="chartdata"
                :options="options"/> -->
        
    <canvas id="myChart" width="400" height="100"></canvas>

</template>

<script>
    import Chart from 'chart.js/auto'

    export default {
        
        props: {
            chartdata: {
                type: Object,
                default: null
            },
            options: {
                type: Object,
                default: null
            }
        },
        mounted() {
        const ctx = document.getElementById('myChart');
        console.log(this.chartdata);
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'February', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [{
                    label: '# of Views',
                    data: [12, 19, 3, 5, 2, 5, 20, 5, 2, 5, 2, 30],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
            });
            myChart();
        }
    }
    
</script>
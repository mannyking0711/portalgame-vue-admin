<template>
    <div>
        <grid cols="5">
            <stats-box
                v-for="i in 5"
                :key="i"
                :title="'Stats ' + i"
                :count="i"
                icon="icon-home"
            />
        </grid>
        <grid cols="1">
            <!-- <canvas id="myChart" width="400" height="100"></canvas> -->
            <!-- <line-chart
                v-if="loaded"
                :chartdata="chartdata"
                :options="options"
                :name="line1"
                /> -->
        </grid>
        
    </div>
</template>

<script>
import Grid from '../../common/components/grid/Grid.vue'
import StatsBox from '../../common/components/stats-box/StatsBox.vue'
// import LineChart from '../../common/components/charts/LineChart.vue'
// import Chart from 'chart.js/auto'
// import axios from "axios";
// import {mapActions, mapState} from 'vuex';
/*
 * Import Components
 * */

export default {
  components: { Grid, StatsBox },
    name: "HomeIndex",
    // data: () => ({
    //         loaded: true,
    //         chartdata: null
    //     }),
        

    // computed: {
    //     ...mapState('AnalyticsStore', ['analytics']),
    //     permission() {
    //         return this.currentPage.permission;
    //     }
    // },
    // methods: {
    //     ...mapActions('AnalyticsStore', ['getAnalytics']),
    // },
    // created() {
    //     this.getAnalytics();
    // }
}



// async mounted () {
        //     this.loaded = false
        //     try {
        //         let  response  = await fetch('http://127.0.0.1:8000/api/crud/squid-game') 
        //         // http://127.0.0.1:8000/api/crud/analytics əsas link budu
        //         this.chartdata = response
        //         this.loaded = true
        //         console.log( response );
        //     } catch (e) {
        //         console.error(e)
        //     }
        //     axios.get('http://127.0.0.1:8000/api/crud/squid-game', {})
        //     .then(res=>console.log(res.data))
        //     .catch(err => console.log(err.response))
        // }
</script>

<style scoped>

</style>


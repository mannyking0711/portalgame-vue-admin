<template>
    <div>
        <button @click="exportToPDF">Export to PDF</button>
        <div class=" flex flex-row justify-center p-6 content-center w-3/1 mb-2 h-64">
                    <!-- <div class=""> -->
                    <form @submit.prevent="filter">
                        <form-group>
                            <label class="text-lg p-2" for="fromDate">Tarixindən:</label>
                            <form-date id="fromDate" v-model.lazy="form.fromDate"></form-date>

                            &nbsp;&nbsp;

                            <label class="text-lg p-2" for="toDate">Tarixinə:</label>
                            <form-date id="toDate" v-model.lazy="form.toDate"></form-date>
                            


                        
                        </form-group>

                        <form-group :label="'Period'" class="w-32 mt-3 mb-3 inline-block m-1" >
                            <form-tree-select :options="selectPeriods" displayExpr="name" v-model.lazy="form.period"></form-tree-select>
                        </form-group>
                        
                        <form-group :label="'Göstəricilər'" class="w-32 mt-3 mb-3 inline-block m-1">
                            <form-tree-select :options="selectMetrics" displayExpr="name" v-model.lazy="form.period"></form-tree-select>
                        </form-group>

                        &nbsp;&nbsp;
                        
                        <div class="form">
                            <app-button class="float-right block border-none" :property="'primary'"  >
                                {{ translate('Axtar') }}
                            </app-button>
                        </div>
                    </form>
                    <!-- </div> -->
                </div>
            <div ref="document" class="">
                
                <div class="grid grid-cols-1 gap-4 mb-5">
                    <div style="width:1000px">
                        <DxChart
                            id="chart"
                            :data-source="analytics.lastSeven"
                            :title="(form.fromDate && form.toDate ? form.fromDate+' - '+form.toDate : 'Son 7 Gün')"
                            @pointClick="onPointClick"
                        >
                            <DxCommonSeriesSettings
                            argument-field="date"
                            type="bar"
                            hover-mode="allArgumentPoints"
                            selection-mode="allArgumentPoints"
                            >
                            <DxLabel :visible="true">
                                <DxFormat
                                :precision="0"
                                type="fixedPoint"
                                />
                            </DxLabel>
                            </DxCommonSeriesSettings>

                            <DxSeries
                                value-field="visitors"
                                name="Ziyarətçilər"
                            />
                            <DxSeries
                                value-field="newUsers"
                                name="Yeni İstifadəçilər"
                            />
                            <DxSeries
                                value-field="organicSearches"
                                name="Təbii Axtarışlar"
                            />
                            
                            <!-- <DxSeries
                                value-field="socialNetwork"
                                name="Sosial Medialardan"
                            /> -->

                            <DxLegend
                            vertical-alignment="bottom"
                            horizontal-alignment="center"
                            />
                            <DxExport :enabled="true"/>
                        </DxChart>
                    </div>
                </div>
                <div class="html2pdf__page-break"></div>
                <div class="grid grid-cols-2 gap-4 mx-14" style="width:1000px">
                    <div>
                        <DxChart
                            id="chart"
                            :data-source="analytics.registeredUsers"
                            :title="'Qeydiyyatdan Keçən istifadəçilər'"
                            @pointClick="onPointClick"
                        >
                            <DxCommonSeriesSettings
                            argument-field="date"
                            type="bar"
                            hover-mode="allArgumentPoints"
                            selection-mode="allArgumentPoints"
                            >
                            <DxLabel :visible="true">
                                <DxFormat
                                :precision="0"
                                type="fixedPoint"
                                />
                            </DxLabel>
                            </DxCommonSeriesSettings>

                            <DxSeries
                                value-field="total"
                                name="İstifadəçilər"
                            />
                            
                            <!-- <DxSeries
                                value-field="socialNetwork"
                                name="Sosial Medialardan"
                            /> -->

                            <DxLegend
                            vertical-alignment="bottom"
                            horizontal-alignment="center"
                            />
                            <DxExport :enabled="true"/>
                        </DxChart>
                    </div>

                    <div>
                        <DxPieChart
                            id="pie"
                            :data-source="analytics.visitorsDoughnut"
                            type="doughnut"
                            title="Sosial medialardan gələn ziyarətçilər"
                            palette="Soft Pastel"
                        >
                            <DxSeries argument-field="socialMedia">
                            <DxLabel
                                :visible="true"
                            >
                                <DxConnector :visible="true"/>
                            </DxLabel>
                            </DxSeries>
                            <DxExport :enabled="true"/>
                            <DxLegend
                            :margin="0"
                            horizontal-alignment="right"
                            vertical-alignment="top"
                            />
                            <DxTooltip
                            :enabled="true"
                            :customize-tooltip="customizeTooltip"
                            >
                            <DxFormat
                            />
                            </DxTooltip>
                        </DxPieChart>
                    </div>
                </div>
                <div class="html2pdf__page-break"></div>
                <div class="grid grid-cols-2 gap-4 mx-14">
                    <div class="text-center" >
                        <h1 class="my-5" style="white-space: pre; font-size: 28px; font-family: &quot;Segoe UI Light&quot;, &quot;Helvetica Neue Light&quot;, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, &quot;Trebuchet MS&quot;, Verdana, sans-serif; font-weight: 200; fill: rgb(35, 35, 35); cursor: default;" x="0" y="31" transform="translate(0,0)" text-anchor="middle">Ən çox ziyarət olunan səhifələr</h1>
                        <DxDataGrid
                            :data-source="analytics.mostVisitedPages"
                            :columns="columns"
                            :show-borders="true"
                        />
                    </div>

                    <div class="text-center" >
                        <h1 class="my-5" style="white-space: pre; font-size: 28px; font-family: &quot;Segoe UI Light&quot;, &quot;Helvetica Neue Light&quot;, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, &quot;Trebuchet MS&quot;, Verdana, sans-serif; font-weight: 200; fill: rgb(35, 35, 35); cursor: default;" x="0" y="31" transform="translate(0,0)" text-anchor="middle">Oyunların rezerv sayı</h1>
                        <DxDataGrid
                            :data-source="analytics.gameReserveCount"
                            :columns="columnsGameReserve"
                            :show-borders="true"
                        />
                    </div>
                </div>
            </div>
    </div>

</template>


<script>

import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxExport,
} from 'devextreme-vue/chart';

import DxDataGrid from 'devextreme-vue/data-grid';
import {DxPieChart,
  DxTooltip,
  DxConnector,} from 'devextreme-vue/pie-chart';
import {mapActions, mapState} from 'vuex';

import html2pdf from 'html2pdf.js'

export default {
    components: {
        DxChart,
        DxSeries,
        DxCommonSeriesSettings,
        DxLabel,
        DxFormat,
        DxLegend,
        DxExport,
        DxPieChart,
        DxTooltip,
        DxConnector,
        DxDataGrid,
        // html2pdf
    },
    name: "Index",
    data(){
        return {
            form:{},
            selectPeriods: [
                {id: 'day', name: 'Günlük'},
                {id: 'month', name: 'Aylıq'},
                {id: 'year', name: 'İlik'}
            ],
            selectMetrics: [
                {id: '', name: 'Ziyarətçilər'},
            ],
            columns: [
                {
                    caption: 'Link',
                    dataField: 'url',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Səhifə',
                    dataField: 'pageTitle',
                    show: true,
                    allowFiltering: false,
                    width: '250px'
                },
                {
                    caption: 'Ziyarətçilər',
                    dataField: 'visitors',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Sesialar',
                    dataField: 'sessions',
                    show: true,
                    allowFiltering: false
                },
            ],
            columnsGameReserve: [
                {
                    caption: 'Oyun',
                    dataField: 'game_name',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Rezerv Sayı',
                    dataField: 'total',
                    show: true,
                    allowFiltering: false
                },
            ],
        }
    },
    
    watch:{

    },
    computed: {
        ...mapState('AnalyticsStore', ['totalUsers', 'sevenDay', 'visitors', 'analytics']),
    },
    methods: {
        ...mapActions('AnalyticsStore', ['getUsers', 'getSevenDay', 'getVisitors', 'getAll']),
        
        onPointClick({ target }) {
            target.select();
        },

        customizeTooltip({ valueText, percent }) {
            return {
                text: `${valueText} - ${(percent * 100).toFixed(2)}%`,
            };
        },
        filter(){
            this.getAll(this.form)
        },
        exportToPDF () {
            html2pdf(this.$refs.document, {
                margin: 0,
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { dpi: 192, letterRendering: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            })
        }
    },
    created(){
        this.getAll();
        console.log(this.analytics);
    },
    
}
</script>

<style scoped>
#chart {
  height: 440px;
}
</style>
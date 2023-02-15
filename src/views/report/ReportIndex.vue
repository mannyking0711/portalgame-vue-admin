<template>
    <page>
        <page-head></page-head>
        <page-body>
            <grid cols="12">
                <grid-col col="2">
                    <form-group
                        :label="translate(translateKey + '.Reception')"
                    >
                        <form-tree-select :options="receptions" displayExpr="fullname" v-model="query.reception_id"/>
                    </form-group>
                </grid-col>

                <grid-col col="2">
                    <form-group
                        :label="translate(translateKey + '.Operator')"
                    >
                        <form-tree-select :options="operators" displayExpr="fullname" v-model="query.employee_id"/>
                    </form-group>
                </grid-col>

                <grid-col col="2">
                    <form-group
                        :label="translate(translateKey + '.Game')"
                    >
                        <form-tree-select :options="games" v-model="query.game_id"/>
                    </form-group>
                </grid-col>

                <grid-col col="2">
                    <form-group
                        :label="translate(translateKey + '.Department')"
                    >
                        <form-tree-select :options="departments" v-model="query.department_id"/>
                    </form-group>
                </grid-col>

                <grid-col col="1">
                    <form-group
                        :label="translate(translateKey + '.Year')"
                    >
                        <form-date type="year" value-format="YYYY" display-format="YYYY" v-model="query.year"/>
                    </form-group>
                </grid-col>

                <grid-col col="1">
                    <form-group
                        :label="translate(translateKey + '.Month')"
                    >
                        <form-date type="month" value-format="MM" display-format="MMM" v-model="query.month"/>
                    </form-group>
                </grid-col>

                <grid-col col="1">
                    <form-group
                        :label="translate(translateKey + '.Day')"
                    >
                        <form-tree-select :options="days" v-model="query.day"/>
                    </form-group>
                </grid-col>

                <grid-col col="2">
                    <app-button @click="report" type="submit" property="success" icon="icon-bar-chart-o">
                        {{ translate(translateKey + '.SearchReport') }}
                    </app-button>
                </grid-col>
            </grid>

            <div class="mt-4" v-if="Object.keys(reportsAll).map(i => reportsAll[i] !== null).includes(true)">
                <grid cols="4">
                    <stats-box
                        :title="translate(translateKey + '.TotalPrice')"
                        :count="reportsAll.total_price + ' AZN'"
                        icon="icon-money"
                        icon-bg="bg-green-500"
                        icon-color="text-white"
                    />
                    <stats-box
                        :title="translate(translateKey + '.TotalGame')"
                        :count="reportsAll.total_game.toString()"
                        icon="icon-gamepad"
                        icon-bg="bg-yellow-500"
                        icon-color="text-white"
                    />
                </grid>
            </div>
        </page-body>
    </page>
</template>

<script>
/*
 * Import Components
 * */
import {mapState, mapActions} from 'vuex';

const translateKey = 'crm.Report.Label';

export default {
    name: "ReportIndex",
    data() {
        return {
            translateKey,
            query: {
                reception_id: null,
                game_id: null,
                employee_id: null,
                department_id: null,
                year: null,
                month: null,
                day: null,
            }
        }
    },
    computed: {
        ...mapState('SaleStore', ['reportsAll']),
        ...mapState('GameStore', ['games']),
        ...mapState('DepartmentStore', ['departments']),
        ...mapState('EmployeeStore', ['employees']),
        receptions() {
            return this.employees.filter(i => parseFloat(i.employee_type.id) === 1)
        },
        operators() {
            return this.employees.filter(i => parseFloat(i.employee_type.id) === 2)
        },
        days() {
            let result = [];
            for(let i = 1; i <= 31; i++) {
                result.push({
                    id: i < 10 ? '0' + i : i,
                    name: i < 10 ? '0' + i : i,
                });
            }
            return result;
        }
    },
    methods: {
        ...mapActions('SaleStore', ['getAllReports']),
        ...mapActions('GameStore', ['getSelectGames']),
        ...mapActions('DepartmentStore', ['getSelectDepartments']),
        ...mapActions('EmployeeStore', ['getSelectEmployees']),
        /*
        * Report
        * */
        report() {
            this.getAllReports(this.query);
        }
    },
    created() {
        this.getSelectGames();
        this.getSelectDepartments();
        this.getSelectEmployees();
    }
}
</script>

<style scoped>

</style>

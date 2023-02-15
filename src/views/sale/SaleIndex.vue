<template>
    <page>
        <page-head>
            <div class="flex space-x-3">
                <app-button property="primary " @click="setZero" class="mr-2" :class="[dayZero ? 'opacity-50' : '']" :disabled="dayZero">
                    {{ translate('Günlük Satış olmadı') }}
                </app-button>


                <!-- <app-button property="primary" icon="icon-send" @click="finishedDay">
                    {{ translate('button.FinishedDay') }}
                </app-button> -->
                <app-button property="success" icon="icon-filter" @click="filterModal">
                    {{ translate('button.Filter') }}
                </app-button>

                <app-button property="danger" v-if="queryHas" icon="icon-trash" @click="resetFilter">
                    {{ translate('button.Reset') }}
                </app-button>
            </div>
        </page-head>

        <page-body>

            <div class="mb-4" v-if="can('report.read')">
                <grid cols="4">
                    <stats-box
                        v-for="(i, index) in statistics"
                        :key="'st' + index"
                        :title="i.title"
                        :count="i.count"
                        :icon="i.icon"
                        :icon-bg="i.iconBg"
                        :icon-color="i.iconColor"
                    />
                </grid>
            </div>

            <data-grid
                class="saleTable"
                :data-source="sales"
                :columns="columns"
                :action-column-width="80"
                :search-visible="false"
                :action-column-text="''"
            >

                <div slot="gameInfoTemplate" slot-scope="list" class="flex flex-col">
                    <p>
                        <b>{{ translate(translateKey + '.Label.GameName') }}:</b> {{ list.row.game.name }}
                    </p>
                    <p>
                        <b>{{ translate(translateKey + '.Label.Department') }}:</b> {{ list.row.game.department.name }}
                    </p>
                </div>

                <div slot-scope="list" slot="playerTemplate">
                    <app-button @click="usersModal(list.row.users)"
                                v-if="list.row.users_count"
                                style="font-size: 12px; padding: 10px; height: 30px" type="button"
                                :title="translate(translateKey + '.Label.PlayerCountText', {search: '{count}', replace: list.row.users_count})">
                        {{
                            translate(translateKey + '.Label.PlayerCountText', {
                                search: '{count}',
                                replace: list.row.users_count
                            })
                        }}
                    </app-button>
                </div>

                <div slot="operatorTemplate" slot-scope="list">
                    <p v-for="(i, key) in list.row.employees" :key="key">{{ i.fullname }}</p>
                </div>

                <div slot="commentsTemplate" slot-scope="list">
                    <app-button @click="commentsModal(list.row)" v-if="list.row.status.key === 'finished'" style="font-size: 12px; padding: 10px; height: 30px" type="button" :title="translate(translateKey + '.Label.CommentRead')">
                        {{ translate(translateKey + '.Label.CommentRead') }}
                    </app-button>
                </div>

                <div slot="statusTemplate" slot-scope="list">
                    <badge property="warning" v-if="list.row.status.key === 'continue'">
                        {{ list.row.status.name }}
                    </badge>
                    <badge property="success" v-else-if="list.row.status.key === 'finished'">
                        {{ list.row.status.name }}
                    </badge>
                </div>

                <div slot="actionSlot" slot-scope="list">
                    <!-- {{currentDate() + (currentDate() <= list.row.created_at) + list.row.created_at}} -->

                    <app-button
                        v-if="(can(permission + '.update') && currentDate() <= list.row.created_at) || permissionId() === 2"
                        @click="updateModal(list.row.form)"
                        :sm="true"
                        :title="translate('button.Edit')"
                        icon="icon-edit-2"
                        property="primary"
                    />
                    
                    <app-button
                        property="warning"
                        @click="createModal(list.row.id)"
                        :sm="true"
                        v-if="list.row.status.key === 'continue' && can(permission + '.update')"
                        :title="translate(translateKey + '.Label.CompleteSale')"
                        icon="icon-power-off"
                    />

                    <!-- || (currentDate() <= list.row.order_date) -->
                    <app-button
                        v-if="can(permission + '.delete') " 
                        :sm="true"
                        @click="remove(list.row.id)"
                        :title="translate('button.Delete')"
                        icon="icon-trash-2"
                        property="danger"
                    />
                </div>

                <div slot-scope="list" slot="evaluationTemplate">
                    <p v-if="list.row.user_review">
                        <b>{{ translate(translateKey + '.Label.GameEvaluation') }}:</b>
                        {{ list.row.user_review }}
                    </p>
                    <p v-if="list.row.employee_review">
                        <b>{{ translate(translateKey + '.Label.EmployeeEvaluation') }}:</b>
                        {{ list.row.employee_review }}
                    </p>
                    <p v-if="list.row.reception_review">
                        <b>{{ translate(translateKey + '.Label.ReceptionEvaluation') }}:</b>
                        {{ list.row.reception_review }}
                    </p>
                </div>
            </data-grid>
        </page-body>

        <modal :id="modalId" size="xs">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="finished">
                    <grid>
                        <form-group
                            :label="translate(translateKey + '.Label.TeamComment')"
                            name="customer_comment"
                        >
                            <form-text-area style="min-height: 130px" v-model="form.customer_comment"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.ReceptionComment')"
                            name="reception_comment"
                        >
                            <form-text-area style="min-height: 130px" v-model="form.reception_comment"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.GameStatus')"
                            name="game_status_id"
                        >
                            <form-tree-select :options="gameStatuses" v-model="form.game_status_id"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.GameEvaluation')"
                            name="customer_review"
                        >
                            <form-tree-select :options="reviews" v-model="form.customer_review"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.ReceptionEvaluation')"
                            name="reception_review"
                        >
                            <form-tree-select :options="reviews" v-model="form.reception_review"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.EmployeeEvaluation')"
                            name="employee_review"
                        >
                            <form-tree-select :options="reviews" v-model="form.employee_review"/>
                        </form-group>

                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Finished') }}
                        </app-button>
                    </grid>
                </form>
            </modal-body>
        </modal>

        <modal :id="'updateModal'" size="xs">
            <modal-head>
                <modal-title>{{ 'Satış məlumatlarını yenilə' }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="update">
                    <grid>
                        <b>Oyun: {{form.game_name}}</b>
                        <b>Sifariş tarixi: {{form.order_date}}</b>


                        <div v-if="permissionId() === 2 || permissionId() === 6">
                            <div>
                                <form-group
                                    :label="translate('crm.Order.Label.ReceptionName')"
                                    name="reception_id"
                                >
                                    <form-tree-select :options="emps" displayExpr="fullname" v-model="form.reception_id"/>
                                </form-group>
                            </div>
                            <br>
                            <div>
                                <form-group
                                    :label="translate('crm.Order.Label.Operators')"
                                    name="operators"
                                >
                                    <form-tree-select :options="emps" :multiple="true" displayExpr="fullname" v-model="form.operators"/>
                                </form-group>
                            </div>
                            <br>
                            <div>
                                <form-group
                                    :label="translate('Hostesslər')"
                                    name="hostesses"
                                >
                                    <form-tree-select :options="emps" :multiple="true" displayExpr="fullname" v-model="form.hostesses"/>
                                </form-group>
                            </div>
                        </div>

                        <div>
                            <form-group
                                :label="translate('Sifariş Tarixi')"    
                                name="date"
                            >
                                <input type="date" :value.prop="form.date" v-model="form.date" class="form-element">
                            </form-group>
                        </div>

                        <form-group
                            :label="translate('Faktiki vaxtı')"
                            name="entered_time"
                        >
                            <form-text v-model="form.entered_time"/>
                        </form-group>

                        <form-group
                            :label="translate('Daxil olan istifadəçi sayı')"
                            name="entered_player_count"
                        >
                            <form-number v-model="form.entered_player_count"/>
                        </form-group>

                        <form-group
                            :label="translate('Nağd')"
                            name="cash"
                        >
                            <form-number v-model="form.cash"/>
                        </form-group>

                        <form-group
                            :label="translate('Nağdsız')"
                            name="cashless"
                        >
                            <form-number v-model="form.cashless"/>
                        </form-group>

                        <form-group
                            :label="translate('Qeyd')"
                            name="note"
                        >
                            <form-text-area style="min-height: 130px" v-model="form.note"/>
                        </form-group>


                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('Yenilə') }}
                        </app-button>
                    </grid>
                </form>
            </modal-body>
        </modal>

        <modal id="filterModal" size="xs">
            <modal-head>
                <modal-title>{{ translate(translateKey + '.Label.FilterModal') }}</modal-title>
            </modal-head>
            <modal-body>
                <grid>

                    <div v-if="this.user.department.id == null">
                        <form-group
                            :label="'Filial'"
                        >
                            <form-tree-select :options="select_departments" v-model="query.department"/>
                        </form-group>

                    </div>
                    <!-- <div v-if="this.user.department.id == null"> -->
                        <form-group
                            :label="'Oyun Adı'"
                        >
                            <form-tree-select  :multiple="true" :options="customGames" v-model="query.games"/>
                        </form-group>
                        <!-- <form-group
                            :label="'Games'"
                            name="games"
                        >
                            <form-tree-select :options="customGames" :multiple="true" displayExpr="name" v-model="form.games"/>
                        </form-group> -->
                    <!-- </div> -->
                    
                    <form-group
                        :label="translate(translateKey + '.Label.Reception')"
                    >
                        <form-tree-select :options="receptions" displayExpr="fullname" v-model="query.reception_id"/>
                    </form-group>

                    <form-group
                        :label="translate(translateKey + '.Label.Operators')"
                    >
                        <form-tree-select :options="operators" displayExpr="fullname" :multiple="true" v-model="query.employees"/>
                    </form-group>

                    <form-group
                        :label="translate(translateKey + '.Label.Status')"
                    >
                        <form-tree-select :options="statuses" v-model="query.status"/>
                    </form-group>

                    <form-group
                        :label="translate(translateKey + '.Label.GameStatus')"
                    >
                        <form-tree-select :options="gameStatuses" v-model="query.game_status_id"/>
                    </form-group>

                    <form-group
                        :label="translate(translateKey + '.Label.OrderDate')"
                    >
                        <form-date v-model="query.order_date"/>
                    </form-group>

                    <form-group
                        :label="translate(translateKey + '.Label.TeamCode')"
                    >
                        <form-text v-model="query.code"/>
                    </form-group>

                    <app-button class="justify-center" property="success" @click="filter" type="button">
                        {{ translate('button.Filter') }}
                    </app-button>
                </grid>
            </modal-body>
        </modal>

        <modal id="commentsModal" size="xs">
            <modal-head>
                <modal-title>{{ translate(translateKey + '.Label.Comments') }}</modal-title>
            </modal-head>
            <modal-body v-if="comments.length">
                <div class="flex flex-col space-y-2">
                    <div v-for="(i, key) in comments" :key="key" class="p-3 bg-gray-100 border border-gray-200 space-y-2 rounded">
                        <b>{{ i.label }}:</b>
                        <p v-html="i.comment"></p>
                    </div>
                </div>
            </modal-body>
        </modal>

        <modal id="usersModal" size="sm">
            <modal-head>
                <modal-title>{{ translate(translateKey + '.Label.users') }}</modal-title>
            </modal-head>
            <modal-body v-if="users.length">
                <grid cols="2">
                    <div class="bg-gray-100 border border-gray-200 p-3 rounded space-y-2" v-for="(i, key) in users" :key="key">
                        <p><b>{{ translate(translateKey + '.Label.Fullname') }}</b>: {{ i.user.fullname }}</p>
                        <p v-if="i.user.phone"><b>{{ translate(translateKey + '.Label.Phone') }}</b>: {{
                                i.user.phone
                                                                                                        }}</p>
                        <p v-if="i.user.email"><b>{{ translate(translateKey + '.Label.Email') }}</b>: {{
                                i.user.email
                                                                                                        }}</p>
                        <p v-if="i.discount && i.discount.name">
                            <b>{{ translate(translateKey + '.Label.Discount') }}</b>: {{ i.discount.name }}
                        </p>
                        <p><b>{{ translate(translateKey + '.Label.Price') }}</b>: {{ i.price }} AZN</p>
                    </div>
                </grid>
            </modal-body>
        </modal>
    </page>
</template>

<script>
/*
 * Import Components
 * */
import {mapActions, mapState} from 'vuex';

const modalId = 'createModal';
const translateKey = 'crm.Sale';

const queryObject = () => {
    return {
        department: null,
        games: [],
        order_date: null,
        reception_id: null,
        employees: [],
        code: null,
        game_status_id: null,
        status: null,
    }
}

export default {
    name: "SaleIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            users: [],
            comments: [],
            columns: [
                {
                    caption: translateKey + '.Label.GameInfo',
                    dataField: 'game_info',
                    show: true,
                    slot: 'gameInfoTemplate',
                    width: 155
                },
                {
                    caption: translateKey + '.Label.OrderDate',
                    dataField: 'order_date',
                    show: true,
                    width: 90,
                    alignment: 'center'
                },
                {
                    caption: translateKey + '.Label.CreatedDate',
                    dataField: 'created_at',
                    show: true,
                    width: 90,
                    alignment: 'center'
                },
                {
                    caption: translateKey + '.Label.PlayerCount',
                    dataField: 'player',
                    show: true,
                    slot: 'playerTemplate',
                    width: 180,
                    alignment: 'center'
                },
                // {
                //     caption: translateKey + '.Label.Reception',
                //     dataField: 'reception.fullname',
                //     show: true,
                //     alignment: 'center',
                //     width: 100
                // },
                {
                    caption: translateKey + '.Label.Operators',
                    dataField: 'operator',
                    show: true,
                    slot: 'operatorTemplate',
                    alignment: 'center'
                },
                {
                    caption: translateKey + '.Label.TeamCode',
                    dataField: 'code',
                    show: true,
                    alignment: 'center',
                    width: 150
                },
                {
                    caption: translateKey + '.Label.Comments',
                    dataField: 'comments',
                    show: true,
                    slot: 'commentsTemplate',
                    width: 120,
                    alignment: 'center'
                },
                {
                    caption: translateKey + '.Label.GameStatus',
                    dataField: 'game_status.name',
                    customizeText: data => data.valueText || '-',
                    show: true,
                    alignment: 'center',
                    width: 90
                },
                {
                    caption: translateKey + '.Label.Status',
                    dataField: 'status',
                    show: true,
                    alignment: 'center',
                    slot: 'statusTemplate'
                },
                {
                    caption: translateKey + '.Label.SaleTotalPrice',
                    dataField: 'last_price',
                    customizeText: data => data.valueText + ' AZN',
                    show: true,
                    alignment: 'center'
                },
                {
                    caption: translateKey + '.Label.Evaluation',
                    dataField: 'evaluation',
                    show: true,
                    slot: 'evaluationTemplate'
                },
            ],
            form: {},
            query: {}
        }
    },
    watch: {
        'query.department'(val) {
            let department = this.select_departments.find(i => i.id === val);
            if(department){
                this.getSelectGames({department: department.id});
                this.customGames();
                // console.log(this.employees);
            }
        },
    },
    computed: {
        ...mapState('SaleStore', ['sales', 'reports', 'dayZero']),
        ...mapState('GameStatusStore', ['gameStatuses']),
        ...mapState('EmployeeStore', ['employees']),
        ...mapState('GameStore', ['games', 'gameTimes']),
        ...mapState('DepartmentStore', ['select_departments']),
        
        permission() {
            return this.currentPage.permission;
        },
        customGames() {
            if (this.query.department) {
                return this.games.filter(i => i.department.id === this.query.department);
            }else if (this.user.department.id) {
                return this.games.filter(i => i.department.id === this.user.department.id);
            }
            return this.games;
        },
        statistics() {
            return [
                {
                    title: this.translate(translateKey + '.Label.AllSales'),
                    count: this.reports.total_price + ' AZN',
                    icon: 'icon-money',
                    iconBg: 'bg-red-500',
                    iconColor: 'text-white',
                },
                {
                    title: this.translate(translateKey + '.Label.FinishedSales'),
                    count: this.reports.total_price_finished + ' AZN',
                    icon: 'icon-money',
                    iconBg: 'bg-indigo-500',
                    iconColor: 'text-white',
                },
                {
                    title: this.translate(translateKey + '.Label.ContinueSales'),
                    count: this.reports.total_price_continue + ' AZN',
                    icon: 'icon-money',
                    iconBg: 'bg-pink-500',
                    iconColor: 'text-white',
                },
                {
                    title: this.translate(translateKey + '.Label.AllCustomers'),
                    count: this.reports.total_user || '0',
                    icon: 'icon-users',
                    iconBg: 'bg-yellow-500',
                    iconColor: 'text-white',
                }
            ]
        },
        reviews() {
            let result = [];
            for (let i = 1; i <= 10; i++) {
                result.push({
                    id: i,
                    name: i
                })
            }
            return result;
        },
        emps(){
            return this.employees.filter(i => parseFloat(i.employee_type.show_admin) === 1)
        },
        receptions() {
            return this.employees.filter(i => parseFloat(i.employee_type.id) === 1)
        },
        operators() {
            return this.employees.filter(i => parseFloat(i.employee_type.id) === 2)
        },
        statuses() {
            return [
                {id: 'finished', name: this.translate(translateKey + '.Label.StatusFinished')},
                {id: 'continue', name: this.translate(translateKey + '.Label.StatusContinue')},
            ]
        },
        queryHas() {
            return Object.keys(this.query).map(i => {
                if (Array.isArray(this.query[i]) && this.query[i].length) {
                    return true
                }
                else if (!Array.isArray(this.query[i]) && this.query[i] !== null) {
                    return true;
                }
                return false;
            }).includes(true)
        }
    },
    methods: {
        ...mapActions('SaleStore', ['getSales', 'getReports', 'setSaleFinished', 'deleteSale', 'saleFinishedDay', 'updateSale', 'isDayZero', 'setDayZero']),
        ...mapActions('GameStatusStore', ['getSelectGameStatuses']),
        ...mapActions('GameStore', ['getSelectGames', 'getGameTimes']),
        ...mapActions('EmployeeStore', ['getSelectEmployees']),
        ...mapActions('DepartmentStore', ['getSelectDepartments']),
        
        /*
        * Current Date
        */
        currentDate() {
            const current = new Date();
            const date = `${('0' + current.getDate()).slice(-2)}-${current.getMonth()+1}-${current.getFullYear()} ${current.getHours()-1}:${current.getMinutes()}`;      
            return date;
        },
        
        /*
        * Current Date
        */
        permissionId() {
            return this.user.permission.id; 
        },
 
        /*
         * Form Create
         * */
         updateFormCreate(item) {
            this.form = {
                id: item.id,
                game_name: item.game_name || null,
                reception_id: item.reception_id || null,
                operators: item.operators || null,
                hostesses: item.hostesses || null,

                order_date: item.order_date,
                date: item.date,
                order_time: item.order_time,
                
                entered_time: item.entered_time || null,
                entered_player_count: item.entered_player_count || null,
                cash: item.cash || null,
                cashless: item.cashless || null,
                note: item.note || null,
            };
            this.modelShow = true;
        },

        /*
         * Form Create
         * */
        formCreate(id) {
            this.form = {
                id,
                game_status_id: null,
                customer_comment: null,
                reception_comment: null,
                reception_review: 0,
                customer_review: 0,
                employee_review: 0,
            };
            this.modelShow = true;
        },
        /*
         * Create Modal
         * */
        createModal(id) {
            this.modal(this.modalId)
            this.modelShow = false;
            this.resetError();
            this.getSelectGameStatuses();
            this.formCreate(id);
        },
        /*
         * Create Modal
         * */
        updateModal(item) {
            this.modal('updateModal')
            this.modelShow = false;
            this.resetError();
            this.updateFormCreate(item);
            this.getSelectEmployees();
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteSale(id).then(r => {
                this.getReports();
                this.getSales();
            }))
        },
        /*
         * Save
         * */
        finished() {
            this.setSaleFinished(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getReports();
                    this.getSales();
                }
            })
        },
        /*
         * user Modal
         * */
        usersModal(item) {
            this.users = item;
            this.modal('usersModal')
        },
        /*
         * Comment Modal
         * */
        commentsModal(item) {
            this.comments = [
                {
                    label: this.translate(translateKey + '.Label.TeamComment'),
                    comment: item.customer_comment,
                },
                {
                    label: this.translate(translateKey + '.Label.ReceptionComment'),
                    comment: item.reception_comment,
                },
            ];
            this.modal('commentsModal');
        },
        /*
         * Filter Modal
         * */
        filterModal() {
            this.modal('filterModal');
            this.getSelectDepartments();
            this.getSelectGames();
            this.getSelectGameStatuses();
            this.getSelectEmployees();
        },
        /*
         * Filter
         * */
        filter() {
            this.getSales(this.query);
            this.modal('filterModal');
        },
        /*
         * Reset Filter
         * */
        resetFilter() {
            this.getSales();
            this.query = queryObject();
        },
        /*
         * Finished Day
         * */
        finishedDay() {
            this.saleFinishedDay();
            this.notification(this.translate('notification.SaleFinishedDay.Description'));
        },
        update(){
            this.updateSale(this.form)
            .then(r => {
                if (r) {
                    this.modal('updateModal');
                    this.getReports();
                    this.getSales();
                }
            })
        },
        setZero() {
            this.alert('Bu gün satış 0 kimi qeyd olunacaq!').then(
                r => this.setDayZero()
                .then(
                r => {
                    if (r) {
                        this.getSales();
                        this.isDayZero();
                    }
                })
            )
        },
    },
    created() {
        this.getSales();
        this.getReports();
        this.isDayZero();
        this.$eventBus.$on('modalClose', modalId => {
            if (modalId === 'usersModal') {
                this.users = [];
            }
            else if (modalId === 'commentsModal') {
                this.comments = [];
            }
        });
    }
}
</script>

<style>
.saleTable td {
    @apply text-xs
}
</style>

<template>
    <page>
        <page-head></page-head>
        <page-body>
            <form @submit.prevent="save">
                <grid cols="12">
                    <grid-col col="9">
                        <div class="p-3 border border-gray-200">
                            <div>
                                <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                                    {{ translate(translateKey + '.Label.OrderInfo') }}</h3>
                            </div>
                            <div class="space-y-4">
                                <div v-if="preview.department.name">
                                    <b>{{ translate('crm.Order.Label.Department') }}: </b>
                                    {{ preview.department.name }}
                                </div>

                                <div v-if="preview.department.phones && preview.department.phones.length">
                                    <b>{{ translate('crm.Order.Label.DepartmentPhone') }}: </b>
                                    <p v-for="(i, key) in preview.department.phones" :key="key">{{ i }}</p>
                                </div>

                                <div v-if="preview.promo_code">
                                    <b>{{ translate('Promo Kod') }}: </b>
                                    <span style="background-color:yellow;padding:0 5px;"> {{ preview.promo_code.code }} </span> 
                                </div>

                                <div v-if="preview.price">
                                    <b>{{ translate('crm.Order.Label.Price') }}: </b>
                                    {{ preview.price }} AZN
                                </div>

                                <div v-if="preview.player_count">
                                    <b>{{ translate('crm.Order.Label.PlayerCount') }}: </b>
                                    {{ preview.player_count }}
                                </div>

                                <div v-if="totalPrice">
                                    <b>{{ translate('crm.Order.Label.TotalPrice') }}: </b>
                                    {{ totalPrice }} AZN
                                </div>
                                
                                <div>
                                    <b>{{ translate('crm.Order.Label.GameName') }}: </b>
                                    <form-group
                                        name="game_id"
                                    >
                                        <form-tree-select @select="gameSelect" :options="customGames" v-model="form.game_id"/>
                                    </form-group>
                                </div>

                                <div v-if="form.game_id">
                                    <b>{{ translate('crm.Order.Label.ReceptionName') }}: </b>
                                    <form-group
                                        name="reception_id"
                                    >
                                        <form-tree-select :options="receptions" displayExpr="fullname" v-model="form.reception_id"/>
                                    </form-group>
                                </div>
                                
                                <div v-if="form.game_id">
                                    <b>{{ translate('crm.Order.Label.Operators') }}: </b>
                                    <form-group
                                        name="operators"
                                    >
                                        <form-tree-select :options="operators" :multiple="true" displayExpr="fullname" v-model="form.operators"/>
                                    </form-group>
                                </div>

                                <div v-if="form.game_id">
                                    <b>{{ 'Hostesses' }}: </b>
                                    <form-group
                                        name="hostesses"
                                    >
                                        <form-tree-select :options="operators" :multiple="true" displayExpr="fullname" v-model="form.hostesses"/>
                                    </form-group>
                                </div>

                                <div v-if="form.game_id">
                                    <b>{{ translate('crm.Order.Label.Time') }}: </b>
                                    <form-group
                                        name="time"
                                    >
                                        <form-tree-select :options="gameTimes" v-model="form.time"/>
                                    </form-group>
                                </div>
                                
                                <div v-if="form.game_id">
                                    <b>{{ 'Oyuna giriş vaxtı' }}: </b>
                                    <form-group
                                        name="enter_time"
                                    >
                                        <form-text v-model="form.entered_time"/>
                                    </form-group>
                                </div>
                                
                                <div v-if="form.game_id">
                                    <b>{{ 'Daxil olan istifadəçi sayı' }}: </b>
                                    <form-group
                                        name="entered_player_count"
                                    >
                                        <form-number v-model="form.entered_player_count"/>
                                    </form-group>
                                </div>

                                <div v-if="form.game_id">
                                    <b>{{ 'Nağd' }}: </b>
                                    <form-group
                                        name="cash"
                                    >
                                        <form-number v-model="form.cash"/>
                                    </form-group>
                                </div>
                                
                                <div v-if="form.game_id">
                                    <b>{{ 'Nağdsız' }}: </b>
                                    <form-group
                                        name="cashless"
                                    >
                                        <form-number v-model="form.cashless"/>
                                    </form-group>
                                </div>
                                
                                <div v-if="preview.lastPrice">
                                    <b>Yekun məbləğ: </b>
                                    <!-- {{ preview.price }}  -->
                                    {{ preview.lastPrice }} AZN
                                </div>

                                <div v-if="form.game_id">
                                    <b>{{ 'Qeyd' }}: </b>
                                    <form-group
                                        name="note"
                                    >
                                        <form-text-area v-model="form.note"/>
                                    </form-group>
                                </div>
                            </div>
                        </div>
                    </grid-col>

                    <grid-col col="3" class="h-full" v-if="preview.user.name || (preview.user.phone && preview.user.phone.length)">
                        <div class="p-3 border border-gray-200 h-full">
                            <div>
                                <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                                    {{ translate(translateKey + '.Label.UserInfo') }}</h3>
                            </div>
                            <div class="space-y-2">
                                <div>
                                    <b>{{ translate('crm.Order.Label.Fullname') }}: </b>
                                    {{ preview.user.name +' '+ preview.user.surname}}
                                </div>
                                <div>
                                    <b>{{ translate('crm.Order.Label.Phone') }}: </b>
                                    <p>{{ preview.phone }}</p>
                                </div>
                            </div>
                        </div>
                    </grid-col>
                    <grid-col col="6" v-if="form.game_id">
                        <div>
                            <div>
                                <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                                    {{ translate('Qrup Endirimləri') }}
                                </h3>
                            </div>

                            <div class="py-4">
                                <grid>                                   
                                    <div>
                                        <!-- <b>{{'Endirimlər '}}:</b>   -->
                                        <form-group
                                                name="discount_id"
                                            >
                                            <form-tree-select :options="groupDiscounts" v-model="form.discount_id" :placeholder="''"/>
                                        </form-group>
                                    </div>

                                    <!-- <div v-if="form.discount_id == 17"> -->
                                    <div v-if="form.discount_id == 17">
                                        <b>{{'Sertifikatlar '}}:</b>  
                                        <form-group
                                                    class="cursor-pointer"
                                                    :name="'certificate_id'"
                                                >                           
                                                <tree-select
                                                        :async="true"
                                                        :normalizer="normalizerCertificates"
                                                        v-model="form.certificates"
                                                        :load-options="loadOptionsCertificates"
                                                        :multiple="true"
                                                    />
                                        </form-group>
                                    </div> 

                                    <div v-if="form.discount_id != 17">
                                        <b>{{'Endrim alan istifadəçilərin sayı '}}:</b>  
                                        <form-group
                                                name="discount_player_count"
                                            >
                                            <form-number v-model="form.discount_player_count" max-length="3" :placeholder="''"/>
                                        </form-group>
                                    </div>
                                </grid>
                            </div>
                        </div>
                    </grid-col>

                    <grid-col col="12" v-if="form.game_id">
                        <div>
                            <div>
                                <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                                    {{ translate(translateKey + '.Label.UserInfo') }}
                                </h3>
                            </div>
                            <div class="py-4">
                                <grid cols="3">
                                    <div class="border border-gray-200 rounded p-5 relative" v-for="(i, index) in form.users" :key="index">
                                        <span class="absolute -top-4 left-0 rounded-full right-0 m-auto w-7 h-7 font-bold inline-flex items-center justify-center bg-blue-500 text-white z-10">
                                            {{ (index + 1) }}
                                        </span>
                                        <span @click="removeCard(index)" v-if="index > 0" class="absolute -top-4 rounded-full -right-3 m-auto w-6 h-6 inline-flex text-xs cursor-pointer items-center justify-center bg-red-500 text-white z-10">
                                            <i class="icon-cancel1"></i>
                                        </span>
                                        <grid>
                                            
                                            <form-group
                                                class="cursor-pointer"
                                                :name="'users.'+index+'.user_id'"
                                                :label="translate('crm.Order.Label.CustomerSearch')"
                                            >
                                            
                                            <div v-if="index == 0 && preview.user.name">
                                                <span class="p-3"  >{{ order.user.name +' '+ order.user.surname + ' ' +( order.user.phone ? ' (' + order.user.phone + ') ' : '') + (order.user.coin ? order.user.coin.balance : '0')+' PGC'}}</span>
                                                <span style="display:none;">{{ i.user_id = preview.user.id }}</span>
                                            </div>

                                            <div v-else>                              
                                                <tree-select
                                                        :async="true"
                                                        :normalizer="normalizer"
                                                        v-model="i.user_id"
                                                        :load-options="loadOptions"
                                                    />                                               
                                            </div>
                                            </form-group>
                                            
                                            <form-group
                                                name="discount_id"
                                                :label="translate('crm.Order.Label.Discount')"
                                            >
                                                <form-tree-select :options="individualDiscounts" v-model="i.discount_id" :placeholder="''"/>
                                            </form-group>
                                            
                                            <form-group
                                                :name="index+'pay_with_coin'"
                                            >
                                                <input type="checkbox" :id="index+'pay_with_coin'" v-model="i.pay_with_coin">
                                                <label class="ml-2" :for="index+'pay_with_coin'">Coin ilə ödəniş</label>
                                            </form-group>
                                            
                                            <form-group name="price" :label="translate('crm.Order.Label.Price')">
                                                <div class="pl-3">{{ calcPrice(index)+" AZN / "+ calcPgcPrice(calcPrice(index)) + " PGC"  }}</div>
                                            </form-group>
                                        </grid>
                                    </div>
                                    
                                    <div class="flex flex-shrink-0 h-60 items-center justify-center border rounded border-gray-200" v-if="form.users.last.user_id">
                                        
                                        <app-button @click="newCard" type="button">
                                            {{ translate('crm.Order.Label.NewCard') }}
                                        </app-button>
                                    </div>
                                </grid>
                            </div>
                        </div>
                    </grid-col>

                </grid>
                <div>
                    <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                        {{ 'Yekun Qiymət:' }}
                        {{calcTotalPrice()}} AZN
                    </h3>
                </div>
                <grid cols="12">
                    <grid-col col="12" class="py-3">
                        <hr>
                    </grid-col>
                    <grid-col col="12">
                        <!-- {{this.error}} -->
                        <!-- <div v-if="error">{{this}}</div> -->
                        <app-button :disabled="form.submit_btn == 1 ? true : false" class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid-col>
                </grid>
            </form>
        </page-body>
    </page>
</template>

<script>
/*
 * Import Components
 * */

import {mapActions, mapState} from "vuex";
// import OrderUser from "./OrderUser";
// import OrderCertificates from "./OrderCertificates";
import TreeSelect from '@riophae/vue-treeselect';
import { ASYNC_SEARCH } from '@riophae/vue-treeselect';
// import FormCheckbox from '../../common/components/form/checkbox/FormCheckbox.vue';
// import { toHandlers } from "@vue/runtime-core";

const translateKey = 'crm.Order';

const previewObject = () => {
    return {
        department: {},
        user: {},
        price: 0,
        phone: null,
        player_count: 0,
        certificate_price: null,
        group_discount: null

    }
}

const formObject = (item = {}) => {
    return {
        submit_btn: 0,
        order_id: item.id,
        reception_id: null,
        game_id: item.game ? item.game.id : null,
        time: item.time || null,
        operators: [],
        hostesses: [],
        cash: item.cash || null,
        cashless: item.cashless || null,
        certificates: [] || null,
        discount_id: null,
        discount_player_count: null,
        users: [
            {
                user_id: null,
                discount_id: null,
                price: null,
                pay_with_coin: false,
            }
        ]
    }
}

export default {
    name: "OrderAccept",
    components: {TreeSelect},
    data() {
        return {
            translateKey,
            modalId: 'OrderAcceptModal',
            modelShow: false,
            preview: previewObject(),
            normalizer(i) {
                return {
                    id: i.id,
                    label: i.name+' '+i.surname + ( i.phone ? ' (' + i.phone + ') ' : '') + (i.coin ? i.coin.balance : '0')+' PGC' 
                }
            },
            normalizerCertificates(i) {
                return {
                    id: i.id,
                    label: '['+i.id+'] ' + '('+i.finish_date+') ' + i.user_name+' ' + ( i.phone ? ' (' + i.phone + ') ' : '') + ' | ' +i.total_price+' AZN endirim'
                }
            },
            
            form: formObject()
        }
    },
    created() {
        this.preview = previewObject();
        this.resetOrder();
        this.getSelectGames();
        this.getSelectDiscounts();
        this.getSetting('general');
        this.getSelectCertificates();
        

        // console.log(this.discounts.push({id: null,interest: null, name: 'sertifikat'}));
        // console.log(this.discounts);

        if (this.$route.params.id) {
            this.getOrder(this.$route.params.id)
            .then(r => {
                this.preview.price = this.order.price;
                this.preview.department = this.order.game.department;
                this.preview.user = this.order.user;
                this.preview.phone = this.order.phone;
                this.preview.player_count = this.order.player_count;
                this.preview.promo_code = this.order.promo_code;
                this.getGameTimes({game_id: this.order.game.id});
                this.form = formObject(this.order);
                for(let i = 0; i < (this.order.player_count - 1); i++) {
                    this.form.users.push({
                        user_id: null,
                        discount_id: null,
                        price: null,
                        pay_with_coin: false,
                    })
                }
            })
        }
    },
    watch: {
        'form.game_id'(val) {
            let game = this.games.find(i => i.id === val);
            if (game) {

                if(!this.order.price){
                    this.preview.price = game.price;
                }
                
                this.getGameTimes({game_id: game.id});
                this.getSelectEmployees({department_id: game.department.id});
            }
            else {
                this.preview = previewObject();
                this.form = formObject();
            }
        },
        'form.certificates'(val){
            var arrCer = []; 
            
            val.forEach((value, index) =>{
                arrCer.push(this.certificates.find(i=>i.id == value));
            });
            var that = this;
            this.preview.certificate_price = arrCer.reduce(function(tot, record) {
                if(record.sale_type === 1){
                    return tot + ((record.percent_of_price * (that.preview.price * record.player_count)) / 100);
                }else if (record.sale_type === 2){
                    return tot + ((record.percent_of_price * (record.price * record.player_count)) / 100);
                }
            },0);
            // console.log(this.preview.certificate_price, arrCer);
            
            // console.log(this.certificate_price);

            // let certificate = this.certificates.find(i=>i.id == val);
            // console.log(certificate);
            // this.preview.certificate_price = certificate.total_price; 
        },
    },
    computed: {
        ...mapState('OrderStore', ['order']),
        ...mapState('GameStore', ['games', 'gameTimes']),
        ...mapState('UserStore', ['users']),
        ...mapState('CertificatesStore', ['certificates']),
        ...mapState('DiscountStore', ['discounts']),
        ...mapState('EmployeeStore', ['employees']),
        ...mapState('SettingStore', ['setting']),

        receptions() {
            // function checkReceptions(id) {
            //     return id === 1;
            // }
            // return this.employees.filter(checkReceptions);
            // console.log(this.employees.filter(checkReceptions));
            // console.log(this.employees.filter(i => parseFloat(i.employee_type.id) === 1));

            // return this.employees.employee_type.filter(function (employee_type) {
            //     return employee_type === 1;  
            // });

            // return this.employees.filter(i => i.employee_type.id === 1)

            return this.employees.filter(i => parseFloat(i.employee_type.show_admin) === 1)
        },
        operators() {
            // function checkOperators(id) {
            //     return id === 2;
            // }

            // return this.employees.employee_type.filter(function (employee_type) {
            //     return employee_type === 2;  
            // });
            // console.log(this.employees.val);
            // return this.employees.filter(i => i.employee_type.id === 2)

            return this.employees.filter(i => parseFloat(i.employee_type.show_admin) === 1)
        },
        groupDiscounts() {
            return this.discounts.filter(i => parseFloat(i.type_id) === 1); 
        },
        individualDiscounts() {
            return this.discounts.filter(i => parseFloat(i.type_id) === 2); 
        },
        totalPrice() {
            return this.preview.price * this.preview.player_count; 
        },
        customGames() {
            if (this.user.department.id) {
                return this.games.filter(i => i.department.id === this.user.department.id);
            }
            return this.games;
        }
    },
    methods: {
        ...mapActions('SaleStore', ['setSale', 'getSales', 'getReports']),
        ...mapActions('OrderStore', ['getOrder', 'resetOrder', 'getOrders']),
        ...mapActions('GameStore', ['getSelectGames', 'getGameTimes']),
        ...mapActions('EmployeeStore', ['getSelectEmployees']),
        ...mapActions('UserStore', ['getSelectUsers']),
        ...mapActions('CertificatesStore', ['getSelectCertificates']),
        ...mapActions('DiscountStore', ['getSelectDiscounts']),
        ...mapActions('SettingStore', ['getSetting']),

        removeCard(index) {
            this.form.users.splice(index, 1);
        },
        newCard() {
            this.form.users.push({
                user_id: null,
                discount_id: null,
                price: null
            })
        },
        calcPrice(index) {
            const obj = this.form.users[index];
            let price = 0;
            if (obj) {
                const discount = this.discounts.find(i => i.id === obj.discount_id);
                if (discount && this.preview.price) {
                    price = this.preview.price - ((this.preview.price * discount.interest) / 100);
                    obj.price = price;
                    return price;
                }
                price = this.preview.price;
                obj.price = price;
                return price;
            }
            return price;
        },
        calcTotalPrice(){
            
            var TPrice = 0;

            var total = this.form.users.reduce( function(tot, record) {
                return tot + record.price;
            },0);
            
            let disUsers = parseFloat(parseFloat(total).toFixed(2));
            let usersCount = (this.form.entered_player_count || 0) - this.form.users.length;

            if(this.form.entered_player_count){
                TPrice = (this.preview.price * usersCount) + disUsers;
            }else{
                TPrice = disUsers;
            }
            if(this.preview.certificate_price){
                TPrice = TPrice - this.preview.certificate_price;
            }

            if(this.form.discount_id && this.form.discount_player_count){
                var dis = this.discounts.find(i => i.id === this.form.discount_id);
                TPrice = TPrice - (((this.preview.price * dis.interest) / 100) * this.form.discount_player_count);
                // console.log(TPrice);
            }

            return parseFloat(parseFloat(TPrice).toFixed(2));
        },
        calcPgcPrice(price) {
            return this.setting.value.pgc_price*price;
            //this.setting.value.pgc_price
        },
        /*
         * Game Select
         * */
        gameSelect(item) {
            this.preview.price = 0;
            const game = this.games.find(i => i.id === item);
            if (game) {
                this.preview.price = game.price;
                this.preview.department = game.department;
            }
        },
        /*
         * Create Modal
         * */
        createModal(item = {}) {
            this.modal(this.modalId)
            this.modelShow = false;
            this.resetError();
            this.formCreate(item);
        },
        /*
         * Save
         * */
        save() {
            this.form.submit_btn = 1;
            this.setSale(this.form)
            .then(r => {
                this.form.submit_btn = 0;
                if (r) {
                    if (this.form.order_id) {
                        this.$tabs.close();
                    }
                    this.form = formObject();
                    this.getOrders();
                    this.getSales();
                    this.getReports();
                }
            })
        },
        loadOptions({action, searchQuery, callback}) {
            if (action === ASYNC_SEARCH) {
                this.getSelectUsers({search: searchQuery, limit: 40})
                .then(r => {
                    callback(null, this.users)
                })
            }
        },
        loadOptionsCertificates({action, searchQuery, callback}) {
            if (action === ASYNC_SEARCH) {
                this.getSelectCertificates({search: searchQuery, limit: 40})
                .then(r => {
                    callback(null, this.certificates)
                })
            }
        },
    },
}
</script>

<style scoped>

</style>

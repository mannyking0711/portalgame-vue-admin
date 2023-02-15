<template>
    <modal :id="modalId" size="xs">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>
                        <div>
                            <form-group
                                :label="'Oyun'"
                                name="game_id"
                            >
                                <form-tree-select :options="customGames" displayExpr="name" v-model="form.game_id"/>
                            </form-group>
                        </div>

                        <div>
                            <form-group
                                :label="translate('')"
                                name="date"
                            >
                                <input type="date" v-model="form.date" class="form-group"/>
                            </form-group>
                        </div>

                        <div>
                            <form-group
                                :label="translate('crm.Order.Label.Time')"
                                name="time"
                            >
                                <form-tree-select :options="gameTimes" v-model="form.time"/>
                            </form-group>
                        </div>
                        
                        <div>
                            <form-group
                                :label="'oyunçu sayı'"
                                name="player_count"
                            >
                                <form-tree-select :options="playerNumber" displayExpr="name" v-model="form.player_count"/>
                            </form-group>
                        </div>

                        <div>
                            <form-group
                                :label="'İştirakçı nömrəsi'"
                                name="phone"
                            >
                                <span style="margin-left: 5px;">+994</span>
                                <form-number v-model="form.phone"/>
                            </form-group>
                        </div>
                        
                        <div v-if="form.game_id">
                            <b>Qiymət:</b> {{game_price}} ₼
                        </div>

                        <div v-if="form.game_id && form.player_count">
                            <b>Ümumi qiymət:</b> {{game_price*form.player_count}} ₼
                        </div>
                        
                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid>
                </form>
            </modal-body>
        </modal>
</template>

<script>
/*
 * Import Components
 * */

import {mapActions, mapState} from "vuex";

import TreeSelect from '@riophae/vue-treeselect';
import { ASYNC_SEARCH } from '@riophae/vue-treeselect';
const translateKey = 'crm.OrderForm';



export default {
    name: "NewOrderForm",
    // components: {TreeSelect},
    data() {
        return {
            translateKey,
            modalId: 'NewOrderFormModal',
            modelShow: false,
            playerNumber: [],
            game_price: null,
            form: {},
            normalizer(i) {
                return {
                    id: i.id,
                    label: i.name+' '+i.surname + ( i.phone ? ' (' + i.phone + ')' : '')
                }
            },
        }
    },
    watch: {
        'form.game_id'(val) {
            let game = this.games.find(i => i.id === val);
            this.form.price = this.game_price = game.price;
            if (game) {
                this.getGameTimes({game_id: game.id});
            }
        },
    },
    created() {
        for(let i = 2; i <= 40; i++) {
            this.playerNumber.push({id: i, name: i})
        }
        this.$eventBus.$off('NewOrderFormModal');
        this.$eventBus.$on('NewOrderFormModal', item => {
            this.modalShow = true;
            this.modal(this.modalId);
            this.formCreate();
            this.getSelectGames();
            if (item) {
                this.getProduct(item)
                .then(r => {
                    this.formCreate(this.product)
                })
            }
        });
    },
    computed: {
        ...mapState('OrderStore', ['orders', 'orderTotal']),
        ...mapState('GameStore', ['games', 'gameTimes']),
        ...mapState('UserStore', ['users']),
        

        permission() {
            return this.currentPage.permission;
        },
        
        customGames() {
            if (this.user.department.id) {
                return this.games.filter(i => i.department.id === this.user.department.id);
            }
            return this.games;
        }
    },
    methods: {
        ...mapActions('OrderStore', ['getOrders', 'setOrder', 'actionOrder', 'deleteOrder']),
        ...mapActions('GameStore', ['getSelectGames', 'getGameTimes']),
        ...mapActions('UserStore', ['getSelectUsers']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                game_id: item.game_id || null,
                date: item.date || null,
                time: item.time || null,
                player_count: item.player_count || null,
                phone: item.phone || null,
                price: item.price || null,
            }
            this.form = form;
            this.modelShow = true;
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
            this.setOrder(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getOrders();
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
    },
}
</script>

<style scoped>

</style>

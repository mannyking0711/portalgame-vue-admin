<template>
    <page>
        <page-head>
            <app-button property="primary " @click="setZero" class="mr-2" :class="[dayZero ? 'opacity-50' : '']" :disabled="dayZero">
                {{ translate('Günlük Xərc olmadı') }}
            </app-button>

            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="costs"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot="actionSlot" slot-scope="list">
                    <app-button
                        v-if="can(permission + '.update')"
                        @click="createModal(list.row.form)"
                        :sm="true"
                        :title="translate('button.Edit')"
                        icon="icon-edit-2"
                        property="primary"
                    />

                    <!-- <app-button
                        v-if="can(permission + '.action')"
                        :sm="true"
                        @click="action(list.row, 'active')"
                        :title="list.row.action.active ? translate('button.DeActivate') : translate('button.Activate')"
                        :icon="!list.row.action.active ? 'icon-eye-off' : 'icon-eye'"
                        property="success"
                    /> -->

                    <app-button
                        v-if="can(permission + '.delete')"
                        :sm="true"
                        @click="remove(list.row.id)"
                        :title="translate('button.Delete')"
                        icon="icon-trash-2"
                        property="danger"
                    />

                </div>
            </data-grid>
        </page-body>

        <modal :id="modalId" size="md">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>
                        <form-group
                            :label="'Məhsul adı'"
                            name="product_name"
                        >
                            <form-text v-model="form.product_name"/>
                        </form-group>

                        <div>
                            <form-group
                                :label="'Oyun Adı'"
                                name="game_id"
                            >
                                <form-tree-select @select="gameSelect" :options="customGames" v-model="form.game_id"/>
                            </form-group>
                        </div>

                        <div>
                            <form-group
                                :label="'Kategorya'"
                                name="category"
                            >
                                <form-tree-select :options="categories" v-model="form.category"/>
                            </form-group>
                        </div>

                        <form-group  
                            :label="'Qiymət'"
                            name="price"
                        >
                            <form-number v-model="form.price"/>
                        </form-group>
                        
                        <form-group
                            :label="'Nağd'"
                            name="cash"
                        >
                            <form-number v-model="form.cash"/>
                        </form-group>
                        
                        <form-group
                            :label="'Nağdsız'"
                            name="cashless"
                        >
                            <form-text v-model="form.cashless"/>
                        </form-group>

                        <form-group
                            :label="'Qeyd'"
                            :name="'note'"
                            :key="'note'"
                        >
                            <form-text-area type="simple" v-model="form.note"/>
                        </form-group>

                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid>
                </form>
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
const translateKey = 'crm.Costs';

export default {
    name: "CostsIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            columns: [
                {
                    caption: 'Məhsul adı',
                    dataField: 'product_name',
                    show: true
                },
                {
                    caption: 'Kategorya',
                    dataField: 'costCategory.name',
                    show: true
                },
                {
                    caption: 'Oyun',
                    dataField: 'game.name',
                    show: true
                },
                {
                    caption: 'Qiymət',
                    dataField: 'price',
                    show: true
                },
                {
                    caption: 'Nağd',
                    dataField: 'cash',
                    show: true
                },
                {
                    caption: 'Nağdsız',
                    dataField: 'cashless',
                    show: true
                },
                {
                    caption: 'Tarix',
                    dataField: 'created_at',
                    show: true,
                    search: false
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('CostsStore', ['costs', 'dayZero']),
        ...mapState('CostCategoriesStore', ['categories']),
        ...mapState('GameStore', ['games', 'gameTimes']),
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
        ...mapActions('CostsStore', ['getVacancies', 'setVacancie', 'actionVacancie', 'deleteVacancie', 'setDayZero', 'isDayZero']),
        ...mapActions('GameStore', ['getSelectGames', 'getGameTimes']),
        ...mapActions('CostCategoriesStore', ['getSelectCostCategories']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                product_name: item.product_name || null,
                price: item.price || null,
                note: item.note || null,
                cash: item.cash || null,
                cashless: item.cashless || null,
                game_id: item.game_id || null,
                category: item.category || null,
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
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteVacancie(id).then(r => this.getVacancies()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionVacancie({id: item.id, type, action}).then(r => this.getVacancies())
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
        setZero() {
            this.alert('Bu gün xərc 0 kimi qeyd olunacaq!').then(
                r => this.setDayZero()
                .then(
                r => {
                    if (r) {
                        this.getVacancies();
                        this.isDayZero();
                    }
                })
            )
        },
        /*
         * Save
         * */
        save() {
            this.setVacancie(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getVacancies();
                }
            })
        }
    },
    created() {
        this.getVacancies();
        this.getSelectGames();
        this.getSelectCostCategories();
        this.isDayZero();
    }
}
</script>

<style scoped>

</style>

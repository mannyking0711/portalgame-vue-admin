<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="holidays"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Table.Action')"
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

        <modal :id="modalId" size="xs">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body>
                <form @submit.prevent="save">
                    <grid>
                        <form-group :required="true" :label="'Xüsusi günün adı'" name="name">
                            <form-text v-model="form.name"/>
                        </form-group>

                        <form-group :required="true" :label="'Tarixindən'" name="date">
                            <input type="date" :value.prop="form.date" v-model="form.date" class="form-element">
                        </form-group>

                        <form-group  :label="'Tarixinə qədər'" name="to_date">
                            <input type="date" :value.prop="form.to_date" v-model="form.to_date" class="form-element">
                            <!-- <form-date :value.prop="'2017-07-05'" v-model="form.to_date"/> -->
                        </form-group>

                        <!-- <form-group :required="true" :label="'Status'" name="name" style="border:none;" >
                            <label class="label ml-4 d-inline" for="work_day1">İş günüdür: &nbsp;<input id="work_day1" type="radio" name="work_day" value="true" checked v-model="form.workday"/> </label>
                            <label class="label ml-4 d-inline" for="work_day2">İş günü deyil: &nbsp; <input id="work_day2" type="radio" name="work_day" value="false" v-model="form.workday"/></label>
                        </form-group> -->

                        <form-group :label="'İş Saatı (neçədən - neçeyə)'" name="work_time">  
                            <form-text placeholder="09:00-22:00" v-time-two v-model="form.work_time" />
                        </form-group>

                        <form-group :label="'Yalnız'" name="game_id">
                                <form-tree-select :options="customGames" displayExpr="name" v-model="form.game_id"/>
                        </form-group>

                        <form-group :label="'Faiz'" name="percentage">  
                            <form-number placeholder="" v-model="form.percentage" />
                        </form-group>

                        <form-group :label="'Faiz Endirim / Artım '" name="percent_type" style="border:none;" >
                            <label class="label ml-4 d-inline" for="percent_type2">Endirim: &nbsp; <input id="percent_type2" type="radio" name="percent_type" value="discount" checked v-model="form.percent_type"/></label>
                            <label class="label ml-4 d-inline" for="percent_type1">Artım: &nbsp; <input id="percent_type1" type="radio" name="percent_type" value="increase"  v-model="form.percent_type"/> </label>
                        </form-group>

                        <form-group :label="'Bütün günü bağla'" name="close_all" style="border:none;" >
                            <label class="label ml-4 d-inline" for="close_all">Bağla: &nbsp; <input id="close_all" type="checkbox" name="close_all" checked v-model="form.close_all"/></label>
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
import TreeSelect from '@riophae/vue-treeselect';
import { ASYNC_SEARCH } from '@riophae/vue-treeselect';

const formObject = (item = {}) => {
    return {
        id: item.id || null,
        name: item.name || null,
        date: item.date || null,
        to_date: item.to_date || item.date,
        work_time: item.work_time || null,
        percentage: item.percentage || null,
        percent_type: item.percent_type || null,
        close_all: item.close_all || null,
        game_id: item.game_id

    }
}

const modalId = 'createModal';
const translateKey = 'crm.Holiday';

export default {
    name: "HolidaysIndex",
    data() {
        return {
            translateKey,
            modalId,
            columns: [
                {
                    caption: 'Bayram',
                    dataField: 'name',
                    show: true
                },
                {
                    caption: 'Başlanğıc tarixi',
                    dataField: 'date',
                    show: true
                },
                {
                    caption: 'Bitiş tarixi',
                    dataField: 'to_date',
                    show: true
                },
            ],
            form: formObject()
        }
    },
    computed: {
        ...mapState('HolidayStore', ['holidays']),
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
        ...mapActions('HolidayStore', ['getHolidays', 'setHoliday', 'actionHoliday', 'deleteHoliday']),
        ...mapActions('GameStore', ['getSelectGames', 'getGameTimes']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const self = this;
            self.form = formObject(item);
        },
        /*
         * Create Modal
         * */
        createModal(item = {}) {
            this.modal(this.modalId)
            this.resetError();
            this.formCreate(item);
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteHoliday(id).then(r => this.getHolidays()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type];
            this.actionHoliday({id: item.id, type, action}).then(r => window.location.reload())
        },
        /*
         * Save
         * */
        save() {
            this.setHoliday(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getHolidays();
                }
            })
        }
    },
    created() {
        this.getHolidays();
    }
}
</script>

<style scoped>

</style>

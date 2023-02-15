<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="departments"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot="slotPhones" slot-scope="list">
                    <badge property="info" v-for="(i, index) in list.row.phones" :key="'p_' + index">{{ i }}</badge>
                </div>
                <div slot="actionSlot" slot-scope="list">
                    <app-button
                        v-if="can(permission + '.update')"
                        @click="createModal(list.row.form)"
                        :sm="true"
                        :title="translate('button.Edit')"
                        icon="icon-edit-2"
                        property="primary"
                    />

                    <app-button
                        v-if="can(permission + '.action')"
                        :sm="true"
                        @click="action(list.row, 'active')"
                        :title="list.row.action.active ? translate('button.DeActivate') : translate('button.Activate')"
                        :icon="!list.row.action.active ? 'icon-eye-off' : 'icon-eye'"
                        property="success"
                    />

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
                    <grid cols="12">

                        <grid-col col="12">
                            <form-group
                                :label="translate(translateKey + '.Label.Email')"
                                name="email"
                            >
                                <form-text v-model="form.email" />
                            </form-group>
                        </grid-col>

                        <grid-col col="4" v-for="(lang, index) in appLanguages" :key="'name'+index">
                            <form-group
                                :label="translate(translateKey + '.Label.Name') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                                :name="'translates.'+lang.code+'.name'"
                            >
                                <form-text v-model="form.translates[lang.code].name"/>
                            </form-group>
                        </grid-col>

                        <grid-col col="12" v-for="(lang, index) in appLanguages" :key="'address'+index">
                            <form-group
                                :label="translate(translateKey + '.Label.Address') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                                :name="'translates.'+lang.code+'.address'"
                            >
                                <form-text v-model="form.translates[lang.code].address"/>
                            </form-group>
                        </grid-col>

                        <grid-col col="6">
                            <form-group
                                :label="translate(translateKey + '.Label.Weekday')"
                                name="worktime.weekday"
                            >
                                <form-text placeholder="09:00-18:00" v-time-two v-model="form.worktime.weekday" />
                            </form-group>
                        </grid-col>

                        <grid-col col="6">
                            <form-group
                                :label="translate(translateKey + '.Label.Weekend')"
                                name="worktime.weekend"
                            >
                                <form-text placeholder="09:00-18:00" v-time-two v-model="form.worktime.weekend" />
                            </form-group>
                        </grid-col>

                        <grid-col col="6">
                            <form-group
                                :label="translate(translateKey + '.Label.Phone')"
                                name="phones"
                            >
                                <form-number v-phone v-model="form.phones[0]" placeholder="99450 XXX XX XX" />
                            </form-group>
                        </grid-col>

                        <grid-col col="6">
                            <form-group
                                :label="translate(translateKey + '.Label.Phone')"
                                name="phones"
                            >
                                <form-number v-phone v-model="form.phones[1]" placeholder="99450 XXX XX XX" />
                            </form-group>
                        </grid-col>

                        <grid-col col="12">
                            <form-group
                                :label="translate(translateKey + '.Label.Map')"
                                name="google_map"
                            >
                                <form-text-area style="min-height: 120px" v-model="form.google_map" @input="mapInput"/>
                            </form-group>
                        </grid-col>

                        <grid-col col="12">
                            <app-button class="justify-center" property="success" type="submit">
                                {{ translate('button.Save') }}
                            </app-button>
                        </grid-col>
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
const translateKey = 'crm.Department';

export default {
    name: "DepartmentIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            columns: [
                {
                    caption: translateKey + '.Label.Name',
                    dataField: 'name',
                    show: true
                },
                {
                    caption: translateKey + '.Label.Phone',
                    dataField: 'phones',
                    show: true,
                    slot: 'slotPhones'
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('DepartmentStore', ['departments']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('DepartmentStore', ['getDepartments', 'setDepartment', 'actionDepartment', 'deleteDepartment']),
        /*
         * Form Reset
         * */
        formCreate(item = {}) {
            const self = this;
            const form = {
                id: item.id || null,
                phones: item.phones || [],
                worktime: item.worktime || {
                    weekday: null,
                    weekend: null
                },
                email: item.email || null,
                google_map: item.map || null,
                translates: {}
            }
            self.appLanguages.filter(i => {
                form.translates[i.code] = {
                    name: item.translates && item.translates[i.code] ? item.translates[i.code].name : null,
                    address: item.translates && item.translates[i.code] ? item.translates[i.code].address : null,
                }
            });
            self.form = form;
            self.modelShow = true;
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
            this.alert().then(r => this.deleteDepartment(id).then(r => this.getDepartments()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionDepartment({id: item.id, type, action}).then(r => this.getDepartments())
        },
        /*
         * Map Input
         * */
        mapInput(val) {
            this.form.google_map = val ? this.getIframeSrc(val) : null;
        },
        /*
         * Save
         * */
        save() {
            this.setDepartment(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getDepartments();
                }
            })
        }
    },
    created() {
        this.getDepartments();
    }
}
</script>

<style scoped>

</style>

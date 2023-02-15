<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="bonusTypes"
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
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>
                        <form-group
                            :label="'Ad'"
                            name="name"
                        >
                            <form-text v-model="form.name"/>
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
const translateKey = 'crm.EmployeeBonusType';

export default {
    name: "EmployeeBonusTypeIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            columns: [
                {
                    caption: translateKey + '.Label.Department',
                    dataField: 'name',
                    show: true,
                    allowFiltering: false
                },
            ],
            form: {}
        }
    },
    
    computed: {
        ...mapState('BonusTypeStore', ['bonusTypes']),
        
        permission() {
            return this.currentPage.permission;
        }
    },
    
    methods: {
        ...mapActions('BonusTypeStore', ['getBonusTypes', 'setBonusType', 'actionBonusType', 'deleteBonusType']),

        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                name: item.name || null,
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
            this.alert().then(r => this.deleteBonusType(id).then(r => this.getBonusTypes()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionBonusType({id: item.id, type, action}).then(r => this.getBonusTypes())
        },
        /*
         * Save
         * */
        save() {
            this.setBonusType(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getBonusTypes();
                }
            })
        }
    },
    created() {
        this.getBonusTypes();
    }
}
</script>

<style scoped>

</style>

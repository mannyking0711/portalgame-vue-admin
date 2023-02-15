<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="categories"
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
                    caption: 'Ad',
                    dataField: 'name',
                    show: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('CostCategoriesStore', ['categories']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('CostCategoriesStore', ['getCostCategories', 'setCostCategorie', 'actionCostCategorie', 'deleteCostCategorie']),
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
            this.alert().then(r => this.deleteCostCategorie(id).then(r => this.getCostCategories()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type];
            this.actionCostCategorie({id: item.id, type, action}).then(r => this.getCostCategories())
        },
        /*
         * Save
         * */
        save() {
            this.setCostCategorie(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getCostCategories();
                }
            })
        }
    },
    created() {
        this.getCostCategories();
    }
}
</script>

<style scoped>

</style>

<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="franchises"
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
                            :label="'Direktor'"
                            name="director"
                        >
                            <form-text v-model="form.director"/>
                        </form-group>
                        
                        <form-group  
                            :label="'Direktor əlaqə nömrəsi'"
                            name="tel"
                        >
                            <form-text v-model="form.tel"/>
                        </form-group>                        

                        <form-group  
                            :label="'Emails'"
                            name="emails"
                        >
                            <form-tag v-model="form.emails"/>
                        </form-group>  

                        <form-group
                            :label="'Filial'"
                            name="department_id"
                        >
                            <form-tree-select :options="select_departments" v-model="form.department_id"/>
                        </form-group>

                        <form-group
                            :label="'Games'"
                            name="games"
                        >
                            <form-tree-select :options="customGames" :multiple="true" displayExpr="name" v-model="form.games"/>
                        </form-group>

                        <form-group  
                            class="cursor-pointer"
                            :name="'user_id'"
                            label="İstifadəçi axtar"
                        >
                            <tree-select
                                :async="true"
                                :normalizer="normalizer"
                                v-model="form.user_id"
                                :load-options="loadOptions"
                            />
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

const modalId = 'createModal';
const translateKey = 'crm.Franchise';

export default {
    name: "FranchiseIndex",
    components: {TreeSelect},
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            normalizer(i) {
                return {
                    id: i.id,
                    label: i.name+' '+i.surname + ( i.phone ? ' (' + i.phone + ')' : '')
                }
            },
            columns: [
                {
                    caption: 'Direktor',
                    dataField: 'director',
                    show: true
                },
                {
                    caption: 'Əlaqə nömrə',
                    dataField: 'tel',
                    show: true
                },
                {
                    caption: 'Filial',
                    dataField: 'department.name',
                    show: true
                },
            ],
            form: {}
        }
    },
    watch: {
        'form.department_id'(val) {
            let department = this.select_departments.find(i => i.id === val);
            if(department){
                this.getSelectGames({department_id: department.id});
                this.customGames();
                // console.log(this.employees);
            }
        },
    },

    computed: {
        ...mapState('FranchiseStore', ['franchises']),
        ...mapState('DepartmentStore', ['select_departments']),
        ...mapState('GameStore', ['games']),
        ...mapState('UserStore', ['users']),

        customGames() {
            if (this.form.department_id) {
                return this.games.filter(i => i.department.id === this.form.department_id);
            }
            return this.games;
        },
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('FranchiseStore', ['getFranchises', 'setFranchise', 'actionFranchise', 'deleteFranchise']),
        ...mapActions('DepartmentStore', ['getSelectDepartments']),
        ...mapActions('GameStore', ['getSelectGames']),
        ...mapActions('UserStore', ['getSelectUsers']),

        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                department_id: item.department_id || [],
                director: item.director || null,
                tel: item.tel || null,
                emails: item.emails || [],
                games: item.games || [],
                user_id: item.user_id || null
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
            this.alert().then(r => this.deleteFranchise(id).then(r => this.getFranchises()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionFranchise({id: item.id, type, action}).then(r => this.getFranchises())
        },
        /*
         * Save
         * */
        save() {
            this.setFranchise(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getFranchises();
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
    created() {
        this.getFranchises();
        this.getSelectDepartments();
        this.getSelectUsers();
    }
}
</script>

<style scoped>

</style>

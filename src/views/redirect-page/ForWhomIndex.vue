<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="contents"
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
                            :label="'Title' + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.title'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].title"/>
                        </form-group>

                        <form-group  
                            :label="'Icon'"
                            name="icon"
                        >
                            <form-text v-model="form.icon"/>
                        </form-group>
                        
                        <form-group
                            :label="'Description' + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.description'"
                            v-for="(lang, index) in appLanguages"
                            :key="'description'+index"
                        >
                            <form-text-area v-model="form.translates[lang.code].description"/>
                        </form-group>

                        <!-- <form-group  
                            :label="'Ətraflı'"
                            name="description"
                        >
                            <form-text-area v-model="form.description"/>
                        </form-group> -->

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
const translateKey = 'crm.FroWhom';

export default {
    name: "ForWhomIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            columns: [
                {
                    caption: 'Title',
                    dataField: 'title',
                    show: true
                },
                {
                    caption: 'Icon',
                    dataField: 'icon',
                    show: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('ForWhomStore', ['contents']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('ForWhomStore', ['getContents', 'setContent', 'actionContent', 'deleteContent']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                icon: item.icon || null,
                translates: {}
            }
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
                    title: item.translates && item.translates[i.code] ? item.translates[i.code].title : null,
                    description: item.translates && item.translates[i.code] ? item.translates[i.code].description : null,
                }
            });
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
            this.alert().then(r => this.deleteContent(id).then(r => this.getContents()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionContent({id: item.id, type, action}).then(r => this.getContents())
        },
        /*
         * Save
         * */
        save() {
            this.setContent(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getContents();
                }
            })
        }
    },
    created() {
        this.getContents();
    }
}
</script>

<style scoped>

</style>

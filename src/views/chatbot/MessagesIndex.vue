<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            
            <data-grid
                :data-source="messages"
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

        <modal :id="modalId" size="lg">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid cols="12">
                        <grid-col col="12">
                            
                        <form-group
                            :label="translate(translateKey + '.Label.Name') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.Text'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text-area v-model="form.translates[lang.code].text"/>
                        </form-group>

                        <form-group
                            :label="translate('Tip')"
                            name="type_id"
                        >
                            <form-tree-select :options="types" v-model="form.type_id"/>
                        </form-group>

                        <form-group
                            v-if="form.type_id == 1"
                            :label="translate('Buttonlar')"
                            name="buttons"
                        >   
                            <div v-for="(lang, index) in appLanguages" :key="index">
                                <form-group name="value.phones" class="w-full" v-for="(button, index) in form.translates[lang.code].buttons" :key="index">
                                    <grid cols="12">
                                        
                                        <grid-col col="12" class="flex">
                                            <label class="bg-gray-300 flex items-center h-10 px-3">
                                                Ad:
                                            </label>
                                            <form-text v-model="button.name"/>
                                            <label class="bg-gray-300 flex items-center h-10 px-3">
                                                Dəyər:
                                            </label>
                                            <form-text v-model="button.id"/>
                                        </grid-col>
                                        
                                    </grid>
                                </form-group>
                            </div>

                                <grid-col col="2" class="justify-end flex items-center pr-3">
                                    <app-button :sm="true" property="primary" @click="addElement('buttons')">
                                        <i class="icon-add"></i>
                                    </app-button>
                                    <app-button :sm="true" property="danger" @click="removeElement(index, 'buttons', form)">
                                        <i class="icon-cancel"></i>
                                    </app-button>
                                </grid-col>
                        </form-group>

                        </grid-col>
                        
                        <grid-col col="12" v-if="form.type_id == 3">
                            <grid cols="3">
                                <form-group
                                    
                                    :label="'Mətndə gözlənilən açar söz' + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                                    :name="'search'"
                                    v-for="(lang, index) in appLanguages"
                                    :key="index"
                                >
                                    <form-text v-model="form.translates[lang.code].search"/>
                                </form-group>
                            </grid>
                        </grid-col>

                        <grid-col col="12" v-if="form.type_id == 2">
                            <grid cols="1">
                                <form-group
                                    :label="'Qarşılıq gələn dəyər'"
                                    :name="'value'"
                                >
                                    <form-tree-select :options="btn_values" displayExpr="name" v-model="form.value"/>
                                </form-group>
                            </grid>
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
const translateKey = 'crm.Messages';

export default {
    name: "MessagesIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            columns: [
                {
                    caption: 'Mesaj',
                    dataField: 'text',
                    show: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('BotMessagesStore', ['messages','btn_values']),
        ...mapState('BotMessageTypeStore', ['types']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('BotMessagesStore', ['getMessages', 'setMessage', 'getSelectBtnValues', 'actionMessage', 'deleteMessage']),
        ...mapActions('BotMessageTypeStore', ['getSelectTypes']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                type_id: item.type_id || null,
                value: item.value || null,
                translates: {}
            }
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
                    text: item.translates && item.translates[i.code] ? item.translates[i.code].text : null,
                }
            });
            this.appLanguages.filter(i => {
                form.translates[i.code].buttons = [{
                    name: item.translates && item.translates[i.code] ? item.translates[i.code].name : null,
                    id: item.translates && item.translates[i.code] ? item.translates[i.code].id : null,
                }]
            });
            
            this.form = form;
            this.modelShow = true;
        },
        /*
         * Add Element
         * */
        addElement(type) {
            this.appLanguages.filter(i => {
                this.form.translates[i.code][type].push({name: null, value: null})
            });
        },
        /*
         * Remove Element
         * */
        removeElement(index, type) {
            this.appLanguages.filter(i => {
                this.form.translates[i.code][type].splice(index, 1)
            });
        },
        /*
         * Create Modal
         * */
        createModal(item = {}) {
            this.modal(this.modalId)
            this.modelShow = false;
            this.resetError();
            this.formCreate(item);
            this.getSelectTypes();

        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteMessage(id).then(r => this.getMessages()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionMessage({id: item.id, type, action}).then(r => this.getMessages())
        },
        /*
         * Save
         * */
        save() {
            this.setMessage(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getMessages();
                }
            })
        }
    },
    created() {
        this.getMessages();
        this.getSelectBtnValues();
    }
}
</script>

<style scoped>

</style>

<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="questions"
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
                            :label="translate(translateKey + '.Label.title') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.title'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].title"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.variant_a') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.variant_a'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].variant_a"/>
                        </form-group>
                        
                        <form-group
                            :label="translate(translateKey + '.Label.variant_b') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.variant_b'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].variant_b"/>
                        </form-group>
                        
                        <form-group
                            :label="translate(translateKey + '.Label.variant_c') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.variant_c'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].variant_c"/>
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
const translateKey = 'crm.SquidGameQuestions';

export default {
    name: "SquidGameQuestions",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            columns: [
                {
                    caption: 'Sual',
                    dataField: 'title',
                    show: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('QuestionStore', ['questions']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('QuestionStore', ['getQuestions', 'setQuestion', 'actionQuestion', 'deleteQuestion']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                translates: {}
            }
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
                    title: item.translates && item.translates[i.code] ? item.translates[i.code].title : null,
                    variant_a: item.translates && item.translates[i.code] ? item.translates[i.code].variant_a : null,
                    variant_b: item.translates && item.translates[i.code] ? item.translates[i.code].variant_b : null,
                    variant_c: item.translates && item.translates[i.code] ? item.translates[i.code].variant_c : null,
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
            this.alert().then(r => this.deleteQuestion(id).then(r => this.getQuestions()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionQuestion({id: item.id, type, action}).then(r => this.getQuestions())
        },
        /*
         * Save
         * */
        save() {
            this.setQuestion(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getQuestions();
                }
            })
        }
    },
    created() {
        this.getQuestions();
    }
}
</script>

<style scoped>

</style>

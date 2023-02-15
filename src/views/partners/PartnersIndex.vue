<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="partners"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot-scope="list" slot="photoTemplate">
                    <img :src="list.row.photo" alt="" class="w-full h-full object-cover">
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
                    <grid>
                        <!-- <form-group
                            :label="translate(translateKey + '.Label.Name') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.name'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].name"/>
                        </form-group> -->

                        <!-- <form-group
                            :label="translate(translateKey + '.Label.Content') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.Content'"
                            v-for="(lang, index) in appLanguages"
                            :key="'content'+index"
                        >
                            <form-html-editor type="simple" v-model="form.translates[lang.code].content"/>
                        </form-group> -->

                        <form-group
                            :border="false"
                            :label="translate(translateKey + '.Label.Photo')"
                            name="logo"
                        >
                            <form-photo :photo="photo_url" imgHeight="130px" v-model="form.logo"/>
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
// import FormPartners from '../../common/components/form/files/FormFiles.vue';

const modalId = 'createModal';
const translateKey = 'crm.Partners';

export default {
    name: "PartnersIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photo_url: null,
            columns: [
                {
                    caption: translateKey + '.Label.Logo',
                    dataField: 'photo',
                    show: true,
                    width: 80,
                    slot: 'photoTemplate'
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('PartnersStore', ['partners']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('PartnersStore', ['getPartners', 'setPartner', 'actionPartner', 'deletePartner']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                logo: null,
                // translates: {}
            }
            // this.appLanguages.filter(i => {
            //     form.translates[i.code] = {
            //         name: item.translates && item.translates[i.code] ? item.translates[i.code].name : null,
            //         content: item.translates && item.translates[i.code] ? item.translates[i.code].content : null,
            //     }
            // });
            this.photo_url = item.photo || null;
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
            this.alert().then(r => this.deletePartner(id).then(r => this.getPartners()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionPartner({id: item.id, type, action}).then(r => this.getPartners())
        },
        /*
         * Save
         * */
        save() {
            this.setPartner(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getPartners();
                    console.log(this.modalId);
                }
            })
        }
    },
    created() {
        this.getPartners();
    }
}
</script>

<style scoped>

</style>

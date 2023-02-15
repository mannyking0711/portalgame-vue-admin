<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="rows"
                :columns="columns"
                :action-column-width="150"
                :action-column-text="translate(translateKey + '.Table.Action')"
            >
                <div slot="downloadTemplate" slot-scope="list" class="content-center">
                    <div class="inline-flex items-center">
                        <img style="height:50px !important;" :src="list.row.qr_url" :alt="list.row.slug" class=" mb-1">
                    </div>
                    <a :href="list.row.originalQrUrl" target="_blank" :download="true" alt="list.row.slug" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-4 rounded inline-flex items-center">
                        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                        <span>Download</span>
                    </a>
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
                        <form-group :label="'Başlıq'" name="slug">
                            <form-text v-model.lazy="form.slug"/>
                        </form-group>

                        <form-group :label="'Link'" name="target_url">
                            <form-text v-model.lazy="form.target_url"/>
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

const formObject = (item = {}) => {
    return {
        id: item.id || null,
        target_url: item.target_url || null,
        slug: item.slug || null,
    }
}

const modalId = 'createModal';
const translateKey = 'crm.User';

export default {
    name: "QrCodesIndex",
    data() {
        return {
            translateKey,
            modalId,
            columns: [
                {
                    caption: 'Ad',
                    dataField: 'slug',
                    show: true
                },
                {
                    caption: 'Url',
                    dataField: 'target_url',
                    show: true
                },
                {
                    caption: 'QR',
                    dataField: 'status',
                    slot: 'downloadTemplate',
                    show: true,
                    width: 150,
                    alignment: 'center'
                }
            ],
            form: formObject()
        }
    },
    computed: {
        ...mapState('QrCodesStore', ['rows']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('QrCodesStore', ['getQrs', 'setQr', 'actionQr', 'deleteQr']),
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
            this.alert().then(r => this.deleteQr(id).then(r => this.getQrs()))
        },
        
        /*
         * Save
         * */
        save() {
            this.setQr(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getQrs();
                }
            })
        }
    },
    created() {
        this.getQrs();
    }
}
</script>

<style scoped>

</style>

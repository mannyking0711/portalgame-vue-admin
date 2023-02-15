<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="sliders"
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

        <modal :id="modalId" size="xs">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>

                        <form-group
                            :border="false"
                            :label="translate(translateKey + '.Label.Photo')"
                            name="photo_name"
                        >
                            <form-photo :photo="photo_url" imgHeight="130px" v-model="form.photo_name"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.Name') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.name'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].name"/>
                        </form-group>

                        <!-- <form-group :label="'Etiket tipi'" name="tag">
                            <form-tree-select :options="tags" valueExpr="value" v-model="form.tag"/>
                        </form-group>

                        <form-group
                            v-if="form.tag === 'custom'"
                            :border="false"
                            :label="'Etiket şəkili'"
                            name="tag_photo"
                        >
                            <form-photo :photo="tag_photo_url" imgHeight="130px" v-model="form.tag_photo_name"/>
                        </form-group> -->

                        <form-group
                            :label="translate(translateKey + '.Label.Link')"
                            name="link"
                        >
                            <form-text v-model="form.link"/>
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
const translateKey = 'crm.Slider';

export default {
    name: "SliderIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photo_url: null,
            tags: [
                {
                    id: 1, name: 'Boş', value: null
                },
                {
                    id: 2, name: 'Yeni', value: 'new'
                },
                {
                    id: 3, name: 'Endirim', value: 'discount'
                },
                {
                    id: 4, name: 'Xüsusi', value: 'custom'
                }
            ],
            columns: [
                {
                    caption: translateKey + '.Label.Photo',
                    dataField: 'photo',
                    show: true,
                    width: 80,
                    slot: 'photoTemplate'
                },
                {
                    caption: translateKey + '.Label.Name',
                    dataField: 'name',
                    show: true
                },
            ],
            form: {}
        }
    },
    watch: {
        'form.tag'(val) {
            console.log(this.form.tag);
        }
    },
    computed: {
        ...mapState('SliderStore', ['sliders']),
        permission() {
            return this.currentPage.permission;
        },
    },
    methods: {
        ...mapActions('SliderStore', ['getSliders', 'setSlider', 'actionSlider', 'deleteSlider']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                link: item.link || null,
                photo_name: null,
                // tag_photo_name: null,
                // tag: item.tag || null,
                translates: {}
            }
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
                    name: item.translates && item.translates[i.code] ? item.translates[i.code].name : null,
                }
            });
            // this.tag_photo_url = item.tag_photo || null,
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
            this.alert().then(r => this.deleteSlider(id).then(r => this.getSliders()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionSlider({id: item.id, type, action}).then(r => this.getSliders())
        },
        /*
         * Save
         * */
        save() {
            this.setSlider(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getSliders();
                }
            })
        }
    },
    created() {
        this.getSliders();
    }
}
</script>

<style scoped>

</style>

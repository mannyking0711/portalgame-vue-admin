<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="directors"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate('Əməliyyatlar')"
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

        <modal :id="modalId" size="md">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>
                        <form-group
                            label="slug"
                            :name="'slug'"
                        >
                            <form-text v-model="form.slug"/>
                        </form-group>

                        

                        <form-group
                            :label="translate('Ad') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.name'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].name"/>
                        </form-group>

                        <form-group
                            :label="translate('Vəzifə') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.title'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text v-model="form.translates[lang.code].title"/>
                        </form-group>

                        <form-group
                            :label="translate('Məlumat') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.description'"
                            v-for="(lang, index) in appLanguages"
                            :key="'description'+index"
                        >
                            <form-html-editor v-model="form.translates[lang.code].description"/>
                        </form-group>

                        <form-group name="social_medias"  v-for="(media, index) in form.social_medias" :key="index">
                            <grid cols="12" >
                                <grid-col col="5" class="flex">
                                    <label class="bg-gray-300 flex items-center h-10 px-3">
                                        Icon:
                                    </label>
                                    <form-text v-model="media.icon"/>
                                </grid-col>
                                <grid-col col="5" class="flex">
                                    <label class="bg-gray-300 flex items-center h-10 px-3">
                                        Link:
                                    </label>
                                    <form-text v-model="media.link"/>
                                </grid-col>
                                <grid-col col="2" class="justify-end flex items-center pr-3">
                                    <a :sm="true" property="primary" v-if="index === 0" @click="addElement()">
                                        <i class="icon-add"></i>
                                    </a>
                                    <a :sm="true" property="danger" v-else @click="removeElement(index, form)">
                                        <i class="icon-cancel"></i>
                                    </a>
                                </grid-col>
                            </grid>
                        </form-group>  

                        <form-group
                            :border="false"
                            :label="translate(translateKey + '.Label.Photo')"
                            name="photo"
                        >
                            <form-photo :col="3" path="director-info" :photo="photoItem" style="width:200px;" v-model="form.photo"/>
                        </form-group>

                        <form-group
                            :border="false"
                            :label="translate('Setifikatlar')"
                            name="photos"
                        >
                            <form-photos :col="2" path="director-info" :item-photos="photoItems" img-height="110px" v-model="form.photos"/>
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
const translateKey = 'crm.DirectorInfo';

export default {
    name: "DirectorIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItem: null,
            columns: [
                {
                    caption: 'Ad',
                    dataField: 'name',
                    show: true
                },
            ],
            photoItems: [],
            form: {}
        }
    },
    computed: {
        ...mapState('DirectorInfoStore', ['directors']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('DirectorInfoStore', ['getDirectors', 'setDirector', 'actionDirector', 'deleteDirector']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                slug: item.slug || null,
                translates: {},
                social_medias: item.social_medias || [{icon: '', link: ''}],
                photo: null,
                photos: item.photos && item.photos.length ? item.photos.map(i => i.name) : [],
            }
            // form.social_medias.push(item.socials)
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
                    name: item.translates && item.translates[i.code] ? item.translates[i.code].name : null,
                    description: item.translates && item.translates[i.code] ? item.translates[i.code].description : null,
                    title: item.translates && item.translates[i.code] ? item.translates[i.code].title : null,
                }
            });
            this.photoItem = item.photo;
            this.photoItems = item.photos || [];
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
            // console.log(item.socials);
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteDirector(id).then(r => this.getDirectors()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionDirector({id: item.id, type, action}).then(r => this.getDirectors())
        },
        /*
         * Save
         * */
        save() {
            this.setDirector(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getDirectors();
                }
            })
        },
        /*
         * Add Element
         * */
         addElement() {
            this.form.social_medias.push({icon: null, link: null})
        },
        /*
         * Remove Element
         * */
        removeElement(index) {
            this.form.social_medias.splice(index, 1);
        },
    },
    created() {
        this.getDirectors();
    }
}
</script>

<style scoped>

</style>

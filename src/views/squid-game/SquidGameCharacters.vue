<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="characters"
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
                            :label="'Ad'"
                            name="name"
                        >
                            <form-text v-model="form.name"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.description') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                            :name="'translates.'+lang.code+'.description'"
                            v-for="(lang, index) in appLanguages"
                            :key="index"
                        >
                            <form-text-area v-model="form.translates[lang.code].description"/>
                        </form-group>

                        <form-group
                            :label="'Bal1'"
                            name="point1"
                        >
                            <form-text v-model="form.point1"/>
                        </form-group>

                        <form-group
                            :label="'Bal2'"
                            name="point2"
                        >
                            <form-text v-model="form.point2"/>
                        </form-group>

                        <form-group
                            :border="false"
                            :label="translate(translateKey + '.Label.profile')"
                            name="profile"
                        >
                            <form-photo :col="2" path="game" :photo="profile_url" img-height="110px" v-model="form.profile"/>
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
import FormTextArea from '../../common/components/form/textarea/FormTextArea.vue';

const modalId = 'createModal';
const translateKey = 'crm.SquidGameCharacters';

export default {
  components: { FormTextArea },
    name: "SquidGameCharacters",
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
                {
                    caption: 'Bal 1',
                    dataField: 'point1',
                    show: true
                },
                {
                    caption: 'Bal 2',
                    dataField: 'point2',
                    show: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('CharacterStore', ['characters']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('CharacterStore', ['getCharacters', 'setCharacter', 'actionCharacter', 'deleteCharacter']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                name: item.name || null,
                point1: item.point1 || null,
                point2: item.point2 || null,
                profile: item.profile || null,
                translates: {}
            }
            this.profile_url = item.photo || null;
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
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
            this.alert().then(r => this.deleteCharacter(id).then(r => this.getCharacters()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionCharacter({id: item.id, type, action}).then(r => this.getCharacters())
        },
        /*
         * Save
         * */
        save() {
            this.setCharacter(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getCharacters();
                }
            })
        }
    },
    created() {
        this.getCharacters();
    }
}
</script>

<style scoped>

</style>

<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="squidGames"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate('crm.GameStatus.Label.Action')"
            >
                <div slot="usersSlot" slot-scope="list">
                    <div v-if="list.row.users && list.row.users.length > 0" class="gap-4 flex items-center flex-wrap">
                        <div class="inline-flex" v-for="(user, index) in list.row.users" :key="index" :title="user.fullname">
                            <img :src="user.photo_url" class="w-10 h-10 rounded-full object-cover" :class="{'opacity-30': !user.active}" alt="">
                        </div>
                    </div>
                </div>
                <div slot="actionSlot" slot-scope="list">
                    <app-button
                        v-if="can(permission + '.update')"
                        @click="createModal(list.row)"
                        :sm="true"
                        :title="translate('button.Edit')"
                        icon="icon-edit-2"
                        property="primary"
                    />

                    <a
                        :href="list.row.link"
                        target="_blank"
                        class="button button--warning button--icon-left button--sm"
                        title="Oyun linki"
                    >
                        <i class="icon-link"></i>
                    </a>

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
                    <grid>
                        <form-group
                            label="Komanda adı"
                            name="name"
                        >
                            <form-text v-model="form.name"/>
                        </form-group>

                        <div class="border p-4">
                            <div class="flex items-center justify-between mb-4 pb-2 border-b">
                                <h1 class="flex items-center text-lg font-semibold">İştirakçılar</h1>
                                <app-button icon="icon-plus" @click="itemAction('add')" type="button">
                                    Əlavə et
                                </app-button>
                            </div>
                            <grid cols="4">
                                <div v-for="(i, index) in form.users" :key="index" class="p-4 border rounded relative">
                                    <div class="absolute top-1 right-1">
                                        <app-button
                                            :sm="true"
                                            type="button"
                                            icon="icon-cancel"
                                            @click="itemAction('remove', index)"
                                        />
                                    </div>
                                    <form-group
                                        :border="false"
                                        label="Şəkil"
                                        class="mb-2"
                                        name="value.logo">
                                        <form-photo
                                            imgHeight="150px"
                                            :photo="i.photo_url ? i.photo_url : null"
                                            v-model="i.photo_path"
                                        />
                                    </form-group>
                                    <form-group
                                        label="Ad soyad"
                                        :name="'items.'+index+'.fullname'"
                                    >
                                        <form-text v-model="i.fullname"/>
                                    </form-group>
                                    <div class="mt-3" v-if="i.id && i.active">
                                        <app-button
                                            :full="true"
                                            type="button"
                                            class="text-center justify-center"
                                            @click="action(i, index)"
                                        >
                                            Uduzdu
                                        </app-button>
                                    </div>
                                    <div v-else-if="i.id && !i.active">
                                        <span class="button flex justify-center w-full bg-red-500 mt-3 text-white" style="cursor:default ;">
                                            Oyunu tərk etdi
                                        </span>
                                    </div>
                                </div>
                            </grid>
                        </div>

                        <div>
                            <app-button class="justify-center" property="success" type="submit">
                                {{ translate('button.Save') }}
                            </app-button>
                        </div>
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
const translateKey = 'crm.SquidGame';

export default {
    name: "SquidGameIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            columns: [
                {
                    caption: 'Qrup adı',
                    dataField: 'name',
                    show: true,
                    width: 220
                },
                {
                    caption: 'İştirakçılar',
                    dataField: 'users',
                    show: true,
                    slot: 'usersSlot'
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('SquidGameStore', ['squidGames']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('SquidGameStore', ['getSquidGames', 'setSquidGame', 'actionSquidGame', 'deleteSquidGame']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            this.form = {
                id: item.id || null,
                name: item.name || null,
                users: item.users || [
                    {
                        fullname: null,
                        photo_path: null,
                    }
                ],
            }
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
            this.alert().then(r => this.deleteSquidGame(id).then(r => this.getSquidGames()))
        },
        /*
         * Action
         * */
        action(item, index) {
            this.alert('İştirakçını oyundan çıxartmaq istədiyinizə əminsiz ?')
            .then(r => {
                this.actionSquidGame({id: item.id}).then(r => {
                    const find = this.form.users[index];
                    const data = r.data.response;
                    find.active = data.active ? 1 : 0;
                    this.getSquidGames()
                })
            })
        },
        itemAction(type, index = null) {
            if (type === 'remove') {
                this.form.users.splice(index, 1);
            }
            else if (type === 'add') {
                this.form.users.push({
                    fullname: null,
                    photo_path: null
                });
            }
        },
        /*
         * Save
         * */
        save() {
            this.setSquidGame(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getSquidGames();
                }
            })
        }
    },
    created() {
        this.getSquidGames();
    }
}
</script>

<style scoped>

</style>

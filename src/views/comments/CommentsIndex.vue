<template>
    <page>
        <page-head>
            <!-- <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button> -->
        </page-head>

        <page-body>
            <data-grid
                :data-source="comments"
                :columns="columns"
                :action-column-width="150"
                :action-column-text="translate('crm.User.Table.Action')"
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
                <div slot-scope="list" slot="ratingTemplate">
                    <div>
                        <i v-for="item in list.row.rating" :key="item" class="icon-star3" style="color:yellow"></i>
                        <i v-for="item in (5-list.row.rating)" :key="item" class="icon-star3" style="color:gray"></i>
                    </div>
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
                        
                        <form-group :label="'İstifadəçi'">
                            <b class="ml-2">{{form.user}}</b>
                        </form-group>
                        
                        <form-group :label="'Oyun'">
                            <b class="ml-2">{{ form.game }}</b>    
                        </form-group>

                        <form-group :label="'Rating'">
                            <div class="ml-2">
                                <i v-for="item in form.rating" :key="item" class="icon-star3 star"       style="color:yellow"></i>
                                <i v-for="item in 5 - form.rating" :key="item" class="icon-star3 star" style="color:gray"></i>
                            </div>
                            <form-number v-model="form.rating" :max-length="5"></form-number>
                        </form-group>

                        <form-group :label="'Rəy'" name="comment">
                            <form-text-area v-model="form.comment"/>
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
// import CoinsUser from "./CoinsUser";
// import TreeSelect from '@riophae/vue-treeselect';
// import { ASYNC_SEARCH } from '@riophae/vue-treeselect';

const formObject = (item = {}) => {
    return {
        id: item.id || null,
        game: item.game || null,
        user: item.user || null,
        rating: item.rating || null,
        comment: item.comment || null,
    }
}

const modalId = 'createModal';
const translateKey = 'crm.coin';

export default {
    name: "CommentsIndex",
    // components: {TreeSelect},
    data() {
        return {
            translateKey,
            modalId,
            permission: 'coins',
            columns: [
                {
                    caption: 'crm.User.Table.FullName',
                    dataField: 'user.fullname',
                    show: true
                },
                {
                    caption: 'Oyun',
                    dataField: 'game.name',
                    show: true,
                },
                {
                    caption: 'Rating',
                    dataField: 'rating',
                    show: true,
                    slot: 'ratingTemplate'
                },
                {
                    caption: 'Tarix',
                    dataField: 'created_at',
                    show: true,
                },
                {
                    caption: 'Tarix',
                    dataField: 'created_at2',
                    show: true,
                },
            ],
            form: formObject()
        }
    },
    computed: {
        ...mapState('CommentsStore', ['comments']),

    },
    methods: {
        ...mapActions('CommentsStore', ['getComments', 'setComment', 'deleteComment']),
        /*
         * Form Create
         * */
       

        formCreate(item = {}) {
            const self = this;
            self.form = formObject(item);
        },
        getStars(rating){
        },
        /*
         * Create Modal
         * */
        createModal(item = {}) {
            this.modal(this.modalId)
            this.resetError();
            this.formCreate(item);
        },
        
        save() {
            this.setComment(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getComments();
                }
            })
        },

        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteComment(id).then(r => this.getComments()))
        },
        
    },
    created() {
        this.getComments();
    },
    
}
</script>

<style scoped>

</style>

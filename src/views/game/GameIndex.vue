<template>
    <page>
        <page-head>
            <app-button property="primary"  @click="changePos">
                {{ translate('Sıranı dəyiş') }}
            </app-button>
            &nbsp;
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="games"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot="actionSlot" slot-scope="list">
                    <app-button
                        v-if="can(permission + '.update')"
                        @click="createModal(list.row)"
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

        <GameForm />
    </page>

</template>

<script>
/*
 * Import Components
 * */
import {mapActions, mapState} from 'vuex';
import GameForm from "./GameForm";

const translateKey = 'crm.Game';

export default {
    name: "GameIndex",
    components: {GameForm},
    data() {
        return {
            translateKey,
            columns: [
                {
                    caption: 'Sıra nömrəsi',
                    dataField: 'position',
                    show: true,
                    width:'80px'
                },
                {
                    caption: translateKey + '.Label.Name',
                    dataField: 'name',
                    show: true
                },
                {
                    caption: translateKey + '.Label.Department',
                    dataField: 'department.name',
                    show: true
                },
            ],
            // arrGames: arrGames,
        }
    },
    computed: {
        ...mapState('GameStore', ['games', 'arrGames']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('GameStore', ['getGames', 'getArrGames', 'actionGame', 'deleteGame', 'changePosition']),
        changePos(){
            this.changePosition().then(r => this.getGames());
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteGame(id).then(r => this.getGames()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionGame({id: item.id, type, action}).then(r => this.getGames())
        },
        /*
        * Create Modal
        * */
        createModal(item = {}) {
            this.$eventBus.$emit('GameFormModal', item?.id || null);
        }
    },
    created() {
        this.getGames();
        this.getArrGames();
        console.log(this.arrGames);
    }
}
</script>

<style scoped>

</style>

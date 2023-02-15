<template>
    <modal :id="modalId" size="lg">
        <modal-head>
            <modal-title>{{ currentPage.title }}</modal-title>
        </modal-head>
        <modal-body v-if="modelShow">
            <form @submit.prevent="save">
                <grid cols="12">

                    <grid-col col="12">

                        <grid cols="12">

                            <grid-col col="6">
                                <grid>

                                    <form-group
                                        :label="translate(translateKey + '.Label.Department')"
                                        name="department_id"
                                    >
                                        <form-tree-select :options="select_departments" v-model="form.department_id"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.Level')"
                                        name="game_level_id"
                                    >
                                        <form-tree-select :options="gameLevels" v-model="form.game_level_id"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.Language')"
                                        name="game_languages"
                                    >
                                        <form-tree-select :multiple="true" :options="gameLanguages" v-model="form.game_languages"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.PlayerMin')"
                                        name="player_min"
                                    >
                                        <form-number v-model="form.player_min"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.PlayerMax')"
                                        name="player_max"
                                    >
                                        <form-number v-model="form.player_max"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.Minute')"
                                        name="minute"
                                    >
                                        <form-number v-model="form.minute"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.Interval')"
                                        name="interval"
                                    >
                                        <form-number v-model="form.interval"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.Age')"
                                        name="age"
                                    >
                                        <form-tree-select :options="ages" v-model="form.age"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.WeekdayPrice')"
                                        name="weekday_price"
                                    >
                                        <form-number v-model="form.weekday_price"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.WeekendPrice')"
                                        name="weekend_price"
                                    >
                                        <form-number v-model="form.weekend_price"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.GameCategories')"
                                        name="game_categories"
                                    >
                                        <form-tree-select :options="gameCategories" :multiple="true" displayExpr="name" v-model="form.game_categories"/>
                                    </form-group>
                                
                                    <form-group
                                        :label="translate(translateKey + '.Label.GameType')"
                                        name="game_type"
                                    >
                                        <form-tree-select :options="gameStatus" displayExpr="name" v-model="form.game_type"/>
                                    </form-group>

                                    <form-group
                                        :label="translate('Sıra nömrəsi')"
                                        name="postiton"
                                    >
                                        <form-text v-model="form.position" />
                                    </form-group>
                                </grid>
                            </grid-col>

                            <grid-col col="6">
                                <grid>
                                    <form-group
                                        :label="translate(translateKey + '.Label.Name') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                                        :name="'translates.'+lang.code+'.name'"
                                        v-for="(lang, index) in appLanguages"
                                        :key="'name'+index"
                                    >
                                        <form-text v-model="form.translates[lang.code].name"/>
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.About') + (appLanguages.length > 1 ? ' ('+lang.name+')' : '')"
                                        :name="'translates.'+lang.code+'.about'"
                                        v-for="(lang, index) in appLanguages"
                                        :key="'about'+index"
                                    >
                                        <form-text-area style="min-height: 152px" v-model="form.translates[lang.code].about"/>
                                    </form-group>
                                    
                                    <form-group
                                        :label="translate(translateKey + '.Label.Weekday')"
                                        name="worktime.weekday"
                                    >
                                        <form-text placeholder="09:00-18:00" v-time-two v-model="form.worktime.weekday" />
                                    </form-group>

                                    <form-group
                                        :label="translate(translateKey + '.Label.Weekend')"
                                        name="worktime.weekend"
                                    >
                                        <form-text placeholder="09:00-18:00" v-time-two v-model="form.worktime.weekend" />
                                    </form-group>
                                    
                                    <form-group
                                        :label="'Seo Keywords'"
                                        name="keywords"
                                    >
                                        <form-tag v-model="form.keywords" />
                                    </form-group>
                                    
                                </grid>
                            </grid-col>

                            <grid-col col="12">
                                <hr>
                            </grid-col>

                            <grid-col col="12">
                                <form-group
                                    :border="false"
                                    :label="translate(translateKey + '.Label.Photos')"
                                    name="photos"
                                >
                                    <form-photos :col="2" path="game" :item-photos="photoItems" img-height="110px" v-model="form.photos"/>
                                </form-group>
                            </grid-col>

                            <!-- <grid-col col="6">
                                <form-group
                                    :border="false"
                                    :label="translate(translateKey + '.Label.cover_img')"
                                    name="cover_img"
                                >
                                    <form-photo :col="2" path="game" :photo="cover_url" img-height="110px" v-model="form.cover_img"/>
                                </form-group>
                            </grid-col> -->
                        </grid>

                    </grid-col>

                    <grid-col col="12">
                        <hr>
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
</template>

<script>
/*
 * Import Components
 * */

import {mapActions, mapState} from "vuex";

const translateKey = 'crm.Game';

export default {
    name: "GameForm",
    data() {
        return {
            translateKey,
            modalId: 'GameFormModal',
            modelShow: false,
            gameStatus: [
                {id:'coming', name: 'Çox yaxında'}
            ],
            ages: [],
            categories: [],
            photoItems: [],
            cover_url: null,
            form: {}
        }
    },
    created() {
        for(let i = 1; i <= 25; i++) {
            this.ages.push({id: i, name: '+' + i})
        }
        this.$eventBus.$off('GameFormModal');
        this.$eventBus.$on('GameFormModal', item => {
            this.modalShow = true;
            this.modal(this.modalId);
            this.formCreate();
            this.getSelectDepartments();
            this.getSelectGameLevels();
            this.getSelectGameLanguages();
            this.getSelectGameCategories();
            if (item) {
                this.getGame(item)
                .then(r => {
                    this.formCreate(this.game)
                })
            }
        });
    },
    computed: {
        ...mapState('GameStore', ['game']),
        ...mapState('DepartmentStore', ['select_departments']),
        ...mapState('GameLevelStore', ['gameLevels']),
        ...mapState('GameLanguageStore', ['gameLanguages']),
        ...mapState('GameCategoriesStore', ['gameCategories']),
    },
    methods: {
        ...mapActions('GameStore', ['getGames', 'getGame', 'setGame']),
        ...mapActions('DepartmentStore', ['getSelectDepartments']),
        ...mapActions('GameLevelStore', ['getSelectGameLevels']),
        ...mapActions('GameLanguageStore', ['getSelectGameLanguages']),
        ...mapActions('GameCategoriesStore',['getSelectGameCategories']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                department_id: item.department_id || null,
                game_level_id: item.game_level_id || null,
                game_languages: item.game_languages || [],
                game_categories: item.game_categories || [],
                weekday_price: item.weekday_price || null,
                weekend_price: item.weekend_price || null,
                game_type: item.game_type || null,
                minute: item.minute || null,
                interval: item.interval || 0,
                age: item.age || null,
                player_min: item.player_min || null,
                player_max: item.player_max || null,
                photos: item.photos && item.photos.length ? item.photos.map(i => i.name) : [],
                cover_img: item.cover_img || null,
                position: item.position || null,
                keywords: item.keywords || null,
                worktime: item.worktime || {
                    weekday: null,
                    weekend: null
                },
                translates: {}
            }
            this.photoItems = item.photos || [];
            this.cover_url = item.cover || null;
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
                    name: item.translates && item.translates[i.code] ? item.translates[i.code].name : null,
                    about: item.translates && item.translates[i.code] ? item.translates[i.code].about : null,
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
         * Save
         * */
        save() {
            this.setGame(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getGames();
                }
            })
        }
    },
}
</script>

<style scoped>

</style>

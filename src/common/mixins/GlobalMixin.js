import Helpers from "../../plugins/helpers";
import { mapState, mapActions } from 'vuex'
import { routers } from "../../router/modules";

const GlobalMixin = {
    computed: {
        ...mapState('AppStore', ['appLanguages', 'photos', 'appLanguage', 'applicationStart', 'errors']),
        ...mapState('AuthStore', ['permissions', 'user']),
        /*
         * Mobile Detect
         * */
        mobile() {
            let check = false;
            (function(a) {
                if (
                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
                )
                    check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        routeTab() {
            if (!this.currentPage.key)
                return this.currentPage.title;
        },
        /*
         * Sidebars
         * */
        sidebars() {
            return this.getSidebar();
        },
        currentPage() {
            return this.getCurrentPage() ? this.getCurrentPage() : {};
        }
    },
    methods: {
        ...Helpers,
        ...mapActions('AppStore', ['start', 'setErrors']),
        getCurrentPage() {
            try {
                const route = this.$route ? this.$route : {};
                const find = this.recursiveSearch('name', route.name, routers)
                if (find)
                    return {...find, title: this.translate(find.title), permission: find.permission.split('.')[0] }
                return {};
            } catch (e) {

            }
        },
        /*
         * Get Sidebar
         * */
        getSidebar(items = []) {
            let modules = items.length ? items : routers;
            let result = [];
            modules.filter((r, i) => {
                result[i] = {
                    label: this.translate(r.title),
                    icon: r.icon,
                    route: r.name,
                    sidebar: r.sidebar,
                    can: this.can(r.permission),
                }
                if (r.children && r.children.length && r.children.find(i => i.sidebar)) {
                    result[i].children = this.getSidebar(r.children);
                }
            })
            return result.filter(r => r.sidebar);
        },
        /*
         * Translates
         * */
        translate(key = null, params = {}) {
            const result = params.result ? params.result : 'yes',
                search = params.search ? params.search : null,
                replace = params.replace ? params.replace : null,
                label = params.label ? params.label : null,
                lang = params.lang ? params.lang : this.appLanguage;

            const languages = this.appLanguages ? this.appLanguages : [];

            if (lang) {
                let language = languages && languages.length ? languages.find(i => i.code === lang) : null;
                if (language) {
                    const translates = language.translates.find(i => i.key === key);
                    if (translates && key) {
                        if (search && replace) {
                            if (Array.isArray(search) && Array.isArray(replace)) return this.replaceAll(translates.text, search, replace);
                            else return translates.text.replace(search, replace);
                        } else if (label) return translates.text.replace(':label', this.translate(label).toLowerCase());
                        return translates.text;
                    }
                }
            }
            if (result === 'yes') return key;
        },
        /*
         * Modal
         * */
        modal(id) {
            const element = document.getElementById(id);
            if (element) {
                document.body.classList.add('overflow-hidden');
                if (element.classList.contains('modal-open')) {
                    document.body.classList.remove('overflow-hidden');
                    this.$eventBus.$emit('modalClose', id)
                } else {
                    this.$eventBus.$emit('modalOpen', id)
                }
                element.classList.toggle('modal-open')
            }
        },
        modalClose() {
            const parent = document.querySelector('.modal-open')
            if (parent) {
                const id = parent.getAttribute('id');
                this.modal(id);
            }
        },
        /*
         * Reset Error
         * */
        resetError() {
            this.setErrors([]);
        },
        /*
         * Modal
         * */
        alert(text = null, title = null) {
            title = title ? title : this.translate('notification.Warning.Title');
            text = text ? text : this.translate('notification.Delete.Description');
            return swal.fire({
                    icon: 'question',
                    title,
                    text,
                    content: 'input',
                    confirmButtonText: '<i class="icon-check"></i>' + this.translate('button.Verify'),
                    confirmButtonColor: '#79B1B9',
                    cancelButtonText: '<i class="icon-cancel"></i>' + this.translate('button.Close'),
                    showCancelButton: true,
                    cancelButtonColor: '#7A9CC7'
                })
                .then(r => {
                    return new Promise(function(resolve, reject) {
                        if (r.value) {
                            resolve();
                        }
                    })
                })
        },
        sRemove() {
            title = title ? title : this.translate('notification.Warning.Title');
            text = text ? text : this.translate('notification.Delete.Description');
            swal({
                    text: 'Search for a movie. e.g. "La La Land".',
                    content: "input",
                    button: {
                        text: "Search!",
                        closeModal: false,
                    },
                })
                .then(r => {
                    return new Promise(function(resolve, reject) {
                        if (r.value) {
                            resolve();
                        }
                    })
                })
        },
        /*
         * Notification
         * */
        notification(message, type = 'success', params = {}) {
            this.$toast.open({
                message: this.translate(message),
                type,
                position: params.position || 'top-right',
                duration: params.duration || 3000,
                ...params
            });
        }
    }
}

export default GlobalMixin;
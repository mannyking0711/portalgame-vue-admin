<template>
    <div class="modal" v-bind="$props" @click="closeModal" tabindex="0">
        <div :class="'modal-box modal-box--' + size">
            <slot/>
        </div>
    </div>
</template>

<script>
/*
 * Import Components
 * */

export default {
    name: "Modal",
    props: {
        size: {
            default: 'md'
        },
        bgStatic: {
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        closeModal(event) {
            if (event.target.classList.contains('modal-open') && !this.bgStatic) {
                this.modalClose(event)
            }
        }
    }
}
</script>

<style scoped>
@import "./Modal.css";
</style>

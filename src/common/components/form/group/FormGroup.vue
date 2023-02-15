<template>
    <div class="form" :class="{'form-error': errors[name]}" @click="$emit('click', $event)">
        <form-label v-if="label">{{ translate(label) }} <span v-if="required" style="color:red;">*</span></form-label>
        <div class="form-group" :class="{'border-none': !border}">
            <slot/>
        </div>
        <form-alert-error v-if="errors[name]">{{ errors[name] }}</form-alert-error>
    </div>
</template>

<script>
/*
 * Import Components
 * */

export default {
    name: "FormGroup",
    props: {
        name: {
            default: null
        },
        label: {
            default: null
        },
        border: {
            default: true
        },
        required: {default: false}
    },
    data() {
        return {}
    },
}
</script>

<style scoped>

</style>

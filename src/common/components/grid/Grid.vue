<template>
    <div :class="'w-full grid gap-'+space+' grid-cols-'+customCols">
        <slot></slot>
    </div>
</template>

<script>
/*
 * Import Components
 * */

export default {
    name: "Grid",
    props: {
        cols: {
            default: 1
        },
        space: {
            default: 5
        }
    },
    computed: {
        customCols() {
            if (this.mobile) {
                return 1;
            }
            return this.cols;
        }
    },
    data() {
        return {}
    }
}
</script>

<style scoped>

</style>

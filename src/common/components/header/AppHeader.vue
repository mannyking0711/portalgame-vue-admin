<template>
    <header class="header">
       <AppNotifications />
       <AppHeaderUserDropdown />
    </header>
</template>

<script>
/*
 * Import Components
 * */

import AppHeaderUserDropdown from "./AppHeaderUserDropdown";
import AppNotifications from "./AppNotifications.vue";
export default {
    name: "AppHeader",
    components: { AppHeaderUserDropdown, AppNotifications},
    data() {
        return {}
    },
}
</script>

<style scoped>
    @import "./AppHeader.css";
</style>

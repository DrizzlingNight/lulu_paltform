<template>
    <div class="router-item" @click="click">
        <img v-if="icon && icon.length > 0" class="icon" :src="icon">
        <div v-else style="width:32px;margin-left:15px;"></div>
        <div :class="needDropDown=='true' ? 'drop-down-text text' : 'text'">{{title}}</div>
        <div style="flex: 1;"></div>
        <img v-if="needDropDown=='true'" class="more" src="/static/ui/admin/down.png">
    </div>
</template>

<script>
    export default {
        name: 'AdminSidebarItem',
        props: {
            title: String,
            icon: String,
            needDropDown: String,
        },
        methods: {
            click() {
                this.$emit('click')
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '/imports/ui/scss/mixin';
    @import "/imports/ui/scss/theme";

    $itemW: 260px;
    $bg-color: rgba(28, 30, 55, 1);
    $text-color: #ffffff;
    $title-color: #ffc455;
    $color: rgba(28, 30, 55, 1);

    .router-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 48px;

        &:hover {
            background-color: $sidebar-router-hover;
        }

        .icon {
            margin-left: 15px;
            width: 32px;
            height: 32px;
        }

        .text {
            margin-left: 15px;
            color: $text-color;
        }
        
        .drop-down-text {
            color: $title-color;
        }

        .more {
            width: 15px;
            margin-right: 20px
        }

    }
</style>
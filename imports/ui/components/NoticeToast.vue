<template>
  <div class="d-flex flex-row">
    <button @click="clicked" class="tips-content">{{tipsContent}}</button>
  </div>
</template>



<script>

import i18n from "./../lang";

export default {
    name: 'NoticeToast',
    computed: {
        publicNotice() {
            const notice = localStorage.getItem('publicNotice')
            return JSON.parse(notice)
        },
        tipsContent() {
            return this.publicNotice ? (this.publicNotice[i18n.locale] || '') : ''
        }
    },
    methods: {
        clicked() {

            if (this.publicNotice) {
                let locale = i18n.locale.split('-')
                locale = locale.length > 1 ? 'link-' + locale[1] : null
                let link = locale ? this.publicNotice[locale] : this.publicNotice.link
                link = link || this.publicNotice.link
                if (link) {
                    window.open(link, "_blank")
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">

.tips-content {
    font-weight: 500;
    font-size: 16px;
    color: #FFFFFF;
    white-space: pre-wrap;
    text-align: start;
}

</style>
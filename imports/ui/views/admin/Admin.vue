<template>
    <div>
        <h1 style="color:#000000;">{{$t('admin.title')}}</h1>

        <h3 class="mt-5">{{$t('admin.currentRole') + this.role }}</h3>
    </div>
</template>

<script>

export default {
    mounted () {
        this._checkRoles()  
    },
    data() {
        return {
            role: '',
        }
    },
    methods: {
            _checkRoles() {
                const self = this
                Meteor.call('getUserRoles', (err, res) => {
                    const role = res[0]
                    if (role != null) {
                        if (role.user._id === Meteor.userId()){
                            self.role = role.role._id
                        }
                    }
                })
            },
    }
}

</script>
<template>
    <div class="container-fluid">
        <div class="row">
            <div v-if="!$root.isMobile" class="col-12 col-md-5 col-xl-4">
                <div>
                    <router-link to="/add" class="btn btn-primary mb-3"
                        ><font-awesome-icon icon="plus" />
                        {{ $t("Add New Monitor") }}</router-link
                    >
                </div>
                <div class="btn btn-primary mb-3" @click="checkIndexStatus">
                    <font-awesome-icon icon="check" />
                    {{ $t("Check Index Status") }}
                </div>
                <MonitorList :scrollbar="true" />
            </div>

            <div class="col-12 col-md-7 col-xl-8 mb-3">
                <!-- Add :key to disable vue router re-use the same component -->
                <router-view :key="$route.fullPath" />
            </div>
        </div>
    </div>
</template>

<script>
import MonitorList from "../components/MonitorList.vue";
import axios from "axios";

export default {
    components: {
        MonitorList,
    },
    data() {
        return {};
    },
    methods: {
        checkIndexStatus: async function () {
            let res;
            await axios
                .get("/api/check-google-index")
                .then((res) => console.log(res));
            return res;
        },
    },
};
</script>

<style lang="scss" scoped>
.container-fluid {
    width: 98%;
}
</style>

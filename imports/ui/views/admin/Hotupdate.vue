<template>
  <div class="admin-main">
    <div class="routeTitle">
      <div class="mainTitle">{{$t('admin.systemSetting')}}</div>
      <div class="subTitle">{{$t('admin.hotUpdate')}}</div>
    </div>

    <!--拖拽框 文件解析上傳-->
    <upload-files
        id="dropzone"
        ref="myDropzone"
        :parentId="parentId"
        :action="folderUrl"
        :options="dropzoneOptions"
        :filetypes="['csv']"
        :useCustomSlot="true">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">{{$t('admin.hotUpdateTips1')}}<em>{{$t('admin.upload')}}</em>{{$t('admin.uploadImg')}}</div>
    </upload-files>

    <!--數據更新-->
    <el-button type="primary" @click="updateCsv">updateCsv</el-button>
    <el-button type="primary" @click="updateLandInfo">updateLandInfo</el-button>
    <div class="logShow">

    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logging from "/imports/api/logging";
import UploadFiles from "/imports/ui/components/UploadFiles"
const logger = logging.getLogger(module.id);

export default {
  name: "Hotupdate",
  components: {
    UploadFiles
  },
  data() {
    return {
      loading:false,
      dropzoneOptions: {
        autoProcessQueue: false,
        url: 'xx', // 上傳圖片地址
      },
      parentId: 'xxx', // 如果你拖動文件夾裏麵還有圖片 那要傳一個id
      folderUrl: 'xx' // 創建文件夾的地址
    };
  },

  computed: {
    ...mapGetters(["tokenInfo","tokenInfos","game","games"]),
  },
  watch:{
  },
  methods: {
    updateCsv(){
      Meteor.call('admin_hotUploadStart',(err,data)=>{
        if(err){
          console.error(err)
        }else{
          console.log(data)
        }
      });
    },
    updateLandInfo(){
      Meteor.call('admin_migrations',(err,data)=>{
        if(err){
          console.error(err)
        }else{
          console.log(data)
        }
      });
    },
  },
  meteor: {
    $subscribe: {
      hotUpdate: []
    },
    hotUpdate(){
      return
    }
  }
};
</script>

<style  lang="scss" scoped>
</style>

<template>
  <div style="width: 100%">
    <div
            :id="id"
            ref="dropzoneElement"
            :class="{ 'vue-dropzone dropzone': includeStyling }">
      <div
              v-if="useCustomSlot"
              class="dz-message"
              ref="renderMessage">
        <slot>拖拽上傳文件夾</slot>
      </div>
    </div>
    <div>
      <div v-for="(file,index) in files" :id="index" class="uploadItem">
        <el-button v-if="file.updateStatus==='wait'" type="danger" @click="deleteSelectedFiles(index)">刪除</el-button>
        <div class="name">{{file.fullPath?file.fullPath:file.name}}</div>
        <div class="status" :class="{error:file.updateStatus==='error',success:file.updateStatus==='success',}">{{file.updateStatus}}</div>
      </div>
    </div>
    <el-button style="margin-bottom: 10px" type="primary" @click="uploadSelectedFiles">上傳數據</el-button>

  </div>

</template>

<script>
    import Dropzone from 'dropzone';
    import XLSX from 'xlsx';

    Dropzone.autoDiscover = false;

    export default {
        name: 'uploadFiles',

        props: {
            // 組件定義的id值 默認 dropzone
            id: {
                type: String,
                required: true,
                default: 'dropzone'
            },
            action: String,
            requestProject: String,
            parentId: String,
            options: {
                type: Object,
            },
            includeStyling: {
                type: Boolean,
                default: true
            },
            requestParams: {
                type: Object,
                default: null
            },
            // 銷毀dropzone
            destroyDropzone: {
                type: Boolean,
                default: true
            },
            useCustomSlot: {
                type: Boolean,
                default: false
            },
            filetypes: Array,
            limitSize: {
                type: Number,
                default: 1024 * 1024
            },
            removeFlag: {
                type: Boolean,
                default: false
            },
            hasBeenMounted: {
                type: Boolean,
                default: false
            }
    },

        data() {
            return {
                idList: [],
                folder: [],
                uploadFolder: [],
                uploadFlag: false,
                files: [],
            };
        },

        computed: {
            dropzoneSettings() {
                // 設置默認寬高
                let defaultValues = {
                    thumbnailWidth: 200,
                    thumbnailHeight: 200
                };
                // 限製上限 1000
                this.options.parallelUploads = 1000;
                Object.keys(this.options).forEach(function(key) {
                    defaultValues[key] = this.options[key]
                }, this);
                return defaultValues
            }
        },
        created() {
            this.requestUrl = window.location.origin;
            // this.requestUrl = this.requestUrl; 這裏自己修改自己對應的接口地址
        },

        mounted() {
            this.dropzone = new Dropzone(this.$refs.dropzoneElement, this.dropzoneSettings);
            let vm = this;

            // 將文件添加到上傳列表
            this.dropzone.on('addedfile', this.fileProcess);

            this.dropzone.on('sending', (file, xhr, formData) => {
                // 找id根據名字
                if (file.fullPath) {
                    const pathArr = file.fullPath.split('/');
                    const LEN = pathArr.length - 2;
                    const id = this.findId(this.folder, pathArr, 0, LEN);
                    formData.append('parentId', id);
                } else {
                    formData.append('parentId', this.parentId);
                }
            });

            // 將多文件添加到上傳列表
            this.dropzone.on('addedfiles', files => {
                // 如果是拖動上傳文件夾和圖片 或者多個圖片
                this.clearSuccessFiles();
                this.$emit('files-added', files);
            });
        },

        beforeDestroy() {
            if (this.destroyDropzone) this.dropzone.destroy();
        },

        methods: {
            clearSuccessFiles(){
                this.files = this.files.filter((file)=>{
                    return file.updateStatus !== "success";
                })
            },
            deleteSelectedFiles(index){
                this.files.splice(index,1);
                this.clearSuccessFiles();
                // this.$forceUpdate();//手動調用更新
            },
            uploadSelectedFiles(){
                this.clearSuccessFiles();
                this.files.filter((file,index)=>{
                    //讀取文件
                    let reader = new FileReader();//新建一個FileReader
                    let fileString = '';
                    reader.onload = (evt) => { //讀取完文件之後會回來這裏
                        fileString = evt.target.result; // 讀取文件內容
                        console.log('fileString',fileString)
                        let webHook = XLSX.read(new Uint8Array(fileString),{type:'array'});
                        console.log("csvData",webHook);
                        let temp = XLSX.utils.sheet_to_json(webHook.Sheets.Sheet1);
                        console.log("json",temp);

                        Meteor.call("admin_uploadFileData",{name:file.name,data:temp},(err,res)=>{
                            if (err) {
                                this.files[index].updateStatus = "success";
                            }else{
                                this.files[index].updateStatus = "success";
                            }
                            this.$forceUpdate();//手動調用更新
                        });
                    };
                    reader.readAsArrayBuffer(file, "UTF-8");//讀取文件
                });
            },
            // 初始化
            init: function() {
                return this.dropzone.init();
            },
            // 銷毀實例
            destroy: function() {
                return this.dropzone.destroy();
            },
            accept: function(file, done) {
                return this.dropzone.accept(file, done);
            },
            addFile: function(file) {
                return this.dropzone.addFile(file);
            },
            removeFile: function(file) {
                this.dropzone.removeFile(file)
            },
            getQueuedFiles: function() {
                return this.dropzone.getQueuedFiles()
            },
            getUploadingFiles: function() {
                return this.dropzone.getUploadingFiles()
            },
            getAddedFiles: function() {
                return this.dropzone.getAddedFiles()
            },
            /**
             * @param { newPath 文件路徑拆開的數組 }
             * @param { level 層級 表示是第幾層 }
             * @param { folder 傳進來的文件夾樹形結構 首次為空數組 }
             */
            singleFolder(newPath, level, folder) {
                let sum = 0;
                const ret = JSON.parse(JSON.stringify(folder));
                // newPath[level] 不能跟folder名字相同
                if (!newPath[level].includes('.')) {
                    // 如果不是空文件夾
                    if (ret.length) {
                        // 如果裏麵有就添加到當前下麵 沒有就添加到這一層
                        for (let i = 0; i < ret.length; i++) {
                            if (newPath[level] == folder[i].name) {
                                if (newPath[level + 1]) {
                                    ret[i].children = this.singleFolder(newPath, level + 1, ret[i].children);
                                    return ret;
                                }
                            } else {
                                sum++;
                            }
                        }
                        // 如果能走到這裏就表示不相等
                        if (sum == ret.length) {
                            const node = {
                                children: [],
                                isDir: true,
                                name: newPath[level],
                                level
                            };
                            ret.push(node);
                            if (newPath[level + 1]) {
                                node.children = this.singleFolder(newPath, level + 1, node.children);
                            }
                        }
                    } else {
                        const node = {
                            children: [],
                            isDir: true,
                            name: newPath[level],
                            level
                        };
                        ret.push(node);
                        // 看後麵還有沒有元素
                        if (newPath[level + 1]) {
                            node.children = this.singleFolder(newPath, level + 1, node.children);
                        }
                    }
                } else {
                    const node = {
                        isDir: false,
                        name: newPath[level],
                        level
                    };
                    ret.push(node);
                }
                return ret;
            },

            /** 查找id
             * @param list 樹形結構
             * @param arr 文件的路徑
             * @param 文件的層級
             * @param 路徑的length
             * return 返回的是 這個圖片是哪個文件夾下對應的id
             */
            findId(list, arr, level, len) {
                let id;
                let i = 0;
                while(i < list.length) {
                    if (list[i].name == arr[level]) {
                        if (level == len) {
                            id = list[i].parentId;
                            return id;
                        }
                        if (arr[level + 1] && !arr[level + 1].includes('.')) {
                            id = this.findId(list[i].children, arr, level + 1, len);
                        }
                    }
                    i++;
                }
                return id;
            },
            //上傳文件夾
            deepUpload(folder, returnParentId) {
                // 如果存在文件夾
                folder.forEach(item => {
                    if (item.isDir) {
                        this.uploadFolder[item.level] = this.uploadFolder[item.level] || [];
                        const id = item.parentId ? item.parentId : returnParentId;
                        // 不存在就開始上傳
                    }
                });
            },
            fileProcess(file) {
                let filename = file.name.split('.');
                let filetype = filename[filename.length-1];
                if (!this.filetypes.includes(filetype)) {
                    this.$message.warning(`您上傳的是${filetype}格式，隻接收${this.filetypes}的格式`);
                    this.removeFile(file);
                    return;
                }

                // 限製大小
                if (Math.floor(file.size > this.limitSize)) {
                    this.$message.warning(`上傳的文件超過${this.limitSize/1024/1024}M最大限製，請先壓縮再上傳！`);
                    this.removeFile(file);
                    return;
                }

                file.updateStatus = "wait";
                let index = this.files.push(file) - 1;
            }
        }
    };
</script>

<style lang="scss">
  @import '../../../node_modules/dropzone/dist/dropzone.css';

  .uploadItem{
    display: flex;
    justify-items: center;
    margin-bottom: 8px;
    .name{
      margin: auto 0;
    }
    .status{
      margin: auto 10px;
      &.error{
        color: red;
      }
      &.success{
        color: green;
      }
    }
  }

  .vue-dropzone {
    width: 500px;
    height: 225px;
    overflow: hidden;
    border: 1px dashed #E5E5E5;
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.2px;
    color: #777;
    transition: background-color .2s linear;
    &:hover {
      background-color: #F6F6F6;
    }
    i {
      color: #CCC;
    }
    .dz-preview {
      .dz-image {
        img:not([src]) {
          width: 200px;
          height: 200px;
        }
        &:hover {
          img {
            transform: none;
            -webkit-filter: none;
          }
        }
      }
      .dz-details {
        bottom: 0;
        top: 0;
        color: white;
        background-color: rgba(33, 150, 243, 0.8);
        transition: opacity .2s linear;
        text-align: left;
        .dz-filename {
          overflow: hidden;
        }
        .dz-filename span,
        .dz-size span {
          background-color: transparent;
        }
        .dz-filename:not(:hover) span {
          border: none;
        }
        .dz-filename:hover span {
          background-color: transparent;
          border: none;
        }
      }
      .dz-progress .dz-upload {
        background: #4094ff;
      }
      .dz-remove {
        position: absolute;
        z-index: 30;
        color: white;
        margin-left: 15px;
        padding: 10px;
        top: inherit;
        bottom: 15px;
        border: 2px white solid;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 1.1px;
        opacity: 0;
      }
      &:hover {
        .dz-remove {
          opacity: 1;
        }
      }
      .dz-success-mark,
      .dz-error-mark {
        margin-left: auto;
        margin-top: auto;
        width: 100%;
        top: 20%;
        left: 0;
        svg {
          margin-left: auto;
          margin-right: auto;
        }
      }
      .dz-error-message {
        top: calc(15%);
        margin-left: auto;
        margin-right: auto;
        left: 0;
        width: 100%;
        &:after {
          bottom: -6px;
          top: initial;
          border-top: 6px solid #a92222;
          border-bottom: none;
        }
      }
    }
    .el-icon-upload {
      font-size: 57px;
    }
    b {
      color: #4094ff;
    }
  }
</style>
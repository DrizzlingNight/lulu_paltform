import Vue from 'vue';
import Vuetify from "vuetify";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css';
import { settings } from '/imports/settings';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: settings.theme === 'seastory' ? {
                        "primary": "#13AA6D",
                        "secondary": "#6DD400",
                        "accent": "#82B1FF",
                        "error": "#CF2C46",
                        "info": "#2196F3",
                        "success": "#4CAF50",
                        "warning": "#FFC107",
                        "btnColor": "#37F4FF",
                        "fontColor": "#F7CD0A",
                        "fontColor2":"#57AAC0",
                        "fontColor3":"#CF2C46",
                        "fontColor4":"#C3C3C3",
                        "borderColor": "#37F4FF",
                        "bgColor":"#014456"
                    } : {
                    "primary": "#13AA6D",
                    "secondary": "#6DD400",
                    "accent": "#82B1FF",
                    "error": "#CF2C46",
                    "info": "#2196F3",
                    "success": "#4CAF50",
                    "warning": "#FFC107",
                    "btnColor": "#59CF9E",
                    "fontColor": "#F7CD0A",
                    "fontColor2":"#95C6B7",
                    "fontColor3":"#CF2C46",
                    "fontColor4":"#C3C3C3",
                    "borderColor": "#2D4742",
                    "bgColor":"#071816",
                    "textColor" : "#498779"
                  }
            
        }
    },
});
    
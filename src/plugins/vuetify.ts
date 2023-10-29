// Icons
import "@mdi/font/css/materialdesignicons.css";

// Vuetify
// Styles
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

// Translations provided by Vuetify
import { de, en, it, fr } from "vuetify/locale";

import { VBtn } from "vuetify/components";

const opts = {
  directives,
  components: {
    ...components,
    ...labsComponents,
  },
  lang: {
    locales: { de, fr, it, en },
    current: "de",
  },
  theme: {
    defaultTheme: "light",
    variations: {
      colors: ["primary", "secondary"],
      lighten: 4,
      darken: 5,
    },
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#0052FF",
        },
      },
    },
  },
  treeShake: true,
  aliases: {
    VBtnPrimary: VBtn,
    VBtnSecondary: VBtn,
    VBtnDev: VBtn,
    VBtnDelete: VBtn,
  },
  defaults: {
    VBtn: {
      variant: "flat",
      style: "text-transform: none;",
      color: undefined,
    },
    VBtnPrimary: {
      color: "primary",
    },
    VBtnSecondary: {
      variant: "outlined",
      color: "primary",
    },
    VBtnDev: {
      variant: "tonal",
      color: "warning",
      prependIcon: "mdi-bug",
    },
    VBtnDelete: {
      variant: "tonal",
      color: "error",
      prependIcon: "mdi-delete",
    },
    VIcon: {
      size: "small",
    },
    VMenu: {
      VCard: {
        class: "rounded-xl",
      },
      VList: {
        rounded: "xl",
      },
    },
    VTextField: {
      variant: "outlined",
      color: "primary",
    },
    VSelect: {
      variant: "outlined",
      color: "primary",
    },
    VAutocomplete: {
      variant: "outlined",
      color: "primary",
    },
  },
};
export default createVuetify(opts);

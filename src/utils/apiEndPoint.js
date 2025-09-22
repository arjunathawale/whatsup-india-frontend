export const endPoints = {
  login: "/users/login",
  register: "/register",
  getClients: "/client",
  getMetaProfile: "/client/getBussinessProfile",
  getClientById: "/client/",
  createClient: "/client",
  updateClient: "/client",
  deleteClient: "/client",
  addOrUpdateConfig: "/client/add-update-config",
  getAllClientCustomers: "/client/getAllClientCustomers",
  plan: "/plan",
  template: "/template",
  syncTemplate: "/template/get-meta-tempaltes",
  templateByClient: "/template/get-by-client",
  getTemplateDropdown: "/template/get-all-templates-dropwdown",
  templateMediaUpload: "/template/upload-media",
  broadcast: "/broadcast/getByClient",
  getBroadcastDetails: "/broadcast/getBroadcastDetails",
  sendBroadcast: "/broadcast",
  bot: "/bot",
  getBotByClient: "/bot/getByClient",
  script: "/manage-script",
  uploadScriptMedia: "/manage-script/upload-media",
  getChatHistory: "/chat-history/getByClient",
};

export const UrlTypeDropdown = [
  {
    id: 1,
    name: "STATIC",
  },
  {
    id: 2,
    name: "DYNAMIC",
  },
];

export const LanguageDropdown = [
  {
    id: 1,
    name: "English(en)",
    code: "en",
  },
  {
    id: 2,
    name: "English(en_US)",
    code: "en_US",
  },
  {
    id: 3,
    name: "English(en_UK)",
    code: "en_UK",
  },
  {
    id: 4,
    name: "Marathi(mr)",
    code: "mr",
  },
  {
    id: 5,
    name: "Hindi(hn)",
    code: "hn",
  },
];

export const HeaderTypeDropdown = [
  {
    id: 1,
    name: "NONE",
  },
  {
    id: 2,
    name: "TEXT",
  },
  {
    id: 3,
    name: "IMAGE",
  },
  {
    id: 4,
    name: "VIDEO",
  },
  {
    id: 5,
    name: "DOCUMENT",
  },
  {
    id: 6,
    name: "LOCATION",
  },
];

export const TemplateCategoryDropdown = [
  {
    id: 1,
    name: "MARKETING",
  },
  {
    id: 2,
    name: "UTILITY",
  },
  {
    id: 3,
    name: "AUTHENTICATION",
  },
];

export const TemplateDropdown = [
  {
    clientId: "",
    templateName: "text_template",
    category: "MARKETING",
    languages: "en",
    headerType: "TEXT",
    header: {
      type: "HEADER",
      format: "TEXT",
      text: "Dear {{1}}",
      example: {
        header_text: ["Rahul"],
      },
    },
    body: {
      type: "BODY",
      text: "Hello {{1}}\nNamaskar {{2}}\n{{3}}\n{{4}}\n{{5}}\n{{6}}\n{{7}}\n{{8}}",
      example: {
        body_text: [
          "Rahu",
          "Hello",
          "sdadada",
          "adasdasfsdgfg",
          "opqwe",
          "dsdadadadasdad",
          "dssssssssssssss",
          "aaaaaaaaaaaaaaaaaaaasdsdsd",
        ],
      },
    },
    footer: {
      type: "FOOTER",
      text: "Footer Name",
    },
    buttons: {
      type: "BUTTONS",
      buttons: [
        {
          type: "URL",
          text: "Visit Now",
          url: "https://www.programiz.com//{{1}}",
          example: ["https://www.programiz.com/java"],
        },
        {
          type: "COPY_CODE",
          text: "Copy Offer Code",
          example: ["XCDSASSAS"],
        },
      ],
    },
    mediaUrl: "",
    mediaId: "",
    status: "APPROVED",
    category: "UTILITY",
    id: "1667192013751005",
  },
];


import CryptoJS from "crypto-js";

const SECRET_KEY = "your_32_character_secret_key";

export function decryptData(encryptedText) {
    try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedText), SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}
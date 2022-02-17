import axios from "axios";
import FormData from "form-data";
import { serialize } from 'object-to-formdata';
import qs from 'qs';
import { Platform } from "react-native";
import AppConfig from "../config/app";
import { store } from "../store";

axios.defaults.xsrfCookieName = 'OTHERCOOKIE';
axios.defaults.xsrfHeaderName = "X-OTHERNAME";
axios.defaults.withCredentials = false;

const request = () => {
    return axios.create({
        baseURL: AppConfig.BASE_URL,
        timeout: AppConfig.TIMEOUT,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    });
}

const requestWithAuth = (useFormData = false) => {
    let user = store.getState().user;

    console.log("Token", user.key);

    return axios.create({
        baseURL: AppConfig.BASE_URL,
        timeout: AppConfig.TIMEOUT,
        headers: {
            "Content-Type": (useFormData ? "application/x-www-form-urlencoded" : "application/json"),
            "Authorization": "token " + user.key,
            "Accept": "*/*",
        }
    });
}

export const HttpRequest = {
    signup(data) {
        return request().post("/rest-auth/registration/", data);
    },
    signupVerification(data) {
        return requestWithAuth().post("/rest-auth/registration/verify-email/", data);
    },
    login(data) {
        return request().post("/rest-auth/login/", data);
    },
    resetPassword(data) {
        return request().post("/rest-auth/password/reset/", data);
    },
    facebookLogin(data) {
        return request().post("/api/v1/facebook/login/", data);
    },
    appleLogin(data) {
        return request().post("/api/v1/apple/login/", data);
    },
    googleLogin(data) {
        return request().post("/api/v1/google/login/", data);
    },
    getSettings() {
        return request().get('/app-settings/');
    },

    getProfile() {
        return requestWithAuth().get("/api/v1/user-profile/");
    },
    getUserProfileList() {
        return requestWithAuth().get("/api/v1/profile/");
    },
    patchUserProfile(data, useFormData = false) {
        console.log("patchUserProfile", data);
        let user_id = store.getState().profile.user.id;
        // console.log(store.getState().user);
        console.log("/api/v1/profile/" + user_id + "/");
        return requestWithAuth(useFormData).patch("/api/v1/profile/" + user_id + "/", data);
    },
    getCurrentProfile() {
        let user_id = store.getState().user.user.id;
        return requestWithAuth().get("/api/v1/profile/" + user_id + "/");
    },
    getOtherUserProfile(user_id) {
        return requestWithAuth().get("/api/v1/profile/" + user_id + "/");
    },

    getProximitySearch(latitude, longitude) {
        return requestWithAuth().get("/api/v1/proximity/search/" + latitude + "/" + longitude + "/");
    },
    searchAddress(address) {
        let apiKey = "AIzaSyAa2HJNJSEi9da844XgklN5DyVRfIWRpdM";
        return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=` + address + `&key=` + apiKey)
    },

    getReviews(user_id) {
        return requestWithAuth().get("/reviews/?user__id=" + user_id);
    },
    getServices(user_id) {
        return requestWithAuth().get("/services/?user__id=" + user_id);
    },
    getServiceSingle(id) {
        return requestWithAuth().get("/services/" + id + "/");
    },
    saveService(data) {
        return requestWithAuth().post("/services/", data);
    },
    deleteService(id) {
        return requestWithAuth().delete("/services/" + id + "/");
    },

    //Requests
    getRequests(id) {
        return requestWithAuth().get("/requests/?provider__id=" + id);
    },
    getRequestsOnCustomer(id) {
        return requestWithAuth().get("/requests/?user__id=" + id);
    },
    saveRequest(data) {
        return requestWithAuth(true).post("/requests/", data);
    },
    patchRequest(id, data) {
        return requestWithAuth().patch("/requests/" + id + "/", data);
    },

    //Vehicles
    getVehicles(user_id) {
        return requestWithAuth().get("/vehicles/?user__id=" + user_id);
    },
    saveVehicle(data) {
        return requestWithAuth().post("/vehicles/", data);
    },
    deleteVehicle(id) {
        return requestWithAuth().delete("/vehicles/" + id + "/");
    },

    //Rating
    getRating(user__id) {
        return requestWithAuth().get("/reviews/?user__id=" + user__id);
    },
    getRatingOfProvider(provider__id) {
        return requestWithAuth().get("/reviews/");
    },
    getRatingOfService(service__id) {
        return requestWithAuth().get("/reviews/?service__id=" + service__id);
    },
    saveRating(data) {
        return requestWithAuth().post("/reviews/", data);
    },

    //Messages
    getMessages(customer_id, provider_id) {
        return requestWithAuth().get("/messages/?from_user=" + customer_id + "&to_user=" + provider_id);
    },
    sendMessage(customer_id, provider_id, message) {
        return requestWithAuth().post("/messages/", {
            from_user: customer_id,
            to_user: provider_id,
            message: message,
            read: false,
        });
    },
};

export const FormDataConverter = {
    convert(data) {
        // let form_data = new FormData();

        // for (let key in data) {
        //     form_data.append(key, data[key]);
        // }

        // return form_data;
        return serialize(data);
    }
};

export const HttpUtils = {
    normalizeUrl(url) {
        if (url != null) {
            return url.substr(0, url.indexOf("?"));
        }
        return null;
    }
};

export const HttpResponse = {
    processMessage(msg, alternateMessage = "Error processing data") {
        if (msg) {
            let data = msg.data;
            let messages = [];
            Object.keys(data).forEach((key) => {
                let arr = data[key];
                if (Array.isArray(arr)) {
                    messages.push(key + " - " + arr.join(" "));
                } else {
                    messages.push(key + " - " + arr);
                }
            });
            if (messages.length == 0) {
                return alternateMessage;
            }
            return messages.join(" ");
        }
        return alternateMessage;
    }
};
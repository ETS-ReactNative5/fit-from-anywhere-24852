import { store } from "../store";
import { setProfiles } from "../store/actions";
import { HttpRequest } from "./http"

export default {
    findProfile(id, dispatch) {
        let oldProfiles = store.getState().profiles;
        if (oldProfiles[id] == null) {
            HttpRequest.getOtherUserProfile(id).then((res) => {
                console.log("HttpRequest.getOtherUserProfile", res.data);
                let allProfiles = { ...store.getState().profiles };
                allProfiles[id] = res.data;
                dispatch(setProfiles(allProfiles));
            }).catch((error) => {
                console.log("HttpRequest.getOtherUserProfile:err", error, error.response);
            });
        }
    },
}
import { store } from "../store";
import { setProfiles, setWorkoutPlans } from "../store/actions";
import { HttpRequest } from "./http"

export default {
    findProfile(id, dispatch) {
        id = id + "";
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

    findWorkoutPlansByPlanId(id, dispatch) {
        id = id + "";
        let oldWorkoutPlans = store.getState().workoutPlans;
        if (oldWorkoutPlans[id] == null) {
            HttpRequest.getWorkoutPlansByPlanId(id).then((res) => {
                console.log("HttpRequest.getWorkoutPlansByPlanId", res.data);
                let workoutPlans = { ...store.getState().workoutPlans };
                workoutPlans[id] = res.data.results;
                dispatch(setWorkoutPlans(workoutPlans));
            }).catch((error) => {
                console.log("HttpRequest.getOtherUserProfile:err", error, error.response);
            });
        }
    },
}
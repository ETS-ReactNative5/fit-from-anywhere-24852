import { setGym, setPrograms } from "../store/actions";
import { HttpRequest } from "./http";

export default {
    async searchGymCode(code, dispatch) {
        if (code != "") {
            let res = await HttpRequest.searchGymCode(code);
            let result = res.data.results;
            if (result.length > 0) {
                let exist = false;
                let _gym = null;
                result.forEach((item) => {
                    if (item.code == code) {
                        exist = true;

                        _gym = item;
                    }
                });
                if (exist == false) {
                    dispatch(setGym(null));
                    return;
                }

                dispatch(setGym(_gym));
            } else {
                dispatch(setGym(null));
                return;
            }
        } else {
            dispatch(setGym(null));
        }
    },
    async getProgramByGymCode(code, dispatch) {
        let res = await HttpRequest.getAllGym();
        let result = res.data.results;

        let trialGym = null;
        let exist = false;
        let _gym = null;
        result.forEach((item) => {
            if (item.code == code) {
                exist = true;

                _gym = item;
            }

            if (item.code == null || item.code == "") {
                trialGym = item;
            }
        });
        if (exist == false) {
            dispatch(setPrograms(trialGym.program));
            return;
        }

        dispatch(setPrograms(_gym.program));
    },
    isCodeExist(code) {
        return new Promise(async (resolve, reject) => {
            if (code == null) {
                code == "";
            }

            let res = await HttpRequest.getAllGym();
            let result = res.data.results;

            let exist = false;
            result.forEach((item) => {
                if (item.code == null) {
                    item.code = "";
                }

                if (item.code == code) {
                    exist = true;
                }
            });
            resolve(exist);
        });
    },
}
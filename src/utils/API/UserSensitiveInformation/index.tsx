import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Tokens, UserDecoded } from "../../Model/Token";
import { User } from "../../Model/User";

export default API => (resource: string) => {
    return {
        user_sensitive_info(accessToken: Tokens["accessToken"]) {
            return API.get(resource+ '?personFields=birthdays,genders', { headers: { Authorization: 'Bearer ' + accessToken }});
        }
    };
};

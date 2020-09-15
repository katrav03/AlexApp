import axios from 'axios';
import API from './API';

export default {
    login: async (data) => {
        try {
            const res = await axios.post(API + '/authenticate/login', data);
            if (res.status == 200) {
                localStorage.setItem('jwtToken', res.data.jwtToken)
                localStorage.setItem('userRole', res.data.userRole)
                return true
            }

        } catch (e) {
            console.log(e);
        }
    },
    searchQuestions: async (data) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            }
            const res = await axios.post(API + '/question/searchQuestions', data, {headers:headers});
            if (res.status == 200) {
                return res
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    answer: async (data,id) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            }
            const res = await axios.post(API + '/answer/addAnswer/'+ id, data, {headers:headers});
            if (res.status == 200) {
                // return res
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}